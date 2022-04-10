var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
let mongoClient = mongo.MongoClient;
let cors=require('cors');
router.use(cors({
    origin: '*'
}));
let db;
let flag=0;

const uri = "mongodb+srv://vikram10:vikram2000@cluster0.0rf1v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


/* GET home page. */
router.post('/', async function(req, res, next) {
    try{
        let userWallet=req.body.clientWadress;
        let walletAdress=userWallet.wadress;
        let client=await mongoClient.connect(uri);
        let db=client.db('healthchain');
        let regUserData=await db.collection("registeredUsers").find({}).toArray();
        regUserData.forEach(function(user){
            let dbWadress=user.wadress;
            let lowercaseWadress=dbWadress.toLowerCase();
            if(lowercaseWadress==walletAdress){
               console.log("user found");
               res.send({
                "apiStatus":1
                });
            }
            else{
                console.log("user not found");
                res.send({
                    "apiStatus":0
                });
            }
        });
    }
    catch(err){
        console.log(err);
    }
});

module.exports = router;

