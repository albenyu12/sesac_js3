const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express() ;
const PORT = 3000;
const db = new Database('user.db');

// db 초기화
(() => {
    db.exec('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)');

    const insertStm = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    const users = [
        { username: 'user1', password: 'pass1' },
        { username: 'user2', password: 'pass2' },
        { username: 'user3', password: 'pass3' }
    ];
    // 한번만 넣고 그만 넣기
    // for (const user of users) {
    //     insertStm.run(user.username, user.password);
    // }
})();

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 이걸 DB에서 조회하기
    // SELECT * FROM users WHERE username=? AND password=?

    const selectStm = db.prepare('SELECT * FROM users WHERE username=? AND password=?');
    const result = selectStm.get(username, password);

    if(result) {
        res.send("로그인 성공");
    } else {
        res.send("로그인 실패");
    }
});

app.listen(PORT, () => {
    console.log('서버 레디...');
});