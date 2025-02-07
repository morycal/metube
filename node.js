const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' }); // دایرکتوری برای ذخیره ویدیوها

mongoose.connect('mongodb://localhost:27017/mitubeDB', { useNewUrlParser: true, useUnifiedTopology: true });

const videoSchema = new mongoose.Schema({
    title: String,
    filename: String,
    createdAt: { type: Date, default: Date.now }
});

const Video = mongoose.model('Video', videoSchema);

// بارگذاری ویدیو
app.post('/upload', upload.single('videoFile'), async (req, res) => {
    const { videoTitle } = req.body;
    const newVideo = new Video({
        title: videoTitle,
        filename: req.file.filename
    });

    await newVideo.save();
    res.send('Video uploaded successfully!');
});

// نمایش ویدیوها
app.get('/videos', async (req, res) => {
    const videos = await Video.find();
    res.json(videos);
});

// پخش ویدیو
app.get('/uploads/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.sendFile(filePath);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000.');
});