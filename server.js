
const cors = require('cors');
const express = require('express');
const app = express();
const path = require('path');
const initializeDB = require("./routes/db.js");

require('dotenv').config();


// 모든 출처에서 요청을 허용
app.use(cors());
app.use(express.json());
// 정적 파일 서빙 (React 등 프레임워크 사용 시)
// app.use(express.static('build'));


// 모든 GET 요청에 대해 React 앱의 index.html 반환
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
// });

initializeDB().then(() => {
  app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중')
  })
}).catch(err => {
  console.error('DB 초기화 실패:', err)
});


// 라우트 연결하기
const usersRouter = require('./routes/pay');
app.use('/pay', usersRouter)
const authRouter = require('./routes/auth');
app.use('/auth', authRouter)

