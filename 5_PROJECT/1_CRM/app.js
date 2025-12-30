const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3000;
const db = new Database(path.join(__dirname, 'user-sample.db'));

app.use(express.json());
app.use(express.static('public'));

// // curl -X GET 127.0.0.1:3000/api/crm/users
// app.get('/api/crm/users', (req, res) => {
//     try {
//         const selectStm = db.prepare('SELECT * FROM users ORDER BY Id LIMIT 10');
//         const rows = selectStm.all();
//         // console.log(rows);
//         res.json(rows);
//     } catch (err) {
//         console.log(err);
//     }
// })

// curl -X GET "127.0.0.1:3000/api/crm/users?page=1&size=10"
app.get('/api/crm/users', (req, res) => {
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);
    const offset = (page - 1) * size;
    const sql = `SELECT * FROM users ORDER BY Id LIMIT ? OFFSET ?`

    try {
        const selectStm = db.prepare(sql);
        const rows = selectStm.all(size, offset);
        console.log(rows);
    } catch (err) {
        console.log(err);
    }
})

app.listen(PORT, () => {
    console.log(`Server is ready on http://127.0.0.1:${PORT}`);
})