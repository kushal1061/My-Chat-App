const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const msgSchema = new Schema({
    // type : { required: true, type: String, enum: ['single', 'group'], default: 'single' },
    sender : { required: true, type: String },
    // receiver : { required: true, type: String },
    chatId : { required: true , type: String},
    type : { required: true, type: String, enum: ['text', 'image', 'video'], default: 'text' },
    text : { required: true, type: String },
    timestamp : { type: Date, default: Date.now },
    // status : { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
    deliveredto: { type: [String], default: [] },
    readby: { type: [String], default: [] },
    deletedfor: { type: [String], default: [] },
    // readat:{type: { Schema.Types.ObjectId : Date} },
    // delivered_at:{type: { Schema.Types.ObjectId : Date} }
});

module.exports = mongoose.model('Message', msgSchema);