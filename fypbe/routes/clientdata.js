var express = require('express');
var router = express.Router();
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://vikram:Vikram8118@cluster0.6e3ep.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

/* GET home page. */
router.post('/', function(req, res, next) {
    res.send({
        "status":req.body,
    });
//     const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//     client.connect(err => {
//     const collection = client.db("healthchain").collection("registeredUsers");
//     collection.findOne({'wadress':req.defaultAccount}).then(function(doc){
//         if(doc){
//             res.send(1);
//         }
//         else{
//             res.send(0);
//         }
//     });
// });
// client.close();
});

module.exports = router;

