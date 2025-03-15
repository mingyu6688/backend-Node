import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.SECRET_KEY;

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

// 회원가입
const signup = async (req, res) => {
  const { username, password, nickname } = req.body;

  try {
    // 존재하는 유저인지 확인
    const checkQuery = 'SELECT * FROM users WHERE username = ?';
    const [existingUser] = await db.promise().execute(checkQuery, [username]);

    if (existingUser.length > 0) {
      return res.status(400).json({
        error: {
          code: 'USER_ALREADY_EXISTS',
          message: '이미 가입된 사용자입니다.',
        },
      });
    }

    const hashedPassword = await hashPassword(password);

    // 새로운 유저 추가
    const insertQuery = 'INSERT INTO users (username, password, nickname) VALUES (?, ?, ?)';
    await db.promise().execute(insertQuery, [username, hashedPassword, nickname]);

    // 회원 가입 성공
    res.status(201).json({
      username: username,
      nickname: nickname,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: '서버 오류 발생',
      },
    });
  }
};

// 로그인
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 입력받은 유저명으로 조회
    const query = 'SELECT * FROM users WHERE username = ?';
    const [result] = await db.promise().execute(query, [username]);

    if (result.length === 0) {
      return res.status(400).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: '아이디 또는 비밀번호가 올바르지 않습니다.',
        },
      });
    }

    // 비밀번호 확인
    const pwMatch = await bcrypt.compare(password, result[0].password);

    if (!pwMatch) {
      return res.status(400).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: '아이디 또는 비밀번호가 올바르지 않습니다.',
        },
      });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { username: username, password: password },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: '서버 오류 발생',
      },
    });
  }
};

export { signup, login };