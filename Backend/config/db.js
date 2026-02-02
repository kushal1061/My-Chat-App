const mongoose=require('mongoose');
module.exports=()=>{
    mongoose.connect("mongodb://127.0.0.1:27017/test").then(console.log("db connected")).catch(e=>console.log(e));
};