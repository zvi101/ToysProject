const mongoose = require('mongoose');
// דואג שנוכל לקרוא משתנים מה ENV
require("dotenv").config();

main().catch(err => console.log(err));

async function main() {

   //await mongoose.connect('mongodb://127.0.0.1:27017/toyse');

   await mongoose.connect('mongodb+srv://zvikidzll01:1234zviki@cluster0.kqh8dtn.mongodb.net/toy11');


   
 // await mongoose.connect(process.env.DB_CONNECT);
 
  console.log("mongo atlas connect");
}