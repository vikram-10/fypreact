var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const bodyParser = require('body-parser');
let mongoClient = mongo.MongoClient;
let cors=require('cors');
const { use } = require('express/lib/application');
const openpgp = require("openpgp");
const fs = require("fs");


router.use(bodyParser.json());
router.use(cors({
    origin: '*'
}));

const uri = "mongodb+srv://vikram10:vikram2000@cluster0.0rf1v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

/* GET users listing. */
router.post('/', async function(req, res, next) {
    console.log("GetDetails Post request hit successfully");
    try{
        let client=await mongoClient.connect(uri);
        let db=client.db('healthchain');
        let userWallet=req.body.waddress;
        console.log(userWallet);
        let regUserData=await db.collection("fileDetails").find({"toA":userWallet}).toArray();
        res.send(regUserData);
        client.close();
    }
    catch(err){
        console.log(err);
    }
});

module.exports = router;
