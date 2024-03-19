const express = require("express");
const User = require("../../models/user/user");
const jwt = require("jsonwebtoken");
const app = express();
require("dotenv").config();
const auth = require("../../config/auth");
const logger = require('../../utils/logger')

//Get All Users
app.get('/admin/users', auth, async (req, res) => {
    try {
        // if (!req.user.isAdmin) {
        //     return res.status(401).json({ status: false, error: 'Only Admin can perfom this operation' });
        // }
        const user = await User.find({isAdmin:false});
        if (!user) {
            return res.status(404).json({ status: false, error: 'Users not found' });
        }
        logger.info( `All Users Fetched Successfully`)
        return res.status(200).json({ status: true, message: 'Users retrieved successfully', data: user,total:user.length });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ status: false, error: 'Error fetching User' });
    }
});

app.post('/admin/token', auth, async (req, res) => {
    try {
        // if (!req.user.isAdmin) {
        //     return res.status(401).json({ status: false, error: 'Only Admin can perfom this operation' });
        // }
        const sha256 = req.body.token;
        if (!sha256) {
            return res.status(400).json({ status: false, error: 'Token is required' });
        }

        let tokenDoc = await Token.findOne();

        if (tokenDoc) {
            tokenDoc.sha256 = sha256;
        } else {
            tokenDoc = new Token({ sha256 });
        }

        await tokenDoc.save();

        logger.info('SHA256 Token Updated Successfully');
        return res.status(200).json({ status: true, message: 'SHA256 Token Updated Successfully', data: tokenDoc });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ status: false, error: 'Error saving SHA256 token' });
    }
});

app.get('/admin/get-token', auth, async (req, res) => {
    try {
        // if (!req.user.isAdmin) {
        //     return res.status(401).json({ status: false, error: 'Only Admin can perfom this operation' });
        // }
        let tokenDoc = await Token.findOne();

        logger.info('SHA256 Token retrieved Successfully');
        return res.status(200).json({ status: true, message: 'SHA256 Token retrieved Successfully', data: tokenDoc });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ status: false, error: 'Error retrieving SHA256 token' });
    }
});


module.exports = app