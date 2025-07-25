import multer from 'multer';
import path from 'path';

// Konfiguriere den Speicherort und den Dateinamen
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Stelle sicher, dass der Ordner 'uploads/' existiert
  },
  filename: function (req, file, cb) {
    // Erstelle einen eindeutigen Dateinamen, um Kollisionen zu vermeiden
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter für Dateitypen (nur Videos)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Not a video file!'), false);
  }
};

// Multer-Instanz mit Konfiguration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50 // 50 MB Limit
  },
  fileFilter: fileFilter
});

export default upload;
