import './recievedtable.css';
import Drawer from '../Items/Drawer';
import axios from 'axios';
import { requirePropFactory } from '@mui/material';
import * as tf from "@tensorflow/tfjs";
import DashboardHeader from '../DashboardHeader/Dashboardheader';
import IPFSInboxContract from "../Sendimage/IPFSInbox.json";
import getWeb3 from "../Sendimage/getWeb3";
import truffleContract from "truffle-contract";


export default function Recievedtable(){

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
  
    
//   let gantTensor1 = null;
//   let gantTensor2 = null;
//   var fromaddress = null;  

//   async function encode(){
//     const MODEL_URL_1 = "http://127.0.0.1:8081/modelDecrypter.json";


//     gantTensor1 = tf.image.resizeBilinear(gantTensor1.div(255.0), [64,64]);
//     gantTensor2 = tf.image.resizeBilinear(gantTensor2.div(255.0), [64,64]);

//     try{
//     const model = await tf.loadLayersModel(MODEL_URL_1);
//     let val = model.predict([gantTensor1.reshape([1,64,64,3]),gantTensor2.reshape([1,64,64,3])]);
//     const canvas = document.createElement('canvas');
//     val = tf.image.resizeBilinear(val.reshape([64,64,3]),[200,200]);
//     canvas.width = val.shape.width
//     canvas.height = val.shape.height
//     await tf.browser.toPixels(val, canvas);
//     let b64 = canvas.toDataURL().split(';base64,')[1];
//     let rec = document.getElementById("recwadress").value;

//     //console.log(b64);
//     }catch(err){
//       console.log(err);
//     }
    

//     //send b64 to server

//   }
  
//     async function recieveNotif(e){
//     e.preventDefault();
//     const web3 = await getWeb3();
//     console.log(web3);
//     const contract = truffleContract(IPFSInboxContract);
//     contract.setProvider(web3.currentProvider);
//     const instance = await contract.deployed();

//     instance.inboxResponse().on("data", (result) => {
//        var array = result.args[0].split(";");
//        fromaddress = array[1]
//        //document.getElementById("fileHash").value = result.args[0];
//        document.getElementById("fileHash").value = array[0];

//     });

//     instance.checkInbox({ from: sessionStorage.getItem('walletAdress') });
//   }


//   async function uploadprivatekey(e){
//     // const im = new Image()
//     const MODEL_URL_1 = "http://127.0.0.1:8081/modelDecrypter.json";
//     const decrypter = await tf.loadLayersModel(MODEL_URL_1);
//     var fr = new FileReader();
//     fr.onload = async function () {
//         console.log("Privatekey:",fr.result);
//         console.log(document.getElementById('fileHash').value);
//         const canvas = document.createElement('canvas');
//         var secret = null;
//         axios.post('http://localhost:8080/recvimg', {"filehash":document.getElementById('fileHash').value, "pkey": fr.result, "fromA" : fromaddress, "toA" : sessionStorage.getItem('walletAdress')}).then(response=>   
//         {
//         console.log(response.data)
//         const im = new Image();
//         im.src = response.data;
//         im.onload = async () => {
//           gantTensor2 = tf.image.resizeBilinear(tf.browser.fromPixels(im).div(255.0), [64,64]);
//           var secret = decrypter.predict([gantTensor2.reshape([1,64,64,3])]);
//           console.log(secret);
  
//           secret = tf.image.resizeBilinear(secret.reshape([64,64,3]),[200,200]);
//           canvas.width = secret.shape.width
//           canvas.height = secret.shape.height
//           await tf.browser.toPixels(secret, canvas);
//           let b64 = canvas.toDataURL();
//           console.log(b64);
//           document.getElementById("secret").href = b64;
//           alert("Secret Can be Downloaded");

//         }
//         });

//              // console.log(fr.result);
//     }
//     fr.readAsText(e.target.files[0]);

//     // console.log(gantTensor2.shape);
//     // console.log(secret);

//     // im.onload = () => {
//     //   gantTensor1= tf.browser.fromPixels(im);
//     // }
    
//   }

//   function uploadSecret(e){

//     const im = new Image()
//     var fr = new FileReader();
//     fr.onload = function () {
//         im.src = fr.result;
//     }
//     fr.readAsDataURL(e.target.files[0]);
//     im.onload = () => {
//       gantTensor2= tf.browser.fromPixels(im);
//       encode();
//     }

//   }
//   function uploadImage(e){
//    encode();
//   //  let imageObj={};
//   //    let imageFormObj=new FormData();
//   //    imageFormObj.append("imageName","multer-image-"+Date.now());
//   //     imageFormObj.append("imageData",e.target.files[0]);
//   //     imageFormObj.append("recwadress",document.getElementById('recwadress').value);
//   //     console.log(e.target.files[0]);
//   //     axios.post('http://localhost:8080/sendimg',imageFormObj).then(response=>{
//   //           console.log(response.data);
//   //         });
//   }


    let userWallet=sessionStorage.getItem('walletAdress');
    let count=1;
    var userData={
        "waddress" : userWallet,
    }

    axios.post('http://localhost:8080/getdetails',userData,
    {
      headers: {
              'Content-Type': 'application/json'
                }
    }).then((response) => {
        //
         let tranasctionDetails=response.data;
         console.log(tranasctionDetails.length);
   
         tranasctionDetails.forEach(element => {
     
            var c, r, t;
            t = document.createElement('table');
            r = t.insertRow(0); 
            c = r.insertCell(0);
            c.innerHTML = count;
            c = r.insertCell(1);
            c.innerHTML = element.fromA;
            c = r.insertCell(2);
            c.innerHTML = element.filehash;
            document.getElementById("tableBody").appendChild(t);
            count++;
        }) 
        response.preventDefault();
         
        //   function download(filename, text) {
        //     var element = document.createElement('a');
        //     element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        //     element.setAttribute('download', filename);
          
        //     element.style.display = 'none';
        //     document.body.appendChild(element);
          
        //     element.click();
          
        //     document.body.removeChild(element);
        //   }
          
        //   // Start file download.
        //   download("private.key",response.data);
        //   alert("Inserted Successfully");
        }).catch(err => {
          console.log(err, err.response);
        });
    

    return(
        <>
        <DashboardHeader/>
        <table class="table table-dark tableModify">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">From Wallet Address</th>
      <th scope="col">FileHash Value</th>
    </tr>
  </thead>
  <tbody id="tableBody">
  </tbody>
</table>
        </>
    )
}

