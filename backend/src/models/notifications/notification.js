const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', 
        required: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['product', 'notification'],
        required: true
    },
    link: {
        type: String
    },
    read: {
        type: Boolean,
        default: false
    }
},{timestamps:true});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
