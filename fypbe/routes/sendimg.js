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

const storage=multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'./uploads/');
  },
  filename:function(req,file,cb){
    cb(null,file.originalname);
  }
});  

const upload=multer({storage:storage,limits:{fileSize:1000000}});

/* GET users listing. */
router.post('/',  upload.single('imageData'),async(req, res, next) =>{

  try{
    var spawn = require('child_process').spawn;
    console.log("../uploads/"+ req.file.originalname)
     //add random cover 
      var process =await spawn("python", [
        "test.py",
        "uploads/"+req.file.originalname,
        "cover/ambur.jpg" 
      ]);

      process.on('close', async(code) => {
        var recwadress=req.body.recwadress;
        console.log(recwadress);
        let client=await mongoClient.connect(uri);
          let db=client.db('healthchain');
          let regUserData=await db.collection("userInfo").find({wadress:recwadress}).toArray();
          console.log(regUserData);
          var publicKey = Buffer.from(regUserData[0].pubkey, 'utf-8').toString();
          (async () => {
            const plainData = fs.readFileSync('testStego.JPG','base64');
            const imageData = Buffer.from(plainData,'base64');
            const encrypted = await openpgp.encrypt({
              message: openpgp.message.fromText(imageData),
              publicKeys: (await openpgp.key.readArmored(publicKey)).keys
            });
            // fs.writeFileSync('encrypted-secret.txt', encrypted.data);
            ipfs.files.add(Buffer.from(encrypted.data), function (err, file) {
              if (err) {
                console.log(err);
              }
              res.send({
                hash:file[0].hash,
                recwadress:recwadress
              });
            })
          })();
      });

      // const publicKeyArmored = fs.readFileSync('./public.key', {
      //   encoding: 'utf8',
      //   flag: 'r'
      // });

  
  

  }catch(err){
    console.log(err);
  }
});

module.exports = router;
