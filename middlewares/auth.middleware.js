import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: {
        code: 'TOKEN_NOT_FOUND',
        message: '토큰이 없습니다.',
      },
    });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      let errorCode = 'INVALID_TOKEN';
      let errorMessage = '토큰이 유효하지 않습니다.';

      if (err.name === 'TokenExpiredError') {
        errorCode = 'TOKEN_EXPIRED';
        errorMessage = '토큰이 만료되었습니다.';
      }

      return res.status(403).json({
        error: {
          code: errorCode,
          message: errorMessage,
        },
      });
    }

    req.user = decoded;
    next();
  });
};

export default authenticateToken;
