const express = require('express');
const router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
var initializeDB = require('./db.js');
var logger = require('morgan');
var session = require('express-session');
let db

(async () => {
    db = await initializeDB();
})();


// 로그인 유저 확인 시스템
passport.use(new LocalStrategy(async function verify(username, password, cb) {
    try {
      const user = await db.collection('users').findOne({ username: username });
      if (!user) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
  
      crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
        if (err) {
          return cb(err);
        }
        if (!crypto.timingSafeEqual(Buffer.from(user.hashed_password, 'hex'), hashedPassword)) {
          return cb(null, false, { message: 'Incorrect username or password.' });
        }
        return cb(null, user);
      });
    } catch (err) {
      return cb(err);
    }
  }));


// 비밀번호 확인
router.post('/login/password', (req, res, next) => {
passport.authenticate('local', (err, user, info) => {
    if (err) {
    return res.status(500).json({ message: 'Internal server error', error: err });
    }
    if (!user) {
    return res.status(401).json({ message: info.message || 'Authentication failed' });
    }
    req.logIn(user, (err) => {
    if (err) {
        return res.status(500).json({ message: 'Login failed', error: err });
    }
    return res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username } });
    });
})(req, res, next);
});
  

// 회원가입
router.post('/login/signup', async function (req, res, next) {
  try {

    // 비밀번호 해싱 및 솔트 생성
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function (err, hashedPassword) {
      if (err) {
        return res.status(500).json({ message: 'Internal server error', error: err });
      }

      try {
        // MongoDB의 users 컬렉션 접근
        const usersCollection = db.collection('users');

        // 사용자 이름 중복 확인
        const existingUser = await usersCollection.findOne({ username: req.body.username });
        if (existingUser) {
          return res.status(409).json({ message: 'Username already exists' });
        }

        // 사용자 데이터 삽입
        const result = await usersCollection.insertOne({
          username: req.body.username,
          hashed_password: hashedPassword.toString('hex'),
          salt: salt,
        });

        // 사용자 정보 생성
        const user = {
          id: result.insertedId,
          username: req.body.username,
        };
        
        // 성공 응답 반환
        res.status(201).json({ message: 'Signup successful', user });
      } catch (error) {
        return res.status(500).json({ message: 'Database error', error });
      }
    });
  } catch (error) {
    console.error('Error details:', error);
    return res.status(500).json({ message: 'Unexpected error', error });
  }
});


module.exports = router;