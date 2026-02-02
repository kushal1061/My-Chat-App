const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../model/user");
mongoose.connect('mongodb://127.0.0.1:27017/test');
exports.registerUser = async (req, res) => {
    const { name, password, email, phone} = req.body;
    const newUser = new User({
        name,
        password,
        email,
        phone,
        createdAt: Date.now()
    });
    try{
        await newUser.save();
    }
    catch(e){
        return res.status(500).json({ message: "Error registering user" });
    }
    console.log(`Registering user: ${name}`);
    res.status(200).json({ message: "User registered successfully" });
};
exports.loginUser =async (req, res) => {
    const { name, password } = req.body;
    const user =await User.findOne({ name });// find
    console.log(user);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (user.password === password) {
        console.log(`User logged in: ${name}`);
        const userId = user._id;
        const token = jwt.sign(
            { userId }, process.env.JWT_SECRET || 'abc'
        )
        res.status(200).json({
            token,
            phone:user.phone,
            userId: user._id,
            message: " logged in successfully"
        })
    }
    else {
        return res.status(401).json({ message: "Invalid password" });
    }
}
exports.changeProfilePic=async(req,res)=>{
    const user= req.body.user;
    const newProfilePic=req.body.profilePic;
    const updatedUSer=User.findOneAndUpdate({_id:user._id},{profilePic:newProfilePic});
    // save profile pic and then do it 
    if(updatedUser) res.json(
        {
            message:"profilePic",
            url
        }
    )
}