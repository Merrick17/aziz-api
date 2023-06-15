const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const cors = require('cors'); 
const path = require('path'); 

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors()); 


cloudinary.config({
    cloud_name: "dnozudt2x",
    api_key: "956142484736458",
    api_secret: "Y7w8mstqLX4B-KScPuuPVotkKd0",
  });
  const { CloudinaryStorage } = require("multer-storage-cloudinary");
  
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "uploads",
      format: async (req, file) => file.originalname.split(".").pop(), // set the desired image format
      public_id: (req, file) => {
        const nameWithoutExtension = file.originalname
          .split(".")
          .slice(0, -1)
          .join(".");
        const sanitizedFilename = nameWithoutExtension.replace(
          /[^a-zA-Z0-9]/g,
          "_"
        );
        return `${Date.now()}-${sanitizedFilename}`;
      }, //
    },
  });
  
  const upload = multer({ storage: storage });
// Route for file upload
app.post('/upload', upload.single('file'), (req, res) => {
    // Upload file to Cloudinary
    cloudinary.uploader.upload(req.file.path, (error, result) => {
        if (error) {
            console.log('Upload to Cloudinary failed:', error);
            return res.status(500).json({ error: 'Failed to upload file' });
        }

        // File uploaded successfully, return the URL
        res.json({ url: result.secure_url });
    });
});
const port = process.env.PORT || 3000; 
// Start the server
app.listen(port, () => {
    console.log('Server started on port 3000');
});