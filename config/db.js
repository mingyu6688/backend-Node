import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  
  db.connect((err) => {
    if (err) {
        console.error('DB 연결 실패: ', err);
        process.exit(1);
    }
    console.log('DB 연결 성공');
    db.query('SELECT * FROM users', (err, rows) => {
      if (err) throw err;
      console.log(rows);
    });
  });

  export default db;