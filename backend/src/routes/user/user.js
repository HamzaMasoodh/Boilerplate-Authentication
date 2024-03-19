const express = require("express");
const crypto = require('crypto');
const User = require("../../models/user/user");
const jwt = require("jsonwebtoken");
const app = express();
require("dotenv").config();
const auth = require("../../config/auth");
const logger = require('../../utils/logger')
const { sendEmail } = require('../../utils/sendEmail');
const { log } = require("winston");
//User Sign-up
app.post("/user/signup", async (req, res) => {
    try {
        const requiredFields = ["email", "firstName", "lastName", "password", "confirmPassword"];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                logger.error(`Missing required field: ${field}`)
                return res
                    .status(400)
                    .json({ status: false, message: `Missing required field: ${field}` });
            }
        }

        if (req.body.password !== req.body.confirmPassword) {
            logger.error('Password Does not match')
            return res
                .status(400)
                .json({ status: false, error: "Password does not match" });
        }

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            logger.error("Email already signed-up")
            return res
                .status(400)
                .json({ status: false, error: "Email already signed-up" });
        }

        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            lastLogin: new Date(),
            profileImageUrl: "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-PNG-Picture.png",
        });

        let access = await user.generateAuthToken();
        // Generate a 6-digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const codeExpiration = new Date(new Date().getTime() + 10 * 60000);

        // Assuming you add these fields to your User model
        user.verificationCode = verificationCode;
        user.codeExpiration = codeExpiration;

        console.log(verificationCode);

        const newUser = await user.save();

        // Modify your email content to include the verification code
        let body = `<p>Your verification code is: <b>${verificationCode}</b>. It will expire in 10 minutes. Please enter this code on the verification page.</p>`;

        await sendEmail('verification', user.email, body);

        logger.info(`Signup Successful Successful for user: ${req.body.email}`);

        return res.status(201).json({
            status: true,
            success:
                "Signup Successful",
            data: { data: newUser, success: "success" },
        });
    } catch (err) {
        logger.error(err.message);
        return res.status(400).json({
            status: false,
            message: "Error in registering the user",
            error: err.message,
        });
    }
});

//Email Verification
app.get('/verify-email', async (req, res) => {
    try {
        const userId = req.query.userId
        const verificationCode = req.query.verificationCode

        const user = await User.findById(userId);

        if (user.isVerified) {
            logger.info(`User already verified: ${user.email}`);
            return res.status(200).json({ status: true,verifeid:true, success: `User already verified: ${user.email}. Login to Continue` });
        }

        if (!user || user.verificationCode !== verificationCode || new Date() > user.codeExpiration) {
            return res.status(400).json({ status: false, error: "Invalid or expired verification code" });
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        user.codeExpiration = undefined;

        let access = await user.generateAuthToken();

        await user.save();
        logger.info(`Verification Successfull for the User ${user._id}`)
        return res.status(201).json({
            status: true,
            verified: false,
            success: 'Email Verified Succesfully',
            data: user,
            access
        });
    } catch (error) {
        logger.error(`Verification Failed ${error.message}`)
        return res.status(500).json({
            status: false,
            success:
                "Email Verification Failed",
            error: error.message,
        });
    }
});

//User Login
app.post("/user/login", async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;

        if (!email || !password) {
            logger.error('Please Provide Correct email and password ')
            return res.json({
                status: false,
                error: "Please Provide Correct email and password ",
            });
        }

        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );
        if (!user) {
            logger.error(new Date().toLocaleString() + 'Incorrect Email or Password');
            return res.json({ status: false, error: "Email or Password is not correct " });
        }
        let access = await user.generateAuthToken();
        let verified = true
        let message = 'Successfully Login'
        if (!user.isVerified) {
            verified = false
            message = 'Please verify your email adress to login'
        }

        user.lastLogin = new Date();
        logger.info(`Login Successful for user: ${req.body.email}`);
        await user.save();
        return res.json({
            status: true,
            success: message,
            verified,
            data: { data: user, access, success: "success" },
        });
    } catch (error) {
        logger.error(error.message);
        return res.status(400).json({
            status: false,
            message: `Login Failed ${error.message}`,
            error: error.message,
        });
    }
});

// Resend Verification Email
app.post('/resend-verification-email', async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            logger.error(`Missing userId parameter`);
            return res.status(400).json({ status: false, error: 'Missing userId parameter' });
        }

        const user = await User.findById(userId);
        if (!user) {
            logger.error(`User not found with ID: ${userId}`);
            return res.status(404).json({ status: false, error: 'User not found' });
        }

        if (user.isVerified) {
            logger.info(`User already verified: ${user.email}`);
            return res.status(200).json({ status: true,verifeid:true, success: `User already verified: ${user.email}. Login to Continue` });
        }

        // Generate a new 6-digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const codeExpiration = new Date(new Date().getTime() + 10 * 60000); 

        user.verificationCode = verificationCode;
        user.codeExpiration = codeExpiration;

        await user.save();

        console.log(verificationCode);
        // Construct the verification email with the new code
        let body = `<p>Your new verification code is: <b>${verificationCode}</b>. It will expire in 10 minutes. Please enter this code on the verification page.</p>`;

        // Send the email
        await sendEmail('verification', user.email, body);

        logger.info(`Resend Verification Email Successful for user: ${user.email}`);

        return res.status(200).json({
            status: true,
            verifeid:false,
            message: "Verification email resent successfully"
        });
    } catch (error) {
        logger.error(`Error in resending verification email: ${ error.message } `);
        return res.status(500).json({
            status: false,
            error: `Error in resending verification email: ${ error.message } `
        });
    }
});

// User Change Password
app.post("/user/changepassword", auth, async (req, res) => {
    try {
        let oldPassword = req.body.oldPassword;
        let newPassword = req.body.newPassword;

        if (!oldPassword || !newPassword) {
            logger.error("Please Enter Correct password")
            return res.json({
                status: false,
                error: "Please Enter Correct password",
            });
        }

        if (oldPassword == newPassword) {
            logger.error("New Password Must be different from Old One")
            return res.json({
                status: false,
                error: "New Password Must be different from Old One",
            });
        }

        const user = await User.findById(req.user?._id);
        if (!user) {
            logger.error("Please provide Valid User")
            return res.json({ status: false, error: "Please provide Valid User" });
        }
        // const isMatch = await bcrypt.compare(oldPassword, user.password);
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            logger.error(`Incorrect old password for user: ${ req.user.email } `)
            return res.status(401).json({ status: false, error: "Incorrect old password" });
        }
        user.password = newPassword;
        user.lastLogin = new Date();

        await user.save();

        const access = await user.generateAuthToken();

        logger.info(`Password Changed Successfully for user: ${ req.user.email } `)

        return res.json({
            status: true,
            success: "Password changed successfully",
            data: user,
            access,
        });
    } catch (error) {
        logger.error(error.message);
        return res.status(400).json({
            status: false,
            message: "Failed to change password",
            error: error.message,
        });
    }
});
//Get User Data
app.get('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ status: false, error: 'User not found' });
        }
        logger.info(`User ${ req.user.email } Fetched Successfully`)
        return res.status(200).json({ status: true, message: 'User retrieved successfully', data: user });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ status: false, error: 'Error fetching User' });
    }
});

module.exports = app