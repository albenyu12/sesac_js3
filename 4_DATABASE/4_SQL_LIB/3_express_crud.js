const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const db = new sqlite3.Database('my-express-db.db');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

function init_database() {
    const sql = fs.readFileSync('init_database.sql', 'utf8');
    const statements = sql.split(';');
        for (const statement of statements) {
            // console.log(statement);
            db.exec(statement, (err) => {
                if (err) {
                    console.log('이미 초기화 되었습니다. ');
                    return;
                }
            });
        }
};

init_database();

app.get('/api/table/:table', (req, res) => {
    const db_table = req.params.table;

    db.all(`SELECT * FROM ${db_table}`, (err, rows) => {
        if (err) {
            console.log('요청하신 테이블 정보는 존재하지 않습니다. ');
            return;
        } 
        req.json(rows);
    })
})

app.get('/api/users', (req, res) => {
    db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }
        res.send(rows);
    })
})

app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;

    db.get('SELECT * FROM users WHERE id=?', userId, (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).send('DB 오류');
        }

        if(!row) {
            console.log('사용자가 없습니다. ');
            return res.status(404).send('사용자가 없습니다. ');
        }
        res.json(rows);
    })
});
// curl -X POST localhost:3000/api/users/ -d username=hello -d password=world

// app.post('/api/users', (req, res) => {
//     const { username, password } = req.body;
//     const insert = db.prepare('INSERT INTO users (username, password) VALUES (?,?)');
//     const result = insert.run(username, password);
//     res.send(`사용자가 추가 되었습니다. 신규 ID: ${result.lastInsertRowid}`);
// });
// // curl -X GET localhost:3000/api/users/3

// // curl -X PUT localhost:3000/api/users/5 -d username=hi -d password=sqlite
// app.put('/api/users/:id', (req, res) => {
//     const userId = req.params.id;
//     const { username, password } = req.body;
//     const updateQuery = db.prepare('UPDATE users SET username=?, password=? WHERE id=?');
//     updateQuery.run(username, password, userId);
//     res.send(`업데이트 완료..`);
// });

// // curl -X DELETE localhost:3000/api/users/3
// app.delete('/api/users/:id', (req, res) => {
//     const userId = req.params.id;
//     const deleteQuery = db.prepare('DELETE FROM users WHERE id=?');
//     deleteQuery.run(userId);
//     res.send('사용자 삭제 완료..');
// });

app.listen(port, () => {
    console.log('Server is ready...');
});