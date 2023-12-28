const a=document.getElementsByTagName("button")[0];
const b=document.getElementsByTagName("button")[1];
const m=document.getElementsByClassName("more")[0];

a.addEventListener("click",displaymore);
b.addEventListener("click",displayapply);
let learned=false;
let applied=false;

function displaymore(){
    //const newh1 = document.createElement("h1");
    if(learned==false){
        m.innerHTML=`<h2 class="card-text">Location<h2>
        <h2>Salary<h2>
        <h3>PostDate<h3>
        <p>Description</p>
        `;
        applied=false;
        learned=true;
    }
    else {
        m.innerHTML=``;
        learned=false;
    }
}

function displayapply(){
    //const newh2 = document.createElement("h1");
    if(applied==false){
    m.innerHTML=`<form>
    <div class="form-group">
      <label for="name">Name</label>
      <input type="name" class="form-control" id="name" placeholder="Name">
    </div>
    <div class="form-group">
      <label for="email">Email address</label>
      <input type="email" class="form-control" id="email" placeholder="Enter email">
    </div>
    <div class="form-group">
      <label for="phone">Phone</label>
      <input type="tel" class="form-control" id="phone" pattern="[0-9]{10}" placeholder="Phone Number">
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
    `;
    learned=false;
    applied=true;
    }else{
        m.innerHTML=``;
        applied=false;
    }
    //m.appendChild(newh2);
    
}