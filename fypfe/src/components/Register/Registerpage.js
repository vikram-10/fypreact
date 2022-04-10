import './Registerpage.css';
import axios from 'axios';

function Registerpage(){
  
async function sendData(event){
  event.preventDefault();


  let userData={
    "name":document.getElementById("userName").value,
    "wadress":document.getElementById('inputName').value,
    "userType":document.getElementById('userType').value

}

console.log(userData.name);

// 	axios.post('http://localhost:8080/reguser',userData,
// {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       }
//     )
//     .then(response => {
//       console.log(response.data);
//     })
//     .catch(err => {
//       console.log(err, err.response);
//     });
}

let userWallet=sessionStorage.getItem('walletAdress');
console.log(userWallet);
return(
        <>
<div className="card cardDesign">
  <div className="card-body">
    <h6 className="card-subtitle mb-2 text-muted cardTitleDesign">User Registration</h6>
    <form className='formDesign' onSubmit={sendData()} method="post">
  <div class="form-group row">
    <div class="col-sm-12">
    <label for="exampleInputEmail1">Your Wallet Address:</label>
      <input type="text" readonly class="form-control-plaintext" name='userWallet' id="staticEmail" value={userWallet} />
    </div>
  </div>
  <div class="form-group row">
    <label for="inputName" class="col-sm-2 col-form-label"></label>
    <div class="col-sm-12">
      <input type="text" class="form-control" id="inputName" name='userName' placeholder="Name" />
    </div>
  </div>
  <div class="form-group row">
    <label for="inputPassword" class="col-sm-2 col-form-label"></label>
    <div class="col-sm-12">
      <input type="text" class="form-control" id="inputType" name='userType' placeholder="Doctor/User" />
    </div>
  </div>
  <button type="button" class="btn btn-success">SUBMIT</button>
    </form>
  </div>
</div>
        </>
    )
}

export default Registerpage