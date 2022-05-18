var express = require('express');
const multer = require('multer');
const fs = require("fs");
var router = express.Router();
const openpgp = require('openpgp');

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
router.post('/',  upload.single('imageData'),(req, res, next) =>{

  var spawn = require('child_process').spawn;
  console.log("../uploads/"+ req.file.originalname)
    
    var process =spawn("python", [
      "test.py",
      "uploads/01.jpg",
      "cover/ambur.jpg" 
    ]);


    // const publicKeyArmored = fs.readFileSync('./public.key', {
    //   encoding: 'utf8',
    //   flag: 'r'
    // });
    // (async () => {
    //   const plainData = fs.readFileSync('picture.png');
    //   const imageData = new Buffer(plainData).toString('base64');
    //   const encrypted = await openpgp.encrypt({
    //     message: openpgp.message.fromText(imageData),
    //     publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys
    //   });
    //   fs.writeFileSync('encrypted-secret.txt', encrypted.data);
    //   console.log(`Image is Encrypted`);
    // })();


});

module.exports = router;
