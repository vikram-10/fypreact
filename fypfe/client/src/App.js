import React, { Component } from "react";
import IPFSInboxContract from "./IPFSInbox.json";
//import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import truffleContract from "truffle-contract";
import "./App.css";

class App extends Component {
  //state = { storageValue: 0, web3: null, accounts: null, contract: null };
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      accounts: null,
      contract: null,
      ipfsHash: null,
      formIPFS: "",
      formAddress: "",
      receivedIPFS: "",
    };
    this.handleChangeAddress = this.handleChangeAddress.bind(this);
    this.handleChangeIPFS = this.handleChangeIPFS.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.handleReceiveIPFS = this.handleReceiveIPFS.bind(this);
  }
  /*componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      //this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };*/
  setEventListeners() {
    this.state.inboxResponse().on("data", (result) => {
      this.setState({ receivedIPFS: result.args[0] });
    });
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const Contract = truffleContract(IPFSInboxContract);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();

      instance.inboxResponse().on("data", (result) => {
        this.setState({ receivedIPFS: result.args[0] });
      });

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
      this.setEventListeners();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };
  handleChangeAddress(event) {
    this.setState({ formAddress: event.target.value });
  }
  handleChangeIPFS(event) {
    this.setState({ formIPFS: event.target.value });
  }
  handleSend(event) {
    event.preventDefault();
    const contract = this.state.contract;
    const account = this.state.accounts[0];

    document.getElementById("new-notification-form").reset();
    this.setState({ showNotification: true });
    contract
      .sendIPFS(this.state.formAddress, this.state.formIPFS, { from: account })
      .then((result) => {
        this.setState({ formAddress: "" });
        this.setState({ formIPFS: "" });
      });
  }
  handleReceiveIPFS(event) {
    event.preventDefault();
    const contract = this.state.contract;
    const account = this.state.accounts[0];
    contract.checkInbox({ from: account });
  }
  /*runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };*/

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h2> 2. Send notifications here </h2>
        <form
          id="new-notification-form"
          className="scep-form"
          onSubmit={this.handleSend}
        >
          <label>
            Receiver Address:
            <input
              type="text"
              value={this.state.value}
              onChange={this.handleChangeAddress}
            />
          </label>
          <label>
            IPFS Address:
            <input
              type="text"
              value={this.state.value}
              onChange={this.handleChangeIPFS}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <h2> 3. Receive Notifications </h2>
        <button onClick={this.handleReceiveIPFS}>Receive IPFS</button>
        <p>{this.state.receivedIPFS}</p>
      </div>
    );
  }
}

export default App;
