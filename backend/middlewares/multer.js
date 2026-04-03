import multer from "multer";

const storege = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname); 
    },
});

const upload = multer({ storage: storege , limits: { fileSize: 1024 * 1024 * 5 } });  // 5 MB limit     


export default upload;