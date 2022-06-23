var express = require('express');
const multer = require('multer');
const fs = require("fs");
var router = express.Router();
const openpgp = require('openpgp');
const ipfsAPI = require('ipfs-api');
const mongo = require('mongodb');
let mongoClient = mongo.MongoClient;
let cors=require('cors');

//const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})
const ipfs = ipfsAPI();
// const uri = "mongodb+srv://vikram10:vikram2000@cluster0.0rf1v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const uri = "mongodb://localhost:27017";
  
router.post('/', async(req, res, next) =>{

  try{
        var b64 = req.body.b64;
        var recwadress=req.body.recwadress.toLowerCase();
        let client=await mongoClient.connect(uri);
        let db=client.db('healthchain');
        let regUserData=await db.collection("userInfo").find({wadress:recwadress}).toArray();
        // const publicKeyArmored = fs.readFileSync(regUserData[0].pubkey, {
        //   encoding: 'utf8'
        // });
        var publicKeyArmored = Buffer.from(regUserData[0].pubkey, 'utf8').toString();
        // const imageData = Buffer.from(b64,'utf8');
        // console.log(imageData);
        // const imageData = fs.readFileSync(b64, {encoding:'utf-8'});
        const encrypted = await openpgp.encrypt({
          message: openpgp.message.fromText(b64),
          publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys
        });
        ipfs.files.add(Buffer.from(encrypted.data), function (err, file) {
          if (err) {
            console.log(err);
          }
          console.log(file[0].hash)
          res.send({
            hash:file[0].hash,
            recwadress:recwadress
          });
        })
        
  }catch(err){
    console.log(err);
  }
});

module.exports = router;
