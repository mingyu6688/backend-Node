import express from 'express';
import router from './routes/auth.router.js';
import dotenv from 'dotenv';

dotenv.config();

const HOST = process.env.HOST;
const PORT = process.env.PORT;

const app = express();
app.use(express.json());

app.use('/', router);

app.listen(PORT, HOST, () => {
  console.log(`서버 ${HOST}/${PORT}에서 실행 중`);
});
