const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePic: { type: String ,default: '' } ,
    phone: { type: String , required: true, unique: true  } ,
    password: { type: String, required: true }  ,
    createdAt: { type: Date, default: Date.now },
    status: { type: String, default: 'offline' }
});
module.exports = mongoose.model('User', userSchema);