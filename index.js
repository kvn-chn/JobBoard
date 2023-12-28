const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); // Import the cors middleware

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });


// Enable CORS for all routes
app.use(cors());

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds (cost factor)

const jwtSecret = 'DzbOAyorY6tjLmFtWMvOaCbLSa2KBho_OCWhFotIZ2ZKEk9cyheusWgF4wjHYXMoq55qIJk4-x4L6bc1NoLwVhuNOh0n1fAJ7kbgiE7VJyfuJvq9AdEf5uTN6HkGzpyctZ01Q8lHbOy9ehO_jNDP-lBuXw';



// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'JobBoard', // The name of your database
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err);
    return;
  }
  console.log('Connected to the database');
});

const table = ['advertisements', 'companies', 'jobapplications', 'people'];



// ------------------------------------------ REGISTER ------------------------------------------



app.post(`/api/${table[3]}/post/register`, (req, res) => {
  const { name, email, password, phone, role } = req.body;

  const verify = `SELECT * FROM ${table[3]} WHERE Email = ?`
  db.query(verify, [email], (err, result) => {
    if (err) {
      console.log(err);
      console.error('No user found: ' + err);
      res.status(500).json({ error: 'Not existing' });
    } else if (result.length > 0) {
      console.log('User exists');
      res.status(500).json({ error: 'User exists' });
    }
    else {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const sql = `INSERT INTO ${table[3]} (Name, Email, Password , Phone, Role) VALUES (?, ?, ?, ?, ?)`;
      query = [name, email, hashedPassword ,phone ,role];
      db.query(sql, query, (err, result) => {
        if (err) {
          console.error('Error creating this user: ' + err);
          return res.json({ success: false });
        } else {
          console.log('Passwords match');
          return res.json({ success: true });
        }
      });
    }
  });
});



// Apply the verifyToken middleware to routes that require authentication
app.post(`/api/${table[3]}/post/login/auth`, verifyToken, (req, res) => {
  console.log('Getting token: ' + req.headers.authorization);
  // Only users with a valid token can access this route
  console.log('Token authentication success');
  return res.json({ success: true, message: 'You have access to the protected resource.' });
});


// Middleware function to verify the JWT token
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ success: false, message: 'No token provided' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err); // Log the error for debugging
      return res.status(401).json({ success: false, message: 'Failed to authenticate token' });
    }

    // If the token is valid, the decoded data is available in `decoded`.
    req.user = decoded;
    console.log(req.user = decoded);
    next();
  });
}





// ------------------------------------------- LOGIN ------------------------------------------




app.post(`/api/${table[3]}/post/login`, (req, res) => {
  const { email, password } = req.body;

  res.setHeader('Content-Type', 'application/json');

  const verify = `SELECT * FROM ${table[3]} WHERE Email = ?`;
  db.query(verify, [email], (err, result) => {
    if (result[0].Password.length > 0) {
      var hashedPassword = result[0].Password;
      bcrypt.compare(password, hashedPassword, (e, resultBcrypt) => {
        if (e) {
          return res.status(500).json({ error: 'Error comparing passwords' });
        } else {
          if (resultBcrypt) {
            console.log('Password match');
            const token = jwt.sign({ email }, jwtSecret, { expiresIn: '1h' });
            return res.json({ success: true, token, result});
          } else {
            console.log('Password does not match');
            return res.json({ success: false });
          }
        }
      });
    }
    else {
      return res.status(400).json({ err : 'No password found in database'});
    }
  });
});



// -------------------------------------------- GET ------------------------------------------


for (const tableName of table) {
  app.get(`/api/${tableName}/total`, (req, res) => {
    db.query(`SELECT count(*) FROM ${tableName}`, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed' });
      } else {
        const TOTAL = result[0]['count(*)'];
        res.status(201).json(TOTAL);
      }
    });
});

