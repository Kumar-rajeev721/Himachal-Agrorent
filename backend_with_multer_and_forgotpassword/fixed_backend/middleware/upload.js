const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads/lands folder if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads', 'lands');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = /image\/(jpeg|jpg|png|webp)/.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Only jpg, png, webp images are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});

module.exports = upload;
