const Notification = require('../models/notifications/notification');
const User = require('../models/user/user');
const { getIOInstance } = require('./socket');

async function sendNotification(userId, content, type, link) {

    if (typeof userId === 'string' && userId.includes('@')) {
        userId = userId.toLowerCase()
        const user = await User.findOne({ email: new RegExp(`^${userId}$`, 'i') });
        userId = String(user._id)
    }else{
        userId = String(userId)
    }
    try {
        const notificationData = {
            userId,
            content,
            type,
            link,
            read: false
        };

        const savedNotification = new Notification(notificationData);

        const notification = await savedNotification.save();

        const io = getIOInstance();

        io.to(userId).emit(`notification_${userId}`, notification);
        
    } catch (error) {
        console.log(`Error in sending Notification`,error.message);
    }
}

module.exports = { sendNotification }