import './recieveimage.css';
import Drawer from '../Items/Drawer';
import axios from 'axios';
import { requirePropFactory } from '@mui/material';
import * as tf from "@tensorflow/tfjs";
import DashboardHeader from '../DashboardHeader/Dashboardheader';
import IPFSInboxContract from "../Sendimage/IPFSInbox.json";
import getWeb3 from "../Sendimage/getWeb3";
import truffleContract from "truffle-contract";


export default function RecieveImage(){

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
  var fromaddress = null;  

  async function encode(){
    const MODEL_URL_1 = "http://127.0.0.1:8081/modelDecrypter.json";


    gantTensor1 = tf.image.resizeBilinear(gantTensor1.div(255.0), [64,64]);
    gantTensor2 = tf.image.resizeBilinear(gantTensor2.div(255.0), [64,64]);

    try{
    const model = await tf.loadLayersModel(MODEL_URL_1);
    let val = model.predict([gantTensor1.reshape([1,64,64,3]),gantTensor2.reshape([1,64,64,3])]);
    const canvas = document.createElement('canvas');
    val = tf.image.resizeBilinear(val.reshape([64,64,3]),[200,200]);
    canvas.width = val.shape.width
    canvas.height = val.shape.height
    await tf.browser.toPixels(val, canvas);
    let b64 = canvas.toDataURL().split(';base64,')[1];
    let rec = document.getElementById("recwadress").value;

    //console.log(b64);
    }catch(err){
      console.log(err);
    }
    

    //send b64 to server

  }
  
    async function recieveNotif(e){
    e.preventDefault();
    const web3 = await getWeb3();
    console.log(web3);
    const contract = truffleContract(IPFSInboxContract);
    contract.setProvider(web3.currentProvider);
    const instance = await contract.deployed();

    instance.inboxResponse().on("data", (result) => {
       var array = result.args[0].split(";");
       fromaddress = array[1]
       //document.getElementById("fileHash").value = result.args[0];
       document.getElementById("fileHash").value = array[0];

    });

    instance.checkInbox({ from: sessionStorage.getItem('walletAdress') });
  }


  async function uploadprivatekey(e){
    // const im = new Image()
    const MODEL_URL_1 = "http://127.0.0.1:8081/modelDecrypter.json";
    const decrypter = await tf.loadLayersModel(MODEL_URL_1);
    var fr = new FileReader();
    fr.onload = async function () {
        console.log("Privatekey:",fr.result);
        console.log(document.getElementById('fileHash').value);
        const canvas = document.createElement('canvas');
        var secret = null;
        axios.post('http://localhost:8080/recvimg', {"filehash":document.getElementById('fileHash').value, "pkey": fr.result, "fromA" : fromaddress, "toA" : sessionStorage.getItem('walletAdress')}).then(response=>   
        {
        console.log(response.data)
        const im = new Image();
        im.src = response.data;
        im.onload = async () => {
          gantTensor2 = tf.image.resizeBilinear(tf.browser.fromPixels(im).div(255.0), [64,64]);
          var secret = decrypter.predict([gantTensor2.reshape([1,64,64,3])]);
          console.log(secret);
  
          secret = tf.image.resizeBilinear(secret.reshape([64,64,3]),[200,200]);
          canvas.width = secret.shape.width
          canvas.height = secret.shape.height
          await tf.browser.toPixels(secret, canvas);
          let b64 = canvas.toDataURL();
          console.log(b64);
          document.getElementById("secret").href = b64;
          alert("Secret Can be Downloaded");

        }
        });

             // console.log(fr.result);
    }
    fr.readAsText(e.target.files[0]);

    // console.log(gantTensor2.shape);
    // console.log(secret);

    // im.onload = () => {
    //   gantTensor1= tf.browser.fromPixels(im);
    // }
    
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
        <DashboardHeader/>
<div className="card cardDesign">
  <div className="card-body">
    <h6 className="card-subtitle mb-2 text-muted cardTitleDesign">Recieve Image</h6>
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
      <input type="text" class="form-control" id="fileHash" name='fileHash' placeholder="File Hash" />
    </div>
  </div>
  <div class="form-group row">
  <label for="exampleInputEmail1">Private Key Upload</label>
    <label for="inputPassword" class="col-sm-2 col-form-label"></label>
    <div class="col-sm-12">
      <input type="file" name="privateKey" onChange={(e)=>uploadprivatekey(e)}/>
      {/* <input type="file" name="secretImg" onChange={(e)=>uploadSecret(e)}/> */}
    </div>
  
  </div>
  <br/>
  {/* <img src={require('./cover.jpg')} id="gant1" hidden/>
   <img src={require('./secret.jpg')} id="gant2" hidden/> */}
  <a download="secret.png" id="secret" href="data:image/png;base64,asdasd...">Download</a>
    <button onClick={(e)=>recieveNotif(e)} class="btn btn-primary">Recieve</button>
  <button type="submit" class="btn btn-success">SUBMIT</button>
    </form>
  </div>
</div>
        </>
    )
}

