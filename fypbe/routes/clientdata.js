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
        let walletAdress=userWallet.wadress;
        console.log("User Wallet:"+walletAdress);
        let client=await mongoClient.connect(uri);
        let db=client.db('healthchain');
        let regUserData=await db.collection("registeredUsers").find({}).toArray();
        console.log(regUserData);
        let auth = false;
        regUserData.every(function(user){
            let dbWadress=user.wadress;
            let lowercaseWadress=dbWadress.toLowerCase();
            console.log("DB Wallet:"+lowercaseWadress);
            if(lowercaseWadress==walletAdress){
               auth = true;
               return;
            }
        });
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

