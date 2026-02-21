const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  searchUsers,
  me
} = require("../controller/user.controller");

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/searchUsers",auth,searchUsers);
router.get("/me",auth,me);
module.exports = router;