app.get(`/api/${tableName}/get`, (req, res) => {
  db.query(`SELECT * FROM ${tableName}`, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed' });
    } else {
      res.json(result);
    }
  });
});

  app.get(`/api/${tableName}/get/:id`, (req, res) => {
    const ID = req.params.id;
    switch(tableName) {
      case "advertisements":
        db.query(`SELECT * FROM ${table[0]} WHERE AdvertisementID = ?`, [ID] , (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to retrieve the columun ' + ID });
          }
          else {
            res.json(result);
          }
        });
      break;
      case "companies":
        db.query(`SELECT * FROM ${table[1]} WHERE CompanyID = ?`, [ID] , (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to retrieve the column' + ID});
          }
          else {
            res.json(result);
          }
        });
      break;
      case "jobapplications":
        db.query(`SELECT * FROM ${table[2]} WHERE ApplicationID = ?`, [ID] ,(err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to retrieve the column ' + ID });
          }
          else {
            res.json(result);
          }
        });
      break;
      case "people":
        db.query(`SELECT * FROM ${table[3]} WHERE PersonID = ?`, [ID] ,(err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to retrieve the column ' + ID });
          }
          else {
            res.json(result);
          }
        });
      break;
    }
  });
}




// -------------------------------------------- POST ------------------------------------------



