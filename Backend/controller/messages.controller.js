exports.deleteMessage = async(req,res)=>{
    const userId= req.body.user._id;
    const messageId = req.body.messageId;
    const deletedMessage = Message.findById(messageId);
    deletedMessage.deletedBy.push(userId);
    deletedMessage.save();
    res.json(deletedMessage);
}
exports.markAsRead = async(req,res)=>{
    const userId= req.body.user._id;
    const messageId = req.body.messageId;
    const readMessage = Message.findById(messageId);
    readMessage.readBy.push(userId);
    readMessage.save();
    res.json(readMessage);
}