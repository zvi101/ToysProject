const express= require("express");
const router = express.Router();

router.get("/", async(req,res) => {
  res.json({msg:"indx 1 Work"});
})


module.exports = router;