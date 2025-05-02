import multer from 'multer';
import path from 'path';

const tempDir = path.join(process.cwd(), 'temp');

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB max file size
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format. Please upload an image.'), false);
    }
  }
});

const upload = multer({ storage: multerConfig });

export default upload;