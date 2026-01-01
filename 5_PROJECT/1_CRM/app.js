const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3000;
const db = new Database(path.join(__dirname, 'user-sample.db'));

app.use(express.json());
app.use(express.static('public'));

// curl -X GET "127.0.0.1:3000/api/crm/users?name=%EA%B9%80&page=3&size=10"
app.get('/api/crm/users', (req, res) => {
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);
    const name = req.query.name;
    const offset = (page - 1) * size;
    let sql = `SELECT * FROM users`
    let params = [];

    if (name) {
        sql += ` WHERE Name LIKE ?`;
        params.push(`%${name}%`);
    }

    sql += ` ORDER BY Id LIMIT ? OFFSET ?`;
    params.push(size, offset);
    try {
        console.log(params);

        const selectStm = db.prepare(sql);
        const rows = selectStm.all(params);
        res.json(rows);
    } catch (err) {
        console.log(err);
    }
})

app.listen(PORT, () => {
    console.log(`Server is ready on http://127.0.0.1:${PORT}`);
})