const express = require('express');
const app = express();
const auth = require('../../config/auth');
const Notification = require('../../models/notifications/notification')


app.get('/notifications', auth, async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({ userId: userId }).sort({ createdAt: -1 });
        if (!notifications) {
            return res.status(404).json({ status: false, message: 'Notification not found' });
        }
        return res.status(200).json({ status: true, data: notifications });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ status: false, message: `Server error: ${error.message}` });
    }
});

app.patch('/notifications/readAll', auth, async (req, res) => {
    try {
        const userId = req.user._id;
        await Notification.updateMany({ userId: userId }, { read: true });
        return res.status(200).json({ status: true, message: 'All notifications marked as read' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: `Server error: ${error.message}` });
    }
});

app.delete('/notifications/:notificationId', auth, async (req, res) => {
    try {
        const notificationId = req.params.notificationId;
        const notification = await Notification.findByIdAndDelete(notificationId);

        if (!notification) {
            return res.status(404).json({ status: false, message: 'Notification not found' });
        }

        return res.status(200).json({ status: true, message: 'Notification deleted' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: `Server error: ${error.message}` });
    }
});


app.delete('/notifications/', auth, async (req, res) => {
    try {
        const userId = req.user._id;
        await Notification.deleteMany({ userId: userId });
        res.status(200).json({ status: true, message: 'All notifications deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: `Server error: ${error.message}` });
    }
});

app.post('/add-notification',auth, async (req, res) => {
    try {
        const userId = req.user._id
        // Create a new notification using the Notification model
        const notificationData = {
            userId: userId,
            content: req.body.content,
            type: req.body.type,
            link: req.body.link,  // This assumes the link is being sent in the request body
            read: req.body.read   // This is optional as the default value is set in the schema
        };

        // Create a new notification using the Notification model
        const notification = new Notification(notificationData);

        // Save the notification to the database
        await notification.save();

        // Send the saved notification back as a response
        res.status(201).send(notification);
    } catch (error) {
        // Handle any errors that occur
        res.status(400).send(error);
    }
});


module.exports = app;