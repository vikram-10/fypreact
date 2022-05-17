var express = require('express');
const multer = require('multer');
var router = express.Router();

const storage=multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'./uploads/');
  },
  filename:function(req,file,cb){
    cb(null,Date.now()+file.originalname);
  }
});  

const upload=multer({storage:storage,limits:{fileSize:1000000}});

/* GET users listing. */
router.post('/',upload.single('imageData'),(req, res, next) =>{
  console.log(imageData);
});

module.exports = router;
