const fs = require('fs');
const multer=require('multer');
var storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function(req, file, callback) {
    callback(null, file.originalname);
  }
});
const upload = multer({ storage: storage });
exports.upload=async (req,res)=>{
    
}