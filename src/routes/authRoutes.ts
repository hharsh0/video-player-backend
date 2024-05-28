// src/routes/authRoutes.ts
import { Router } from 'express';
import { register, login, getUserProfile } from '../controllers/authController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', authenticate, getUserProfile );

// Example of a protected route
router.get('/admin', authenticate, authorize(['admin']), (req, res) => {
    res.send('Admin access granted');
});

export default router;
