const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../model/user");
exports.registerUser = async (req, res) => {
    const { name, password, email, phone } = req.body;
    const newUser = new User({
        name,
        password,
        email,
        phone,
        createdAt: Date.now()
    });
    try {
        await newUser.save();
        console.log(`Registering user: ${name}`);
        return res.status(200).json({ message: "User registered successfully" });
    }
    catch (e) {
        console.error(`Error registering user: ${e.message}`);
        return res.status(500).json({ message: "Error registering user" });
    }
};
exports.loginUser = async (req, res) => {
    const { name, password } = req.body;
    const user = await User.findOne({ name });// find
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
            phone: user.phone,
            userId: user._id,
            message: " logged in successfully"
        })
    }
    else {
        return res.status(401).json({ message: "Invalid password" });
    }
}
exports.searchUsers = async (req, res) => {
    const query = req.body.query;
    // console.log(user)
    const myId = req.body.user._id;
    const ph = req.body.query
    let users = [];
    try{

         users = await User.aggregate([
            // 1️⃣ Remove self
            {
                $match: {
                    _id: { $ne: new mongoose.Types.ObjectId(myId) },
                    $or: [
                        { name: { $regex: ph, $options: "i" } },
                        { phone: { $regex: `^${ph}` } }
                    ]       
                }
            },
            
            // 2️⃣ Find existing chats with this user
            {
  $lookup: {
    from: "chats",
    let: { otherUserId: "$_id" },
    pipeline: [
      {
        $match: {
          $expr: {
            $and: [
              {
                $in: [
                  new mongoose.Types.ObjectId(myId),
                  { $ifNull: ["$members", []] }
                ]
              },
              {
                $in: [
                  "$$otherUserId",
                  { $ifNull: ["$members", []] }
                ]
              }
            ]
          }
        }
      }
    ],
    as: "chat"
  }
}
,
            
            // 3️⃣ Add flag
            {
                $addFields: {
                    hasChat: { $gt: [{ $size: "$chat" }, 0] },
                    chatId: { $arrayElemAt: ["$chat._id", 0] }
                }
            },
            
            // 4️⃣ Sort: existing chats first
            {
                $sort: { hasChat: -1, name: 1 }
            },
            
            // 5️⃣ Cleanup
            {
                $project: {
                    chat: 0
                }
            }
        ]);
    }
    catch(e){
        console.error(`Error searching users: ${e.message}`);
    }

    console.log(query);
    console.log(users);
    res.json(users);
}
exports.changeProfilePic = async (req, res) => {
    const user = req.body.user;
    const newProfilePic = req.body.profilePic;
    const updatedUser = User.findOneAndUpdate({ _id: user._id }, { profilePic: newProfilePic });
    // save profile pic and then do it 
    if (updatedUser) res.json(
        {
            message: "profilePic",
            url
        }
    )
}