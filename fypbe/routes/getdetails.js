var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const bodyParser = require('body-parser');
let mongoClient = mongo.MongoClient;
const { use } = require('express/lib/application');
const openpgp = require("openpgp");
const fs = require("fs");
var cors = require('cors');
router.use(cors()); 


router.use(bodyParser.json());

// const uri = "mongodb+srv://vikram10:vikram2000@cluster0.0rf1v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const uri = "mongodb://localhost:27017";

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
        console.log(regUserData);
        client.close();
    }
    catch(err){
        console.log(err);
    }
});

module.exports = router;
