import './Dashboardpage.css';
import Drawer from '../Items/Drawer';
import DashboardHeader from '../DashboardHeader/Dashboardheader';
import {Routes, Route} from 'react-router-dom';
import SendImage from '../Sendimage/SendImage';
import {useState} from 'react';
import axios from 'axios';

function Registerpage(){
        let [userName,setUserName]=useState('');
        let [userType,setUserType]=useState('');
        let userWallet=sessionStorage.getItem('walletAdress');
        let imageFormObj=new FormData();
        imageFormObj.append("recwadress",userWallet);
        console.log(imageFormObj);
        let data={
                userWadress:userWallet,
        }
        console.log(data);
        axios.post('http://localhost:8080/userinfo',data).then(response=>{
                console.log(response.data);
                setUserName(response.data.userName);
                setUserType(response.data.userType);
              });

return(
        <>
<DashboardHeader/>
<Routes>
<Route path='/send-image' element={ <SendImage/> } />
</Routes>
<div className="card cardDesignDashboard">
  <div className="card-body">
    <h6 className="card-subtitle mb-2 text-muted cardTitleDesign">Hello {userName}! 👋</h6>
<div>
    Your user Specification Type is a : {userType}    
</div>
  </div>
</div>
        </>
    )
}

export default Registerpage