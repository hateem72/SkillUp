import multer from 'multer';
import path from 'path';

// Configure multer storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination folder for uploaded files
    cb(null, path.join(__dirname, '../../uploads')); // Adjust path as needed
  },
  filename: (req, file, cb) => {
    // Set the file name for uploaded files
    cb(null, Date.now() + '-' + file.originalname); // Append timestamp to avoid name collisions
  }
});

// Create the multer upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limit file size to 5 MB
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files (you can modify this to accept other file types)
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: File type not supported!'));
  }
});

// Export the upload middleware
export default upload;