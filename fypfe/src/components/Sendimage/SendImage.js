import './sendImage.css';
import Drawer from '../Items/Drawer';
import axios from 'axios';
import { requirePropFactory } from '@mui/material';
import * as tf from "@tensorflow/tfjs";


export default function SendImage(){


  async function encode(){
    const MODEL_URL_1 = "http://127.0.0.1:8081/modelEncrypter.json";
    const gantImage1 = document.getElementById('gant1');
    const gantImage2= document.getElementById('gant2');
    let gantTensor1 = tf.image.resizeBilinear(tf.browser.fromPixels(gantImage1).div(255.0), [64,64]);
    let gantTensor2 = tf.image.resizeBilinear(tf.browser.fromPixels(gantImage2).div(255.0), [64,64]);
    try{
    const model = await tf.loadLayersModel(MODEL_URL_1);
    let val = model.predict([gantTensor1.reshape([1,64,64,3]),gantTensor2.reshape([1,64,64,3])]);
    const canvas = document.createElement('canvas');
    val = tf.image.resizeBilinear(val.reshape([64,64,3]),[200,200]);
    canvas.width = val.shape.width
    canvas.height = val.shape.height
    await tf.browser.toPixels(val, canvas);
    let b64 = canvas.toDataURL().split(';base64,')[1];
    console.log(b64);

    }catch(err){
      console.log(err);
    }
    
    //send b64 to server


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
  <img src={require('./cover.jpg')} id="gant1" hidden/>
   <img src={require('./secret.jpg')} id="gant2" hidden/>
  <button type="submit" class="btn btn-success">SUBMIT</button>
    </form>
  </div>
</div>
        </>
    )
}
