const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));

mongoose.connect('mongodb://localhost:27017/mitubeDB', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String
});

const User = mongoose.model('User', userSchema);

// ثبت‌نام
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    try {
        await newUser.save();
        res.send('Registration successful!');
    } catch (error) {
        res.status(400).send('Email already registered.');
    }
});

// ورود
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user._id; // ذخیره شناسه کاربر در جلسه
        res.send('Login successful!');
    } else {
        res.status(401).send('Invalid email or password.');
    }
});

// محافظت از مسیرها
function ensureAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.status(401).send('You must be logged in to view this page.');
}

// استفاده از این Middleware برای مسیرهایی که نیاز به احراز هویت دارند
app.get('/upload', ensureAuthenticated, (req, res) => {
    res.send('This is the upload page.');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000.');
});