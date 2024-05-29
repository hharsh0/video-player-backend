import { Router } from "express";
import { getListing, getUserInfo } from "../controllers";
import { authenticate } from "../middlewares/authMiddleware";
import { getDownloadUrl, uploadVideo } from "../controllers/videoController";
import fileUpload from "express-fileupload";
import { filesPayloadExists } from "../middlewares/filesPayloadExists";
import { fileExtLimiter } from "../middlewares/fileExtLimiter";
import { fileSizeLimiter } from "../middlewares/fileSizeLimiter";

//starts with /api
const router: Router = Router();

router.get('/list',authenticate, getListing);

router.post('/upload-video',authenticate,  fileUpload({ createParentPath: true }),
filesPayloadExists,
fileExtLimiter(['.mp4']),
fileSizeLimiter, uploadVideo);

// In future this can be only done by admin role holders
router.get('/user',authenticate,getUserInfo);

router.get('/download-url/:fileName',authenticate, getDownloadUrl);

export default router;
