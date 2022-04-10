import './Registerpage.css';

function Registerpage(){
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
      <input type="text" readonly class="form-control-plaintext" id="staticEmail" value={userWallet} />
    </div>
  </div>
  <div class="form-group row">
    <label for="inputPassword" class="col-sm-2 col-form-label"></label>
    <div class="col-sm-12">
      <input type="text" class="form-control" id="inputName" placeholder="Name" />
    </div>
  </div>
  <div class="form-group row">
    <label for="inputPassword" class="col-sm-2 col-form-label"></label>
    <div class="col-sm-12">
      <input type="text" class="form-control" id="inputName" placeholder="Doctor/User" />
    </div>
  </div>
  <button type="button" class="btn btn-success">SUBMIT</button>
    </form>
  </div>
</div>
        </>
    )
}

export default Registerpage