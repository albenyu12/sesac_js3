const express = require('express');
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const db = new Database(path.join(__dirname, 'board.db'));

app.use(express.json());
app.use(express.static('public'));

(() => {
    const sql = fs.readFileSync('init_db.sql', 'utf8');
    const statements = sql.split(';');
    for (const statement of statements) {
        try {
            db.exec(statement);
        } catch (err) {
            console.log('이미 초기화되었습니다. ');
            return;
        }
    }
})();

//curl -X GET 127.0.0.1:3000/api/note/board
app.get('/api/note/table/:table', (req, res) => {
    const db_table = req.params.table;
    
    try {
        const selectStm = db.prepare(`SELECT * FROM ${db_table}`);
        const rows = selectStm.all();
        console.log(rows);
        res.json(rows);
    } catch (err) {
        console.error(err);
    }
})

// curl -X GET 127.0.0.1:3000/api/note/2
app.get('/api/note/:id', (req, res) => {
    const id = Number(req.params.id);
    console.log(id);
    try {
        const selectStm = db.prepare('SELECT title, message FROM board WHERE id=?');
        const row = selectStm.get(id);
        res.json(row);
    } catch (err) {
        console.error(err);
    }
})

app.post('/api/note/create', (req, res) => {
    const { title, message } = req.body;
    console.log(req.body);

    try {
        const selectStm = db.prepare('INSERT INTO board (title, message) VALUES (?, ?)');
        const row = selectStm.run(title, message);
        res.json({ ok: true, ...row });
    } catch (err) {
        console.error(err);
    }
})

app.delete('/api/note/:id', (req, res) => {
    const id = req.params.id;

    try {
        const selectStm = db.prepare('DELETE FROM board WHERE id=?');
        const row = selectStm.run(id);
        res.json(row);
    } catch(err) {
        res.status(404).send('노트를 찾을 수 없습니다. ')
    }
})

app.listen(PORT, () => {
    console.log(`Server is ready on http://127.0.0.1:${PORT}`);
})