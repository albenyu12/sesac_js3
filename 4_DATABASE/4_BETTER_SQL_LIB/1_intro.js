const sqlite = require('better-sqlite3');

const db = sqlite('simple.db');

db.exec("CREATE TABLE IF NOT EXISTS users (id TEXT, name TEXT)");

// prepared statement를 통해서 SQL 인젝션을 방어한다. 
const insert = db.prepare("INSERT INTO users VALUES (?, ?)");
const result = insert.run('u001', 'user1');
console.log('삽입 완료: ', result);

const userId = 'u001';

const select = db.prepare('SELECT * FROM users WHERE id = ?');
const result2 = select.get(userId);
console.log('조회결과: ', result2);