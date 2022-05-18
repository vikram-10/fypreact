var express = require('express');
const multer = require('multer');
const {spawn} = require('child_process');
const fs = require("fs");
var router = express.Router();

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
router.post('/', (req, res, next) =>{


    
    var process =spawn("python", [
      "../test.py",
      "../uploads/01.jpg",
      "../cover/ambur.jpg" 
    ]);

});

module.exports = router;
