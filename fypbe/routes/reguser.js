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


/* GET home page. */
router.post('/', async function(req, res, next) {
    console.log("Post request hit successfully");
    try{
        let client=await mongoClient.connect(uri);
        let db=client.db('healthchain');
        const { privateKeyArmored, publicKeyArmored } = await openpgp.generateKey({
            userIds: [{ name: req.body.name, accId : req.body.waddress}],
            // userIds: [{ name: "guru", accId : "0x3b7b9cA88a812e296cB7f8D12B5ea801BEfd0551"}],
            curve: "ed25519",
          });
        req.body.pubkey = publicKeyArmored;
        let regUserData=await db.collection("userInfo").insertOne(req.body)
        fs.writeFileSync("./private.key", privateKeyArmored);
        console.log("Inserted sucessfully!");
        client.close();
    }
    catch(err){
        console.log(err);
    }
});

module.exports = router;

