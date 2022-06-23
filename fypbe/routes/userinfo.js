var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
let mongoClient = mongo.MongoClient;
let cors=require('cors');
const { use } = require('express/lib/application');
router.use(cors({
    origin: '*'
}));
let db;
let flag=0;

// const uri = "mongodb+srv://vikram10:vikram2000@cluster0.0rf1v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const uri = "mongodb://localhost:27017";

router.post('/', async function(req, res, next) {
    console.log("userinfo post request hit successfully");
    try{
        var userWadress=req.body.userWadress;
        console.log(userWadress);
        let client=await mongoClient.connect(uri);
          let db=client.db('healthchain');
          let regUserData=await db.collection("userInfo").find({wadress:userWadress}).toArray();
          let userName=regUserData[0].name;
          let userType=regUserData[0].userType;
          res.send({
                userName:userName,
                userType:userType
          });
        client.close();
    }
    catch(err){
        console.log(err);
    }
});

module.exports = router;