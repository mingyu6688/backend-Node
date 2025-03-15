import express from 'express';
import { signup, login } from '../controllers/auth.controller.js';
import authenticateToken from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: 회원가입
 *     description: 새로운 사용자를 등록합니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               nickname:
 *                 type: string
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *       400:
 *         description: 이미 존재하는 사용자
 */
router.post('/signup', signup);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: 로그인
 *     description: 사용자 로그인 후 JWT 토큰을 반환합니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: 로그인 실패 (아이디 또는 비밀번호 오류)
 */
router.post('/login', login);

/**
 * @swagger
 * /protected:
 *   get:
 *     summary: 보호된 경로
 *     description: JWT 토큰을 사용하여 보호된 데이터를 가져옵니다.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 보호된 데이터
 *       401:
 *         description: 인증되지 않은 요청
 *       403:
 *         description: 유효하지 않은 토큰
 */
router.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({
    message: '이 데이터는 인증된 사용자만 볼 수 있습니다.',
    user: req.user,
  });
});

export default router;
