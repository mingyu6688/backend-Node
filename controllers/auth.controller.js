import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.SECRET_KEY || 'secret_key'; // 기본값 추가

// 회원가입
const signup = async (req, res) => {
  const { username, password, nickname } = req.body;

  // 🔥 1. 필수 입력값 체크
  if (!username || !password || !nickname) {
    return res.status(400).json({
      error: {
        code: 'BAD_REQUEST',
        message: '모든 필드를 입력해야 합니다.',
      },
    });
  }

  try {
    const checkQuery = 'SELECT id FROM users WHERE username = ?';
    const [existingUser] = await db.execute(checkQuery, [username]);

    if (existingUser.length > 0) {
      return res.status(400).json({
        error: {
          code: 'USER_ALREADY_EXISTS',
          message: '이미 가입된 사용자입니다.',
        },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = 'INSERT INTO users (username, password, nickname) VALUES (?, ?, ?)';
    await db.execute(insertQuery, [username, hashedPassword, nickname]);

    res.status(201).json({
      message: '회원가입 성공',
      username: username,
      nickname: nickname,
    });
  } catch (err) {
    console.error('회원가입 오류:', err);
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

  // 🔥 2. 필수 입력값 체크
  if (!username || !password) {
    return res.status(400).json({
      error: {
        code: 'BAD_REQUEST',
        message: '아이디와 비밀번호를 입력해야 합니다.',
      },
    });
  }

  try {
    const query = 'SELECT id, username, password FROM users WHERE username = ?';
    const [rows] = await db.execute(query, [username]);

    if (rows.length === 0) {
      return res.status(400).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: '아이디 또는 비밀번호가 올바르지 않습니다.',
        },
      });
    }

    const user = rows[0];
    const pwMatch = await bcrypt.compare(password, user.password);

    if (!pwMatch) {
      return res.status(400).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: '아이디 또는 비밀번호가 올바르지 않습니다.',
        },
      });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: '로그인 성공',
      token: token,
    });
  } catch (err) {
    console.error('로그인 오류:', err);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: '서버 오류 발생',
      },
    });
  }
};

export { signup, login };
