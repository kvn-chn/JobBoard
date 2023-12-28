const apiUrl = 'http://localhost:3000/api';

const peopleBtn = document.getElementById("people");
const advBtn = document.getElementById("adv");
const compBtn = document.getElementById("comp");
const jobBtn = document.getElementById("job");

const tableHeaders = {
  people: ["PersonID", "Name", "Email","Password","Phone", "Role", "CompanyID"],
  advertisements: ["AdvertisementID", "CompanyID", "Title", "Description", "Contract", "Location", "Salary", "PostDate", "ExpiryDate"],
  companies: ["CompanyID", "Name", "Location", "Industry","Logo"],
  jobapplications: ["ApplicationID", "AdvertisementID", "CompanyID","PersonID", "ApplicationDate","Message","CV"]
};

const tableTitles = {
  people: "People",
  advertisements: "Advertisements",
  companies: "Companies",
  jobapplications: "JobApplications"
};

const tableBody = document.getElementById("TableBody");
const tableTitle = document.getElementsByTagName("h1")[0];
const tableHeaderRow = document.getElementsByTagName("tr")[0];
const forAdd=document.getElementById("forAdd");
let OneAdd=false;
window.addEventListener("load",fetchAndPopulateTable("people"));
function fetchAndPopulateTable(endpoint) {
  fetch(`${apiUrl}/${endpoint}/get`)  
    .then(response => response.json())
    .then(data => {
      tableTitle.innerHTML = tableTitles[endpoint];
      tableHeaderRow.innerHTML = tableHeaders[endpoint].map(header => `<th>${header}</th>`).join('');

      tableBody.innerHTML = "";
      const celladd=document.createElement("td");
      const AddCell = document.createElement("button");
      AddCell.className = "btn btn-primary";
      AddCell.innerHTML="Add";
      celladd.appendChild(AddCell);
      

      const row1 = document.createElement("tr");
      const cell = document.createElement("td");
      cell.textContent = "";
      row1.appendChild(cell);
      for (let y = 1; y < tableHeaders[endpoint].length; y++) {
          const cell = document.createElement("td");
          cell.textContent = "";
        if(tableHeaders[endpoint][y]=="Logo"){
          const input = document.createElement("input");
          input.className = "form-control";
          input.type="file";
          input.accept="image/*";
          input.name="image";
          cell.appendChild(input);
          row1.appendChild(cell);
        }
        else if(tableHeaders[endpoint][y]=="CV"){
          const input = document.createElement("input");
          input.className = "form-control";
          input.type="file";
          input.accept=".pdf";
          input.name="pdf";
          cell.appendChild(input);
          row1.appendChild(cell);
        }
        else if(tableHeaders[endpoint][y]=="Contract"){
          // console.log("here");
           const slt=document.createElement("select");
           slt.className="form-select";
           slt.id="contracts";
           slt.name="contracts";
           const apprentice=document.createElement("option");
           apprentice.value="Apprentices";
           apprentice.innerHTML="Apprentices";
           const CDI=document.createElement("option");
           CDI.value="CDI";
           CDI.innerHTML="CDI";
           const CDD=document.createElement("option");
           CDD.value="CDD";
           CDD.innerHTML="CDD";
           slt.appendChild(apprentice);
           slt.appendChild(CDI);
           slt.appendChild(CDD);
           cell.appendChild(slt);
           row1.appendChild(cell);
         }
        else if(tableHeaders[endpoint][y]=="Role"){
          const slt=document.createElement("select");
          slt.className="form-select";
          slt.id="roles";
          slt.name="roles";
          const admin=document.createElement("option");
          admin.value="Admin";
          admin.innerHTML="Admin";
          const candidat=document.createElement("option");
          candidat.value="Candidate";
          candidat.innerHTML="Candidate";
          const company=document.createElement("option");
          company.value="Company";
          company.innerHTML="Company";
          slt.appendChild(admin);
          slt.appendChild(candidat);
          slt.appendChild(company);
          cell.appendChild(slt);
          row1.appendChild(cell);
        }
        else if(tableHeaders[endpoint][y].includes("CompanyID")){
          const slt=document.createElement("select");
          const nullOption = document.createElement("option");
          slt.className="form-select";
          slt.id="Companies";
          slt.name="Companies";
          nullOption.value = ""; 
          nullOption.text = "Select an option"; 

          slt.appendChild(nullOption); 

          fetch(`${apiUrl}/Companies/get`)  
          .then(response => response.json())
          .then(data => {
            data.forEach(item =>{
              const admin=document.createElement("option");
              admin.value=item.CompanyID;
              admin.innerHTML=item.Name;
              slt.appendChild(admin);
            })
          })
          
          cell.appendChild(slt);
          row1.appendChild(cell);
        }
        else if(tableHeaders[endpoint][y].includes("AdvertisementID")){
          const slt=document.createElement("select");
          slt.className="form-select";
          slt.id="Advertisements";
          slt.name="Advertisements";
          fetch(`${apiUrl}/Advertisements/get`)  
          .then(response => response.json())
          .then(data => {
            data.forEach(item =>{
              const admin=document.createElement("option");
              admin.value=item.AdvertisementID;
              admin.innerHTML=item.Title;
              slt.appendChild(admin);
            })
          })
          
          cell.appendChild(slt);
          row1.appendChild(cell);
        }
        else if(tableHeaders[endpoint][y].includes("PersonID")){
          const slt=document.createElement("select");
          slt.className="form-select";
          slt.id="People";
          slt.name="People";
          fetch(`${apiUrl}/People/get`)  
          .then(response => response.json())
          .then(data => {
            data.forEach(item =>{
              const admin=document.createElement("option");
              admin.value=item.PersonID;
              admin.innerHTML=item.Name;
              slt.appendChild(admin);
            })
          })
          
          cell.appendChild(slt);
          row1.appendChild(cell);
        }
        else{
          const input = document.createElement("input");
          input.className = "form-control";
          cell.appendChild(input);
          row1.appendChild(cell);
      }
    }

      AddCell.addEventListener("click", function () {
        
        const row = this.parentNode.parentNode;
        const rowData = {};
        let check=true;

        for (let index = 1; index < row.cells.length; index++) {
          const key = tableHeaders[endpoint][index];
          const input = row.cells[index].querySelector("input");
          if (input) {
            
            if(input.type!=="file"){
              
          if (key === "Email") {
            
            let m = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (input.value.match(m)) {
                console.log("valid email");
                check = true;
            } else {
                console.log("not a valid email");
                check = false;
            }
          }
          if (key === "Phone") {
            let m = /^(0)[1-9](\d{8}|\d{9})$/;
            if (input.value.match(m)) {
                console.log("valid phone");
                check = true;
            } else {
                console.log("not a valid phone");
                check = false;
            }
          }
          if (input.value!=="") {
            rowData[key] = input.value;
          }
        }else{
          const input = row.cells[index].querySelector("input");
            //console.log(input.files[0]);
            if(input.name=="image"){
              sendphoto(input, rowData,endpoint);
              console.log('file', input.files[0]);
            }
            else if(input.name=="pdf"){
              console.log('rowData',rowData);
              console.log('file',input.files[0]);
              sendcv(input, rowData,endpoint);
            }
            check=false;
            console.log(input);
        }
          }else{
            
            const input = row.cells[index].querySelector("select");
            //console.log(input.value);
            if (input) {
            rowData[key] = input.value;
            }
          }
        }
      
        if(check){
          createItem(endpoint, rowData,endpoint);
        }
      });
      
      row1.appendChild(celladd);

      tableBody.appendChild(row1);

      data.forEach(item => {
        
        const row = document.createElement("tr");
        row.setAttribute("id", item[Object.values(item)[0]]);

        const celldel = document.createElement("td");
        const deleteCell = document.createElement("button");
        deleteCell.className = "btn btn-danger";
        celldel.appendChild(deleteCell);

        const celledit = document.createElement("td");
        const editCell = document.createElement("button");
        editCell.className = "btn btn-warning";
        celledit.appendChild(editCell);

        Object.keys(item).forEach(key => { 
          const cell = document.createElement("td");
          cell.textContent = item[key];
         if(key.includes("Logo")){
          const photo=document.createElement("img");
          photo.width="50";
          photo.height="50";
          photo.alt="no photo";
          photo.src="";
          getphoto(item["CompanyID"],photo);
          cell.textContent="";
          cell.appendChild(photo);
         }else if(key.includes("CV")){
          const cv=document.createElement("a");
          cv.href="";
          getcv(item["ApplicationID"],cv);
          cv.textContent="Link";
          cv.target="_blank";
          cv.download="cv.pdf";
          cell.textContent="";
          cell.appendChild(cv);
         }
         row.appendChild(cell);
        });
        deleteCell.textContent = "Delete";
        editCell.innerHTML = "Edit";

        row.id = Object.values(item)[0];
        deleteCell.addEventListener("click", () => deleteItem(endpoint, Object.values(item)[0]));

        editCell.addEventListener("click", function () {
          const rowData = item;
          const row = this.parentNode.parentNode;

          let checkmail=true;

          if (!row.getAttribute("data-editing")) {
            row.setAttribute("data-editing", "true");

            Object.keys(rowData).forEach((key, index) => {
              if (!key.includes("ID")&!key.includes("Password")) { 
                const cell = row.cells[index];
                if(key.includes("Role")){
                  const slt=document.createElement("select");
                  slt.className="form-select";
                  slt.id="roles";
                  slt.name="roles";
                  const admin=document.createElement("option");
                  admin.value="Admin";
                  admin.innerHTML="Admin";
                  const candidat=document.createElement("option");
                  candidat.value="Candidat";
                  candidat.innerHTML="Candidat";
                  const company=document.createElement("option");
                  company.value="Recruiter";
                  company.innerHTML="Recruiter";
                  cell.textContent = "";
                  slt.appendChild(admin);
                  slt.appendChild(candidat);
                  slt.appendChild(company);
                  cell.appendChild(slt);
                }else{
                  //const cell = row.cells[index];
                  const input = document.createElement("input");
                  input.className = "form-control";
                  input.value = rowData[key];
                  cell.textContent = "";
                  cell.appendChild(input);
                }
                  

              }
            });

            editCell.textContent = "Save";
          } else {
            row.setAttribute("data-editing", "false");

            const updatedData = {};
            Object.keys(rowData).forEach((key, index) => {
              if (!key.includes("ID")&!key.includes("Password")) {
                const cell = row.cells[index];
                const input = cell.querySelector("input");
                // if(){

                // }
                
                  if (key.includes("Email")) {
                    let m = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    if (input.value.match(m)) {
                        console.log("valid email");
                        checkmail = true;
                    } else {
                        console.log("not a valid email");
                        checkmail = false;
                    }
                  }
                  if(input){
                    if (input && input.value !== null) {
                      updatedData[key] = input.value;
                      if(key.includes("Email")&checkmail!==true){
                        updatedData[key] = rowData["Email"];
                      }
                    }
                    if(checkmail!==true){
                      cell.textContent =rowData["Email"];
                      checkmail=true;
                    }
                    cell.textContent = input.value;   
                }else{
                  const input = cell.querySelector("select");
                  //console.log(input.value);
                  if (input) {
                    updatedData[key] = input.value;
                    cell.textContent = input.value; 
                  }
                }
                
            }
            });
            editCell.textContent = "Edit";
            if(checkmail===true){
              updateItem(endpoint, rowData[Object.keys(rowData)[0]], updatedData);
            }
            row.removeAttribute("data-editing"); 
          }
        });
        row.appendChild(celledit);
        row.appendChild(celldel);
        tableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error fetching information: ' + error);
    });
}

peopleBtn.addEventListener('click', () => fetchAndPopulateTable('people'));
advBtn.addEventListener('click', () => fetchAndPopulateTable('advertisements'));
compBtn.addEventListener('click', () => fetchAndPopulateTable('companies'));
jobBtn.addEventListener('click', () => fetchAndPopulateTable('jobapplications'));

function sendcv(cv, tmpData, endpoint) {
  const formData = new FormData();
  console.log('tmpData', tmpData);
  formData.append('pdf', cv.files[0]); // Use the selected file from the input
  formData.append('AdvertisementID', tmpData.AdvertisementID);
  formData.append('CompanyID', tmpData.CompanyID);
  formData.append('PersonID', tmpData.PersonID);
  formData.append('ApplicationDate', tmpData.ApplicationDate);
  formData.append('Message', tmpData.Message);

  console.log('formdata', formData);

  fetch(`http://localhost:3000/api/upload/cv`, {
    method: 'POST',
    body: formData,
    // Don't send tmpData here
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok (Status: ${response.status})`);
      }
      return response.json(); // Handle the response from the server as needed
    })
    .then(() => {
      fetchAndPopulateTable(endpoint); // Call the function after a successful create
    })
    .catch((error) => {
      console.error('Upload failed:', error);
    });
}

function getcv(id, CvElement) {
  fetch(`${apiUrl}/jobapplications/cv/get/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok (Status: ${response.status})`);
      }
      return response.blob();
    })
    .then(blob => {
      const url = URL.createObjectURL(blob);
      console.log(url); 
      CvElement.setAttribute('href', url); // Set the image source
    })
    .catch(error => {
      console.error(error);
      CvElement.setAttribute('href', ''); // Set an error image
    });
}

function sendphoto(image, tmpData,endpoint) {
  const formData = new FormData();
  console.log(tmpData);
  formData.append('image', image.files[0]); // Use the selected file from the input
  formData.append('Name', tmpData.Name);
  formData.append('Location', tmpData.Location);
  formData.append('Industry', tmpData.Industry);
  console.log('formdata', formData);

  fetch(`${apiUrl}/upload`, {
    method: 'POST',
    body: formData,

    // Don't send tmpData here
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok (Status: ${response.status})`);
      }
      return response.json(); // Handle the response from the server as needed
    })
    .then(() => {
      fetchAndPopulateTable(endpoint); // Call the function after a successful create
    })
    .catch((error) => {
      console.error('Upload failed:', error);
    });
}