app.post(`/api/${table[0]}/post`, (req, res) => {
  const { CompanyID, Title , Description , Contract , Location , Salary , PostDate , ExpiryDate} = req.body;
  console.log(req.body);
  if (!CompanyID || !Title || !Description || !Contract || !Location || !Salary || !PostDate || !ExpiryDate) {
    res.status(400).json({ message: "Not all information are provided."});
  }
  else {
    const sql = `INSERT INTO ${table[0]} (CompanyID, Title, Description, Contract ,Location, Salary, PostDate, ExpiryDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const query = [CompanyID, Title , Description , Contract ,Location , Salary , PostDate , ExpiryDate];
    db.query(sql, query, (err, result) => {
      if (err) {
        console.error('Error creating advertisement: ' + err);
        res.status(500).json({ error: 'Failed to create advertisement' });
      } else {
        res.json({ message: 'Advertisement created successfully' , result});
      }
  });
  }
});


app.post(`/api/${table[1]}/post`, (req, res) => {
  const { Name, Location, Industry, Logo } = req.body;
  if (!Name || !Location || !Industry || !Logo) {
    res.status(400).json({ message: "Not all information are provided."});
  }
  else {
    const sql = `INSERT INTO ${table[1]} (Name, Location, Industry) VALUES (?, ?, ?, ?)`;
    const query = [Name, Location, Industry, Logo];
    db.query(sql, query, (err, result) => {
      if (err) {
        console.error('Error creating companies: ' + err);
        res.status(500).json({ error: 'Failed to create company' });
      } else {
        res.json({ message: 'Company created successfully' , result});
      }
    });
  }
});


app.post(`/api/${table[2]}/post`, (req, res) => {
  const { AdvertisementID , CompanyID ,PersonID, ApplicationDate , Message, CV} = req.body;
  if (!AdvertisementID || !CompanyID || !PersonID || !ApplicationDate || !Message || !CV) {
    res.status(400).json({ message: "Not all information are provided."});
  }
  else {
    const sql = `INSERT INTO ${table[2]} (AdvertisementID, CompanyID, PersonID, ApplicationDate, Message, CV) VALUES (?, ?, ?, ?, ?, ?)`;
    const query = [AdvertisementID, CompanyID, PersonID, ApplicationDate, Message, CV];
    db.query(sql, query, (err, result) => {
      if (err) {
        console.error('Error creating job application: ' + err);
        res.status(500).json({ error: 'Failed to create job application' });
      } else {
        res.status(201).json({ message: 'Job application created successfully' });
      }
    });
  }
});


app.post(`/api/${table[3]}/post`, (req, res) => {
  const { Name, Email, Password, Phone, Role , CompanyID} = req.body;
  const phoneRegex = /^(0)[1-9](\d{8}|\d{9})$/;
  if (!Name || !Email || !Password || !Phone || !Role) {
    res.status(400).json({ message: "Not all information are provided."});
  }
  else if (!Phone.match(phoneRegex)) {
    return res.status(400).json({ error: 'Invalid phone number format' });
  }
  else {
    const verify = `SELECT * FROM ${table[3]} WHERE Email = ?`
    db.query(verify, [Email], (err, result) => {
      if (err) {
        console.log(err);
        console.error('No user found: ' + err);
        res.status(500).json({ error: 'Not existing' });
      } else if (result.length > 0) {
        console.log('User exists');
        res.status(500).json({ error: 'User exists' });
      }
      else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(Password, salt);

        let m = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        console.log(Email.match(m));
        if (!Email.match(m)) {
          console.log("Not a valid email");
          res.status(400).json({ message: "Not a valid email"});
        }
        else {
          console.log("valid email");
          if (CompanyID !== '') {
            const sql = `INSERT INTO ${table[3]} (Name, Email, Password , Phone, Role, CompanyID) VALUES (?, ?, ?, ?, ?, ?)`;
            query = [Name, Email, hashedPassword ,Phone ,Role, CompanyID];
            db.query(sql, query, (err, result) => {
              if (err) {
                console.error('Error creating this user: ' + err);
                return res.json({ success: false });
              } else {
                console.log('Passwords match');
                return res.json({ success: true });
              }
            });
          }
          else {
            const sql = `INSERT INTO ${table[3]} (Name, Email, Password , Phone, Role) VALUES (?, ?, ?, ?, ?)`;
            query = [Name, Email, hashedPassword ,Phone ,Role];
            db.query(sql, query, (err, result) => {
              if (err) {
                console.error('Error creating this user: ' + err);
                return res.json({ success: false });
              } else {
                console.log('Passwords match');
                return res.json({ success: true });
              }
            });
          }
        }
      }
    });
  }  
});



// -------------------------------------------- PUT ------------------------------------------


app.put(`/api/${table[0]}/put/:id`, (req, res) => {
  const ID = req.params.id;
  const { CompanyID, Title , Description , Contract ,Location , Salary , PostDate , ExpiryDate } = req.body;
  const sql = `UPDATE ${table[0]} SET CompanyID = ?, Title = ?, Description = ?, Contract = ? ,Location = ?, Salary = ?, PostDate = ?, ExpiryDate = ? WHERE Advertisement = ?`;
  const query = [CompanyID, Title , Description , Contract , Location , Salary , PostDate , ExpiryDate, ID];
  db.query(sql, query, (err, result) => {
    if (err) {
      console.error('Error updating advertisement: ' + err);
      res.status(500).json({ error: 'Failed to update advertisement' });
    } else {
      res.status(201).json({ message: 'Advertisement updated successfully' });
    }
  });
});


app.put(`/api/${table[1]}/put/:id`, (req, res) => {
  const ID = req.params.id;
  const { Name, Location, Industry } = req.body;
  const sql = `UPDATE ${table[1]} SET Name = ?, Location = ?, Industry = ? WHERE CompanyID = ?`;
  const query = [Name, Location, Industry, ID];
  db.query(sql, query, (err, result) => {
    if (err) {
      console.error('Error updating company: ' + err);
      res.status(500).json({ error: 'Failed to update company' });
    } else {
      res.status(201).json({ message: 'Company updated successfully' });
    }
  });
});


app.put(`/api/${table[2]}/put/:id`, (req, res) => {
  const ID = req.params.id;
  const { AdvertisementID , CompanyID , PersonID, ApplicationDate } = req.body;
  const sql = `UPDATE ${table[2]} SET AdvertisementID = ?, CompanyID = ?, PersonID = ?, ApplicationDate = ? WHERE ApplicationID = ?`;
  const query = [AdvertisementID , CompanyID , PersonID, ApplicationDate, ID];
  db.query(sql, query, (err, result) => {
    if (err) {
      console.error('Error updating job application: ' + err);
      res.status(500).json({ error: 'Failed to update job application' });
    } else {
      res.status(201).json({ message: 'Job application updated successfully' });
    }
  });
});


app.put(`/api/${table[3]}/put/:id`, (req, res) => {
  const ID = req.params.id;
  const { Name, Email, Phone, Role } = req.body;

  const verify = `SELECT * FROM ${table[3]} WHERE Email = ?`
  db.query(verify, [Email], (err, result) => {
    if (err) {
      console.log(err);
      console.error('No email found: ' + err);
      res.status(500).json({ error: 'Not existing' });
    } else if (result.length > 0) {
      console.log('Email exists');
      res.status(500).json({ error: 'Email exists' });
    }
    else {
      const sql = `UPDATE ${table[3]} SET Name = ?, Email = ?, Phone = ?, Role = ? WHERE PersonID = ?`;
      const query = [Name, Email, Phone ,Role, ID];
      db.query(sql , query, (err,result) => {
        if (err) {
          console.error('Error updating people: ' + err);
          res.status(500).json({ error: 'Failed to update people' });
        } else {
          res.status(201).json({ message: 'People updated successfully' });
        }
    });
    }
});
});


// ------------------------------------------- DELETE ------------------------------------------

for (const tableName of table) {
  app.delete(`/api/${tableName}/delete/:id`, (req, res) => {
    const ID = req.params.id;
    switch(tableName) {
      case "advertisements":
        db.query('DELETE FROM Advertisements WHERE AdvertisementID = ?', [ID] , (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to delete advertisment' });
          }
          else {
            res.status(201).json({ message: 'Advertisement deleted successfully' });
          }
        });
      break;
      case "companies":
        db.query(`DELETE FROM Companies WHERE CompanyID = ?`, [ID] , (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to delete company' });
          }
          else {
            res.status(201).json({ message: 'Company deleted successfully' });
          }
        });
      break;
      case "jobapplications":
        db.query(`DELETE FROM JobApplications WHERE ApplicationID = ?`, [ID] ,(err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to delete job application' });
          }
          else {
            res.status(201).json({ message: 'Job application deleted successfully' });
          }
        });
      break;
      case "people":
        db.query(`DELETE FROM People WHERE PersonID = ?`, [ID] ,(err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to delete people' });
          }
          else {
            res.status(201).json({ message: 'People deleted successfully' });
          }
        });
      break;
    }
  });
}

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }
  console.log('body',req.body);
  console.log('buffer',req.file.buffer);
  const query = `INSERT INTO ${table[1]} (Name , Location , Industry ,Logo) VALUES (?, ?, ?, ?)`;
  const val = [req.body.Name, req.body.Location, req.body.Industry, req.file.buffer];
  db.query(query, val, (err, result) => {
    if (err) res.status(400).json({ message : 'Failed to add'});
    else res.json({ result });
  })
});

const uploadCV = multer({ storage: multer.memoryStorage() });

app.post('/api/upload/cv', uploadCV.single('pdf'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  } else {
    console.log('body', req.body);
    console.log('buffer', req.file.buffer);
    const query = `INSERT INTO ${table[2]} (AdvertisementID, CompanyID, PersonID, ApplicationDate, Message, CV) VALUES (?, ?, ? , ?, ?, ?)`;
    const val = [req.body.AdvertisementID, req.body.CompanyID, req.body.PersonID, req.body.ApplicationDate, req.body.Message, req.file.buffer];
    db.query(query, val, (err, result) => {
      if (err) res.status(400).json({ message: 'Failed to add' });
      else res.json({ result });
    });
  }
})


app.get('/api/companies/photo/get/:id', (req, res) => {
  const photoId = req.params.id;
  const sql = 'SELECT Logo FROM companies WHERE CompanyID = ?';
  db.query(sql, [photoId], (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).send('Error retrieving photo');
      } else if (result.length > 0) {
          const photoData = result[0].Logo;
          res.contentType('image/*'); // Set the content type based on your image type
          res.send(photoData);
      } else {
          res.status(404).send('Photo not found');
      }
  });
});

app.get('/api/jobapplications/cv/get/:id', (req, res) => {
  const ID = req.params.id;
  const sql = 'SELECT CV FROM jobapplications WHERE ApplicationID = ?';
  db.query(sql, [ID], (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).send('Error retrieving CV');
      } else if (result.length > 0) {
          const Data = result[0].CV;
          res.contentType('.pdf'); // Set the content type based on your image type
          res.send(Data);
      } else {
          res.status(404).send('CV not found');
      }
  });
});

app.get(`/api/${table[2]}/get/offer/:id`, (req, res) => {
  const ID = req.params.id;
  const sql = 'SELECT * FROM jobapplications WHERE PersonID = ?';
  db.query(sql, [ID], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving offer from this user');
    }
    else if (result.length > 0) {
      res.json({ message : 'Found offers', result});
    }
    else {
      res.status(400).send('No offer found for this user');
    }
  });
})

app.get(`/api/${table[2]}/get/offer/company/:id`, (req, res) => {
  const ID = req.params.id;
  const sql = 'SELECT * FROM jobapplications WHERE CompanyID = ?';
  db.query(sql, [ID], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving offer from this company');
    }
    else if (result.length > 0) {
      res.json({ message : 'Found applications', result});
    }
    else {
      res.status(400).send('No applications found for this user');
    }
  });
})

app.get(`/api/${table[0]}/get/company/:id`, (req, res) => {
  const ID = req.params.id;
  const sql = 'SELECT * FROM advertisements WHERE CompanyID = ?';
  db.query(sql, [ID], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving offer from this company');
    }
    else if (result.length > 0) {
      res.json({result});
    }
    else {
      res.status(400).send('No ad found for this user');
    }
  });
})

