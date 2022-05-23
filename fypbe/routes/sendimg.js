var express = require('express');
const multer = require('multer');
const fs = require("fs");
var router = express.Router();
const openpgp = require('openpgp');
const ipfsAPI = require('ipfs-api');
const mongo = require('mongodb');
let mongoClient = mongo.MongoClient;
let cors=require('cors');

const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})
const uri = "mongodb+srv://vikram10:vikram2000@cluster0.0rf1v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  
router.post('/', async(req, res, next) =>{

  try{
        var b64 = req.body.b64;
        var recwadress=req.body.recwadress;
        let client=await mongoClient.connect(uri);
        let db=client.db('healthchain');
        let regUserData=await db.collection("userInfo").find({wadress:recwadress}).toArray();
        var publicKey = Buffer.from(regUserData[0].pubkey, 'utf-8').toString();
        console.log("hello");
        const imageData = Buffer.from(b64,'base64');
        const encrypted = await openpgp.encrypt({
          message: openpgp.message.fromText(imageData),
          publicKeys: (await openpgp.key.readArmored(publicKey)).keys
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