function getphoto(id, imageElement) {
  fetch(`${apiUrl}/companies/photo/get/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok (Status: ${response.status})`);
      }
      return response.blob();
    })
    .then(blob => {
      const url = URL.createObjectURL(blob);
      imageElement.setAttribute('src', url); // Set the image source
    })
    .catch(error => {
      console.error(error);
      imageElement.setAttribute('src', 'error-image.jpg'); // Set an error image
    });
}

function createItem(endpoint, newData) {
  fetch(`${apiUrl}/${endpoint}/post`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  })
    .then((response) => {
      if (response.ok) {
        console.log('Create successful');
        return response.json(); // Return the response for chaining
      } else {
        console.error('Create failed');
      }
    })
    .then(() => {
      fetchAndPopulateTable(endpoint); // Call the function after a successful create
    })
    .catch((error) => {
      console.error('Error creating item: ' + error);
    });
}

function updateItem(endpoint, id, updatedData) {
  fetch(`${apiUrl}/${endpoint}/put/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  })
    .then((response) => {
      if (response.ok) {
        console.log('Update successful');
        return response.json(); // Return the response for chaining
      } else {
        console.error('Update failed');
      }
    })
    .then(() => {
      fetchAndPopulateTable(endpoint); // Call the function after a successful update
    })
    .catch((error) => {
      console.error('Error updating information: ' + error);
    });
}

function deleteItem(endpoint, id) {
  let check=true;
  fetch(`${apiUrl}/${endpoint}/delete/${id}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .catch((error) => {
      console.error('Error fetching information: ' + error);
      check=false;
    });
    if(check==true){
      document.getElementById(id).remove();
    }
}