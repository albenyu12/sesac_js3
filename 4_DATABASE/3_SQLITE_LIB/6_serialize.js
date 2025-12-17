const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('simple.db');

db.serialize(() => {
    // 테이블 생성
    db.run("CREATE TABLE IF NOT EXISTS users (id TEXT, name TEXT)");

    // 데이터 삽입
    db.run("INSERT INTO users VALUES ('id001', 'user1')");
    db.run("INSERT INTO users VALUES ('id002', 'user2')");

    // 데이터 조회
    db.all("SELECT * FROM users", (err, rows) => {
        if(err) return console.error(err);
        console.log("조회된 데이터: ", rows);
    });
});