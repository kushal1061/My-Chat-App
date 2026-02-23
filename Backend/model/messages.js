const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const msgSchema = new Schema({
    // type : { required: true, type: String, enum: ['single', 'group'], default: 'single' },
    sender: { required: true, type: Schema.Types.ObjectId, ref: 'User' },
    chatId: { required: true, type: Schema.Types.ObjectId, ref: 'Chat' },
    type: { required: true, type: String, enum: ['text', 'image', 'video'], default: 'text' },
    text: { required: true, type: String },
    timestamp: { type: Date, default: Date.now },
    deliveredto: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] },
    readby: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] },
    deletedBy: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] },
    // readat:{type: { Schema.Types.ObjectId : Date} },
    // delivered_at:{type: { Schema.Types.ObjectId : Date} }
});

module.exports = mongoose.model('Message', msgSchema);