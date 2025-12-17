const express = require('express');
const Database = require('better-sqlite3');
const fs = require('fs');

const port = 3000;
const db_file = 'my-express-db.db'

const app = express();
const db = new Database(db_file);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

function init_database() {
    const sql = fs.readFileSync('init_database.sql', 'utf8');
    const statements = sql.split(';');
    try {
        for (const statement of statements) {
            // console.log(statement);
            db.exec(statement);
        }
    } catch(err) {
        console.log('이미 초기화 되었습니다. ');
    }
}

init_database();

app.get('/api/table/:table', (req, res) => {
    const db_table = req.params.table;

    try {
        const query_str = `SELECT * FROM ${db_table}`;
        const query = db.prepare(query_str);
        const queryResult = query.all();
        res.json(queryResult);
    } catch (err) {
        res.send('요청하신 테이블 정보는 존재하지 않습니다. ');
    }
});

app.get('/api/users', (req, res) => {
    const { username } = req.query;
    if (username) {
        const query = db.prepare('SELECT * FROM users WEHRE username LIKE ?');
        const users = query.all(`${username}`);
        res.json(users);
    } else {
        const users = db.prepare('SELECT * FROM users').all();
        res.send(users);
    };
});

app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const user = db.prepare('SELECT * FROM users WHERE id=?').get(userId);
    if (user) {
        res.json(user);
    } else {
        return res.status(404).send('사용자가 없습니다. ');
    }
});
// curl -X POST localhost:3000/api/users/ -d username=hello -d password=world

app.post('/api/users', (req, res) => {
    const { username, password } = req.body;
    const insert = db.prepare('INSERT INTO users (username, password) VALUES (?,?)');
    const result = insert.run(username, password);
    res.send(`사용자가 추가 되었습니다. 신규 ID: ${result.lastInsertRowid}`);
});
// curl -X GET localhost:3000/api/users/5

// curl -X PUT localhost:3000/api/users/5 -d username=hi -d password=sqlite
app.put('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const { username, password } = req.body;
    const updateQuery = db.prepare('UPDATE users SET username=?, password=? WHERE id=?');
    updateQuery.run(username, password, userId);
    res.send(`업데이트 완료..`);
});
// curl -X DELETE localhost:3000/api/users/3
app.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    const deleteQuery = db.prepare('DELETE FROM users WHERE id=?');
    deleteQuery.run(userId);
    res.send('사용자 삭제 완료..');
});

app.get('/api/products', (req, res) => {
    const { name } = req.query;

    if (name) {
        const query = db.prepare('SELECT * FROM products WHERE name LIKE ?');
        const rows = query.all(`%${name}%`);
        res.json(rows);
    } else {
        const query = db.prepare('SELECT * FROM products');
        const rows = query.all();
        res.json(rows);
    }
});

app.listen(port, () => {
    console.log('Server is ready...');
});