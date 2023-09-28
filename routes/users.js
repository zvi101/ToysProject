const express = require("express");
const bcrypt = require("bcrypt");
const { auth, authAdmin } = require("../middlewares/auth");
const { UserModel, validateUser, validateLogin, createToken } = require("../models/userModel");
const router = express.Router();


router.get("/", async (req, res) => {
  res.json({ msg: "This users work" })
})


router.get("/checkToken", auth, async (req, res) => {
  res.json(req.tokenData);
})


router.get("/myInfo", auth, async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 });
    res.json(user);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})


// shows all users for admin
router.get("/userList", authAdmin, async (req, res) => {
  try {
    const data = await UserModel.findOne({}, { password: 0 })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})


// add user
router.post("/", async (req, res) => {
  const validBody = validateUser(req.body)
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();

    user.password = "******";
    res.status(201).json(user);
  }
  catch (err) {
    if (err.code == 11000) {
      return res.status(400).json({ err: "Email already in system", code: 11000 })
    }
    console.log(err);
    res.status(502).json({ err })
  }
})


router.post("/login", async (req, res) => {
  const validBody = validateLogin(req.body)
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ err: "Email or Password not match!" });
    }
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) {
      return res.status(401).json({ err: "Email or Password not match!" });
    }

    // creat token
    const token = createToken(user._id, user.role) // -> with admin or normal user type
    res.json({ token, role: user.role })
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})


// delete user
router.delete("/:id", authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (id == req.tokenData._id) {
      return res.status(401).json({ err: "you cant delete your self" })
    }
    const data = await UserModel.deleteOne({ _id: id });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

// change to admin
router.patch("/changeRole/:id/:role", authAdmin, async (req, res) => {
  try {
    const { id, role } = req.params;
    // Must be a logged in user
    if (role != "user" && role != "admin") {
      return res.status(401).json({ err: "you can send admin or user role!" })
    }
    // that Damin cannot change himself
    if (id == req.tokenData._id) {
      return res.status(401).json({ err: "you cant change yourself!" })
    }
    const data = await UserModel.updateOne({ _id: id }, { role });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})


module.exports = router;

