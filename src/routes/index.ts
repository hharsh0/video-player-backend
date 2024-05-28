import { Router } from "express";
import { getListing } from "../controllers";
import { authenticate } from "../middlewares/authMiddleware";
import multer from 'multer';
import { getDownloadUrl, uploadVideo } from "../controllers/videoController";
import fileUpload from "express-fileupload";
import { filesPayloadExists } from "../middlewares/filesPayloadExists";
import { fileExtLimiter } from "../middlewares/fileExtLimiter";
import { fileSizeLimiter } from "../middlewares/fileSizeLimiter";
import path from "path";
import { bucket } from "../firebase";


const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50MB
  });


const router: Router = Router();

router.get('/list',authenticate, getListing);
router.post('/upload-video',authenticate,  fileUpload({ createParentPath: true }),
filesPayloadExists,
fileExtLimiter(['.mp4']),
fileSizeLimiter, uploadVideo);

router.get('/download-url/:fileName',authenticate, getDownloadUrl);

export default router;
