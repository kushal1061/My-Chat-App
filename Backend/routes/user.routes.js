const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  searchUsers
} = require("../controller/user.controller");

router.post("/register",registerUser);
  router.post("/login",loginUser);
router.post("/searchUsers",auth,searchUsers);
module.exports = router;
