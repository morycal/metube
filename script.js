const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // برای MongoDB

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mitubeDB', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    verificationCode: String,
    isVerified: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

// تنظیمات ارسال ایمیل
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

// ثبت‌نام
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // بررسی وجود کاربر
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).send('Email already registered.');
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // کد 6 رقمی

    const newUser = new User({ username, email, password, verificationCode });
    await newUser.save();

    // ارسال ایمیل تأیید
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Verify Your Email',
        text: `Your verification code is: ${verificationCode}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
        res.send('Registration successful! Please check your email for the verification code.');
    });
});

// تأیید کد
app.post('/verify', async (req, res) => {
    const { email, verificationCode } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.verificationCode !== verificationCode) {
        return res.status(400).send('Invalid verification code.');
    }

    user.isVerified = true;
    await user.save();
    res.send('Email verified! You can now log in.');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000.');
});
document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    
    const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
    });

    if (response.ok) {
        alert('Video uploaded successfully!');
    } else {
        alert('Failed to upload video.');
    }
});