const websocketClients = require('./clients')
const Chat = require('../model/chats')
const Message = require('../model/messages')
const User = require('../model/user')
const jwt = require("jsonwebtoken")
const webSocket = require('ws');
async function sendPendingmsg(userId) {
    const userChats = await Chat.find({
        participants: userId
    }).select("_id");
    const chatIds = userChats.map(c => c._id);
    const undeiliveredMessages = await Message.find({
        chatId: { $in: chatIds },
        deliveredto: { $ne: userId },
        sender: { $ne: userId }
    });
    for (const msg of undeiliveredMessages) {
        if (websocketClients[userId]) {
            websocketClients[userId].send(JSON.stringify({
                type: "message",
                data: msg
            }));
            const updateMsg = await Message.findOneAndUpdate(
                { _id: msg._id },
                {
                    $addToSet: { deliveredto: userId },
                    $set: { [`delivered_at.${userId}`]: new Date() }
                }
            )
            if (updateMsg) {
                console.log("Pending message delivered to", userId);
            }

        }
    }
}
async function handleChat(ws, payload) {
    if (payload.type === 'chat') {
        // save
        payload=payload.message || payload;
        let chatId = payload.chatId;
        let receivers = [];
        try {
            if (chatId) {

                receivers = await Chat.findOne({ _id: chatId });
                receivers = receivers.participants.filter(p => p.toString() !== payload.sender.toString());
            }
        }
        catch (e) {
            console.log("Error finding chat:", e);
        }
        if (!chatId) {
            console.log(payload.sender);
            const participants = [payload.sender, payload.receiver];
            chatId = await createChat(participants)
            console.log("New chat created with ID:", chatId);
            receivers = [payload.receiver];
        }
        const newMsg = new Message({
            sender: payload.sender,
            chatId,
            text: payload.text,
            type: payload.type || 'text'
        })
        const chatUpdate = await Chat.findOneAndUpdate(
            { _id: chatId },
            { $set: { lastMessage: { text: payload.text, time: new Date() } } }
        );
        console.log(newMsg);
        newMsg.save().then(() => console.log("saved")).catch(e => console.log(e));
        for (const receiver of receivers) {
            if (websocketClients[receiver]) {
                console.log("iam akasdhj")
                websocketClients[receiver].send(JSON.stringify({
                    type: 'chat',
                    text: payload.text,
                    sender: payload.sender,
                    chatId
                }));
                const updateMsg = await Message.findOneAndUpdate(
                    { _id: newMsg._id },
                    {
                        $addToSet: { deliveredto: receiver },
                        $set: { [`delivered_at.${receiver}`]: new Date() }
                    }
                )
            }
        }

    }
}
async function handleRead(ws,payload){
    const {chatId,userId} = payload;
    const updateMsg = await Message.updateMany(
        { chatId, sender: { $ne: userId }, readby: { $ne: userId } },
        {
            $addToSet: { readby: userId },
            $set: { [`read_at.${userId}`]: new Date() }
        }
    );
    const chat = await Chat.findById(chatId);
    const receivers = chat.participants.filter(p => p.toString() !== userId.toString());
    for(const receiver of receivers){
        if(websocketClients[receiver]){
            websocketClients[receiver].send(JSON.stringify({
                type:"read",
                chatId,
                userId
            }))
        }}}
async function handleAuth(ws, payload) {
    const token = payload.token;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'abc');
        const user = await User.findOne({ _id: decoded.userId });
        if (!user) {
            return;
        }
        user.status = "online";
        await user.save();
        const id = user._id;
        websocketClients[id] = ws;
        sendPendingmsg(user._id);
    }
    catch (e) {
        console.log(e);
    }
}
module.exports = async (ws, payload) => {
    const type = payload.type;
    switch (type) {
        case 'auth':
            handleAuth(ws, payload);
            break;
        case 'chat':
            handleChat(ws, payload)
            break;
        case 'typing':
            handleTyping(ws, payload);
            break;
        case 'read':
            handleRead(ws, payload);
            break;
        case 'rtc':
            handleCall(ws, payload);
        default:
            break;
    }
}