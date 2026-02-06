const User=require("../model/user")
const Message=require('../model/messages')
const Chat=require("../model/chats");
const messages = require("../model/messages");
exports.getChat=async (req,res)=>{
    const user=req.body.user;
    const chatId = req.body.chatId;
    const messages = await Message.find({ chatId: chatId }).sort({ timestamp: -1 }).limit(100);
    res.json(messages);
}
exports.getChats=async (req,res)=>{
            const user = req.body.user;
            console.log(user);
            const phone = user.phone;
            
            const chats = await Chat
                .find({ participants: phone })
                .sort({ updatedAt: -1 })
                .lean();  ///----IMPORTANT-----------
        
            const updatedChats = await Promise.all(
                chats.map(async (chat) => {
                    if (chat.type === 'single') {
                        const receiverPhone = chat.participants.find(p => p !== phone);
                        const receiver = await User.findOne(
                            { phone: receiverPhone },
                            { name: 1 }
                        );
        
                        chat.name = receiver?.name || "Unknown";
                    }
                    return chat;
                })
            );
            console.log(chats);
            res.json(chats);
}
exports.createChat=async(req,res)=>{
    const participants = req.body.participants;
        const newChat = new Chat({
            participants: participants
        });
        const savedChat = await newChat.save();
        res.json({
            chatId: savedChat._id,
            messages: []
}); 
}