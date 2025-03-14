import express from 'express';

const app = express();
const HOST = '0.0.0.0';
const PORT = 3000;

app.use("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, HOST, () => {
  console.log(`서버 ${HOST}/${PORT}에서 실행 중`);
});
