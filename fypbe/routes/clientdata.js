var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
let mongoClient = mongo.MongoClient;
let cors=require('cors');
router.use(cors({
    origin: '*'
}));
let db;

const uri = "mongodb+srv://vikram10:vikram2000@cluster0.0rf1v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


/* GET home page. */
router.post('/', async function(req, res, next) {
    try{
        let userWallet=req.body.clientWadress;
        let walletAdress=userWallet.wadress;
        let client=await mongoClient.connect(uri);
        let db=client.db('healthchain');
        let regUserData=await db.collection("registeredUsers").find({}).toArray();
        console.log(regUserData);
    }
    catch(err){
        console.log(err);
    }
    // console.log(walletAdress);
//     const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collectionDb = client.db("healthchain");
//   const collectionData=collectionDb.collection("registeredUsers");
//   collectionData.findOne({wadress:walletAdress},function(err, result) {
//       console.log(result);
//   });
//   client.close();
// });
//     const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//     client.connect(err => {
//         console.log("Client Connected! ");
//         const collection = client.db("healthchain").collection("registeredUsers");
//     collection.findOne({'wadress':walletAdress}).then(function(doc){
//         if(doc){
//             console.log("1");
//             res.send({
//                 "apiStatus":1,
//             });
//         }
//         else{
//             console.log("0");
//             res.send({
//                 "apiStatus":0,
//             });
//         }
//     });
// });
});

module.exports = router;

