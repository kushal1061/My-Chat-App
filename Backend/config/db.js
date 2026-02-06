const mongoose=require('mongoose');
const dns = require("dns");
dns.setServers(["1.1.1.1"]);
module.exports=()=>{
    console.log(process.env.MONGO_URL)
    mongoose.connect(process.env.MONGO_URL).then(console.log("db connected")).catch(e=>console.log(e));
};
