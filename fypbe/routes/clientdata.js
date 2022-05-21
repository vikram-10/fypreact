var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
let mongoClient = mongo.MongoClient;
let cors=require('cors');
const { use } = require('express/lib/application');
router.use(cors({
    origin: '*'
}));
let db;
let flag=0;

const uri = "mongodb+srv://vikram10:vikram2000@cluster0.0rf1v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


router.post('/', async function(req, res, next) {
    try{
        let userWallet=req.body.clientWadress;
        //let walletAdress=userWallet.wadress;
        //console.log("User Wallet:"+walletAdress);
        let client=await mongoClient.connect(uri);
        let db=client.db('healthchain');
        let regUserData=await db.collection("userInfo").find({}).toArray();
        //onsole.log(regUserData[0].wadress);
        let auth = false;
        for(let i=0;i<regUserData.length;i++){
            let dbWadress= regUserData[i].wadress;
            console.log("Wadress:"+userWallet);
            console.log("dbadress:"+dbWadress);
            // localeCompare returns 0 if string is equal
            if(dbWadress.localeCompare(userWallet) == 0){
               auth = true;
               break;
            }
        };
        if(auth){
            res.send({
                "apiStatus": 1,
            });
        }
        else{
            res.send({
                "apiStatus": 0,
            });
        }
        client.close();
    }
    catch(err){
        console.log(err);
    }
});

module.exports = router;

