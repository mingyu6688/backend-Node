import express from 'express';
import setupSwagger from './config/swagger.js';
import router from './routes/auth.router.js';

const app = express();

app.use(express.json());
setupSwagger(app);
app.use('/', router);

const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 ${HOST}:${PORT} 에서 실행 중`);
});
