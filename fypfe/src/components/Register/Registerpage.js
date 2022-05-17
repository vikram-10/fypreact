import './Registerpage.css';
import axios from 'axios';

function Registerpage(){
  
async function sendData(){
  let userData={
    "name":document.getElementById("inputName").value,
    "wadress":userWallet,
    "userType":document.getElementById('userType').value
      }

	axios.post('http://localhost:8080/reguser',userData,
{
  headers: {
          'Content-Type': 'application/json'
            }
}).then(response => {
      // console.log(response.data);
      function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
      }
      
      // Start file download.
      download("private.key",response.data);
    }).catch(err => {
      console.log(err, err.response);
    });

}

let userWallet=sessionStorage.getItem('walletAdress');
console.log(userWallet);


return(
        <>
<div className="card cardDesign">
  <div className="card-body">
    <h6 className="card-subtitle mb-2 text-muted cardTitleDesign">User Registration</h6>
    <form className='formDesign'>
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
      <input type="text" class="form-control" id="userType" placeholder="Doctor/User" />
    </div>
  </div>
  <button type="submit"  onClick={(e)=>{e.preventDefault(); sendData();}} class="btn btn-success" download>SUBMIT</button>
    </form>
  </div>
</div>
        </>
    )
}

export default Registerpage