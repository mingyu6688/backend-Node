import express from 'express';
import { signup, login } from '../controllers/auth.controller.js';
import authenticateToken from '../middlewares/auth.middleware.js';

const router = express.Router();

// 회원가입
router.post('/signup', signup);

// 로그인
router.post('/login', login);

// 토큰이 있어야 접근가능한 부분
router.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({
    message: '토큰이 유효합니다.',
    user: req.user,
  });
});

export default router;
