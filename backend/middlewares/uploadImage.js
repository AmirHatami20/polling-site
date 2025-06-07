const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/webp',
        'video/mp4'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('فقط فرمت‌های jpg، jpeg، png، webp، mp4 مجاز هستند'), false);
    }
};

const upload = multer({storage, fileFilter});

module.exports = upload;
