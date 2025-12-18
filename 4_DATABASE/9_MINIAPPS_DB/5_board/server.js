const express = require('express');
const Database = require('./database.js');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

const db = new Database();

init_db();

app.get('/api/list', (req, res) => {
    console.log('목록 조회');
    db.
    res.send('목록 조회');
});

function init_db() {
    const sql = fs.readFileSync('init_db', 'utf8');
    const statements = sql.split(';');
    for (const statement of statements) {
        db.exec(statement, (err) => {
            if (err) {
                console.log('이미 초기화 되었습니다. ');
                return;
            }
        });
    }
}

app.post('/api/create', (req, res) => {
    const { title, message } = req.body;
    console.log('글 작성');
    // 비즈로직 구현
    const sql = 'INSERT INTO users (title, message) VALUES (?, ?)'
    const rows = db.execute(sql, [title, message]);
    db.push(rows);
    console.log(rows);
    res.json({ 'result': 'success' });
    // res.send('글 작성');
});

app.delete('/api/delete', (req, res) => {
    const id = req.body.id;
    console.log('글 삭제');
    const deleteSql = 'DELETE FROM users WHERE id=?';
    db.execute(deleteSql, 1);

    res.send({ success: true });
    // res.send('글 삭제');
});

// app.modify('/api/modify', (req, res) => {
//     console.log('글 수정');
//     res.send('글 수정');
// });

app.listen(PORT, () => {
    console.log('서버 레디...');
});