const express = require("express");
const { ToysModel, validateToys } = require("../models/toyModel");
const { auth } = require("../middlewares/auth");
const router = express.Router();


// -> localhost:3001/toys?page=3&perpage=12&sort=price
router.get("/", async(req,res) => {
    const perpage = req.query.perpage ? Math.min(req.query.perpage, 5) : 3;
    const page = req.query.page ? req.query.page -1 : 0;
    const sort = req.query.sort || "_id";
    try{
      let data = await ToysModel
      .find({})
      .limit(perpage)
      .skip(page*perpage)
      .sort({[sort]:1})


      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })

  // -> localhost:3001/toys/search?s=
  router.get("/search", async(req,res) => {
    try{
      const s = req.query.s;
      const regExp = new RegExp(s,"i");
      const data = await ToysModel.find({$or:[
        {name:regExp},
        {info:regExp},
        {category:regExp}
      ]});
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })


router.get("/single/:id", async(req,res) => {
    try{
      const id = req.params.id
      let data = await ToysModel.findOne({_id:id});
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })

  
// add prodect
router.post("/", auth, async(req,res) => {
    let validBody = validateToys(req.body);
    if(validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      const toy = new ToysModel(req.body);
      toy.user_id = req.tokenData._id; // -> Only the user will be able to delete the product by token
      await toy.save();
      res.status(201).json(toy)
    }
    catch(err) {
      if(err.code == 11000){
        return res.status(400).json({err:"Toys_url already in system",code:11000})
      }
      console.log(err);
      res.status(502).json( {err})
    }
  })


router.put("/:idEdit", async(req,res) => {
    let validBody = validateToys(req.body);
    if(validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      let idEdit = req.params.idEdit;
      let data;
      // -> Admin can edit user Regular must be a user of the token
      if(req.tokenData.role == "admin"){
        data = await ToysModel.updateOne({_id:idEdit},req.body);
      }
      else{
        data = await ToysModel.updateOne({_id:idEdit, user_id:req.tokenData._id},req.body);
      }
    res.json(data)
    }
    catch(err) {
      console.log(err);
      res.status(502).json( {err})
    }
  })


router.delete("/:idDel",auth ,async(req,res) => {
    try {
      let idDel = req.params.idDel;
      let data;
      // -> Admin can delele user Regular must be a user of the token
      if(req.tokenData.role == "admin"){
        data = await ToysModel.deleteOne({_id:idDel}); 
      }
      else{
        data = await ToysModel.deleteOne({_id:idDel, user_id:req.tokenData._id});
      }
      res.json(data)
    }
    catch(err) {
      console.log(err);
      res.status(502).json( {err})
    }
  })

  
  module.exports = router;