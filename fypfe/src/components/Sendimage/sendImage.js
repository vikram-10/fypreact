import './sendImage.css';
import Drawer from '../Items/Drawer';
import axios from 'axios';

export default function SendImage(){

  // function submitForm(e){
  //   e.preventDefault();

  //   axios.post('http://localhost:8080/sendimg', recwalletaddr,
  //   {
  //     headers: {
  //             'Content-Type': 'application/json'
  //               }
  //   }).then(response=>{
  //     console.log(response);
  //   });
  // }

  function uploadImage(e){
   let imageObj={};

     let imageFormObj=new FormData();
     imageFormObj.append("imageName","multer-image-"+Date.now());
      imageFormObj.append("imageData",e.target.files[0]);
      imageFormObj.append("recwadress",document.getElementById('recwadress').value);
      console.log(e.target.files[0]);
      axios.post('http://localhost:8080/sendimg',imageFormObj).then(response=>{
            console.log(response.data);
          });
  }

    let userWallet=sessionStorage.getItem('walletAdress');
console.log(userWallet);


    return(
        <>
        <Drawer/>
<div className="card cardDesign">
  <div className="card-body">
    <h6 className="card-subtitle mb-2 text-muted cardTitleDesign">Send Image</h6>
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
      <input type="text" class="form-control" id="recwadress" name='recwalletaddr' placeholder="Receiver Wallet Address" />
    </div>
  </div>
  <div class="form-group row">
  <label for="exampleInputEmail1">Image Upload</label>
    <label for="inputPassword" class="col-sm-2 col-form-label"></label>
    <div class="col-sm-12">
      <input type="file" id="userType" name="imageData" onChange={(e)=>uploadImage(e)}/>
    </div>
  </div>
  <br/>
  <button type="submit" class="btn btn-success">SUBMIT</button>
    </form>
  </div>
</div>
        </>
    )
}