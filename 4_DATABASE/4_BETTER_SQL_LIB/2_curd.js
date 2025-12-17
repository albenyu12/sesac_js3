const sqlite = require('better-sqlite3');

const db = sqlite('mydatabase.db');

//1. 테이블 생성
db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    username TEXT, 
    email TEXT
)`)

// 2. 모든 사용자 조회
const allUsers = db.prepare('SELECT * FROM users').all();
console.log('모든 사용자: ', allUsers);

// 3. 새로운 사용자 추가
const newUser = {
    username: 'user1', 
    email: 'user1@example.com'
};

const insert = db.prepare('INSERT INTO users (username, email) VALUES (?, ?)').run(newUser.username, newUser.email);
console.log('추가된 사용자의 ID: ', insert.lastInsertRowid);

// 4. 특정 사용자 조회
const userId = 1;
const user = db.prepare('SELECT * FROM users WHERE id=?').get(userId);
console.log('조회한 사용자: ', user);

// 5. 사용자 정보 업데이트
const updateUser = {
    id:1, 
    username: 'user001', 
    email:'user001@example.com'
}

const update = db.prepare('UPDATE users SET username=?, email=? WHERE id=?');
update.run(updateUser.username, updateUser.email, updateUser.id);
console.log('업데이트 완료');

const deleteId =2;
const deleteQuery = db.prepare('DELETE FROM users WHERE id=?').run(deleteId);
console.log('삭제 완료');

db.close;