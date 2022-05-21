import './HeaderBar.css';
import { Link,useNavigate} from 'react-router-dom';
import React, {useState} from 'react';
import {ethers} from 'ethers';
import axios from 'axios';

let apiStatus;

export default function HeaderBar(){
  const navigate =useNavigate();
    const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState({});
	const [userBalance, setUserBalance] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

    const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {
			// console.log('MetaMask Here!');

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {

				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
				getAccountBalance(result[0]);
				sessionStorage.setItem("walletAdress",result[0]);
				axios.post('http://localhost:8080/clientData',{'clientWadress': result[0]},
				{
				headers: {
					'Content-Type': 'application/json'
				}
				}
			    ) 
			    .then(response => {
				 console.log(response.data.apiStatus);
				 apiStatus=response.data.apiStatus;
				  if(apiStatus == 1){
					navigate('/dashboard');
				}
				else{
					navigate('/register');
				}
			})
			.catch(err => {
				console.log(err, err.response);
			});
			}
		)
			.catch(error => {
				setErrorMessage(error.message);
			
			});


			//getClientData();

		}
		else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}

	}
	
    // update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount({'wadress':newAccount});
		getAccountBalance(newAccount.toString());
	}

	const getAccountBalance = (account) => {
		window.ethereum.request({method: 'eth_getBalance', params: [account, 'latest']})
		.then(balance => {
			setUserBalance(ethers.utils.formatEther(balance));
		})
		.catch(error => {
			setErrorMessage(error.message);
		});
	};

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}


	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);
	window.ethereum.on('chainChanged', chainChangedHandler);

    return(
<>
<div className='headerItems'>
    <span className="fa-solid fa-briefcase-medical medicalIcon"/>
    <span className='brandName'><Link to='/' style={{textDecoration:'none',color:'white'}}>HealthChain</Link></span>
    <button className='buttonProperties' onClick={connectWalletHandler}>{connButtonText}</button>
    {/* <button className='buttonProperties'><Link to='/' style={{textDecoration:'none',color:'white'}}>Register</Link></button> */}
</div>
</>
    );
}
