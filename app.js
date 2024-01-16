const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const app = express();
const port = process.env.PORT || 3000;




// Serve style.css specifically
app.get('/css/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/css/style.css'));
});



// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));



// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the public folder
app.use('/uploads', express.static('uploads'));


// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage });

// Render the index page
app.get('/', (req, res) => {
    res.render('index');
});

// Handle file upload
app.post('/upload', upload.single('image'), (req, res) => {
    res.redirect('/gallery');
});

// Render the gallery page with uploaded images
app.get('/gallery', (req, res) => {
    try {
        const images = fs.readdirSync('uploads').filter(file => !file.startsWith('.'));
        console.log('Images:', images); // Add this line for debugging

        res.render('gallery', { images });
    } catch (error) {
        console.error('Error reading uploads directory:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

