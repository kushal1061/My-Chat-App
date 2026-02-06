const express= require('express')
const router = express.Router();
const auth = require("../middleware/auth")
const {upload}=require("../controller/upload.contoller")
router.post("/upload",auth,upload);
module.exports = router;