import { Router } from "express";
import { getListing } from "../controllers";
import { authenticate } from "../middlewares/authMiddleware";


const router: Router = Router();

router.get('/list',authenticate, getListing);

export default router;