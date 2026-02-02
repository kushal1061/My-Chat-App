const express= require('express')
const router = express.Router();
const auth = require("../middleware/auth")
const {
  getChats,
  getChat,
  createChat
} = require("../controller/chat.controller");
router.post("/getChats",auth,getChats);
router.post("/getChat",auth,getChat);
router.post("/createChat",auth,createChat);
module.exports = router;
