import './recievedtable.css';
import Drawer from '../Items/Drawer';
import axios from 'axios';
import { requirePropFactory } from '@mui/material';
import * as tf from "@tensorflow/tfjs";
import DashboardHeader from '../DashboardHeader/Dashboardheader';
import IPFSInboxContract from "../Sendimage/IPFSInbox.json";
import getWeb3 from "../Sendimage/getWeb3";
import truffleContract from "truffle-contract";

    var req = true;
export default function Recievedtable(){



    let userWallet=sessionStorage.getItem('walletAdress');

    let count=1;
    var userData={
        "waddress" : userWallet,
    }
    if(req){
    req = false
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
        }).catch(err => {
          console.log(err, err.response);
        });
    }

    return(
        <>
        <DashboardHeader/>
        <table class="table table-dark tableModify">
  <thead>
    <tr>
      <th scope="col">#</th>
      {/* <th scope="col">From Wallet Address</th>
      <th scope="col">FileHash Value</th> */}
    </tr>
  </thead>
  <tbody id="tableBody">
  </tbody>
</table>
        </>
    )
}