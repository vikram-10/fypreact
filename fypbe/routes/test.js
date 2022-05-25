var express = require('express');
const multer = require('multer');
const fs = require("fs");
var router = express.Router();
const openpgp = require('openpgp');
const ipfsAPI = require('ipfs-api');
const mongo = require('mongodb');
let mongoClient = mongo.MongoClient;
let cors=require('cors');

//const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});
const ipfs = ipfsAPI();
const uri = "mongodb+srv://vikram10:vikram2000@cluster0.0rf1v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  
router.post('/', async(req, res, next) =>{



  try{ 
    // const pKey = fs.readFileSync('./private.key', "utf-8");
        var fileC = null;
        var filehash = req.body.filehash;
        var pKey = Buffer.from(req.body.pkey, 'utf-8').toString();
        const privateKey = (await openpgp.key.readArmored([pKey]))
        .keys[0];

        // var pKey=req.body.pkey;
        ipfs.files.get(filehash, async function (err, files) {
            fileC = files[0].content.toString('utf-8');
            console.log(fileC);
            // fs.writeFile("message.txt", fileC, 'utf-8',function(err) {
            //   if(err)console.log(err);
            //   else console.log(`Image is Decrypted Successfully`);

            // })
            const decrypted = await openpgp.decrypt({
              message: await openpgp.message.readArmored(fileC),
              privateKeys: [privateKey]
            });

            // fs.writeFile("decrypted.txt", decrypted.data, 'utf-8',function(err) {
            //   if(err)console.log(err);
            //   else console.log(`Image is Decrypted Successfully`);
          // })
          res.send(decrypted.data);
       

        })
       
 
      res.send({"steg": decrypted.data});
        
  }catch(err){
    console.log(err);
  }
});


module.exports = router;