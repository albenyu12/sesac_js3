const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3000;
const db = new Database(path.join(__dirname, 'user-sample.db'));

app.use(express.json());
app.use(express.static('public'));

// curl -X GET 127.0.0.1:3000/api/crm/users
app.get('/api/crm/users', (req, res) => {
    try {
        const selectStm = db.prepare('SELECT * FROM users LIMIT 10');
        const rows = selectStm.all();
        // console.log(rows);
        res.json(rows);
    } catch (err) {
        console.log(err);
    }
})

// curl -X GET 127.0.0.1:3000/api/crm/users/b94a544a-87a0-4696-9863-eb3b1c140291
app.get('/api/crm/users/:id', (req, res) => {
    const id = req.params.id;

    try {
        const selectStm = db.prepare('SELECT * FROM users LIMIT 10 OFFSET (?-1)*10');
        const row = selectStm.get(id);
        console.log(row);
    } catch (err) {
        console.log(err);
    }
})

app.listen(PORT, () => {
    console.log(`Server is ready on http://127.0.0.1:${PORT}`);
})