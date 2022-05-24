import './sendImage.css';
import Drawer from '../Items/Drawer';
import axios from 'axios';
import { requirePropFactory } from '@mui/material';
import * as tf from "@tensorflow/tfjs";


export default function SendImage(){

  // handleSend(event) {
  //   event.preventDefault();
  //   const contract = this.state.contract;
  //   const account = this.state.accounts[0];

  //   document.getElementById("new-notification-form").reset();
  //   this.setState({ showNotification: true });
  //   contract
  //     .sendIPFS(this.state.formAddress, this.state.formIPFS, { from: account })
  //     .then((result) => {
  //       this.setState({ formAddress: "" });
  //       this.setState({ formIPFS: "" });
  //     });
  // }
  
    
  let gantTensor1 = null;
  let gantTensor2 = null;
  async function encode(){
    const MODEL_URL_1 = "http://127.0.0.1:8081/modelEncrypter.json";

    gantTensor1 = tf.image.resizeBilinear(gantTensor1.div(255.0), [64,64]);
    gantTensor2 = tf.image.resizeBilinear(gantTensor2.div(255.0), [64,64]);

    try{
    const model = await tf.loadLayersModel(MODEL_URL_1);
    let val = model.predict([gantTensor1.reshape([1,64,64,3]),gantTensor2.reshape([1,64,64,3])]);
    const canvas = document.createElement('canvas');
    // val = tf.image.resizeBilinear(val.reshape([64,64,3]),[200,200]);
    val = tf.image.resizeBilinear(val.reshape([64,64,3]),[64,64]);
    canvas.width = val.shape.width
    canvas.height = val.shape.height
    await tf.browser.toPixels(val, canvas);
    // let b64 = canvas.toDataURL().split(';base64,')[1];
    let b64 = canvas.toDataURL();
    let rec = document.getElementById("recwadress").value;
    console.log(b64);
    axios.post('http://localhost:8080/sendimg', {"b64":b64, "recwadress": rec}).then(response=>{
      console.log(response.data)});
    //console.log(b64);
    }catch(err){
      console.log(err);
    }
    

    //send b64 to server

  }


  function uploadCover(e){
    const im = new Image()
    var fr = new FileReader();
    fr.onload = function () {
        im.src = fr.result;
    }
    fr.readAsDataURL(e.target.files[0]);
    im.onload = () => {
      gantTensor1= tf.browser.fromPixels(im);
    }
  }

  function uploadSecret(e){

    const im = new Image()
    var fr = new FileReader();
    fr.onload = function () {
        im.src = fr.result;
    }
    fr.readAsDataURL(e.target.files[0]);
    im.onload = () => {
      gantTensor2= tf.browser.fromPixels(im);
      encode();
    }

  }
  function uploadImage(e){
   encode();
  //  let imageObj={};
  //    let imageFormObj=new FormData();
  //    imageFormObj.append("imageName","multer-image-"+Date.now());
  //     imageFormObj.append("imageData",e.target.files[0]);
  //     imageFormObj.append("recwadress",document.getElementById('recwadress').value);
  //     console.log(e.target.files[0]);
  //     axios.post('http://localhost:8080/sendimg',imageFormObj).then(response=>{
  //           console.log(response.data);
  //         });
  }

    let userWallet=sessionStorage.getItem('walletAdress');

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
      <input type="file" name="coverImg" onChange={(e)=>uploadCover(e)}/>
      <input type="file" name="secretImg" onChange={(e)=>uploadSecret(e)}/>
    </div>
  
  </div>
  <br/>
  <img src={require('./cover.jpg')} id="gant1" hidden/>
   <img src={require('./secret.jpg')} id="gant2" hidden/>
  <button type="submit" class="btn btn-success">SUBMIT</button>
    </form>
  </div>
</div>
        </>
    )
}

