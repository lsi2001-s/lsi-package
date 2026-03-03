require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // CORS 패키지 불러오기

const app = express();
const PORT = 5000;

// CORS 설정 (프론트엔드와 백엔드의 도메인/포트가 다를 때 발생하는 오류 해결)
app.use(cors());

// 클라이언트가 보내는 JSON 형식의 데이터를 읽을 수 있도록 설정
app.use(express.json());

// MongoDB 연결 주소 (실제 사용하는 몽고디비 URI로 변경해주세요)
// 예: 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/myFirstDatabase'
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/local_db';

// 몽고디비 연결
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('연결 성공');
  })
  .catch((err) => {
    console.error('MongoDB 연결 실패:', err);
  });

// 기본 라우트 설정
app.get('/', (req, res) => {
  res.send('서버가 정상적으로 작동 중입니다!');
});

// 라우터 설정 불러오기
const todoRoutes = require('./routes/todos');

// '/todos' 경로로 오는 모든 요청을 todoRoutes 라우터로 연결
app.use('/todos', todoRoutes);

// 서버 실행
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
