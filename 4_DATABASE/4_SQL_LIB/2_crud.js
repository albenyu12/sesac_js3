const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('myDataBase.db');

db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    username TEXT, 
    email TEXT
)`, (err) => {
    if (err) console.error(err);
});

db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
        console.error(err);
        return;
    } 
    console.log('모든 사용자: ', rows);
});

const newUser = {
    username: 'user9', 
    email: 'user9@example.com'
}

db.run('INSERT INTO users (username, email) VALUES (?, ?)', [newUser.username, newUser.email], function (err) {
    if (err) {
        console.error(err);
        return;
    }
    console.log('추가된 사용자의 ID: ', this.lastID);
});

const userId = 9;
db.get('SELECT * FROM users WHERE id=?', userId, (err, rows) => {
    if(err) {
        console.error(err);
        return;
    }
    console.log('조회한 사용자 정보: ', rows);
});

const updateUser = {
    username: 'user001', 
    email:'user001@example.com'
}

db.run('UPDATE users SET username=?, email=? WHERE id=?', [updateUser.name, updateUser.email, 3], function (err) {
    if(err) {
        console.error(err);
        return;
    }
    console.log('업데이트 완료', this.changes);
});

const deleteId = 4;
db.run('DELETE FROM users WHERE id=?', deleteId, (err) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('삭제 완료');
});

db.close;