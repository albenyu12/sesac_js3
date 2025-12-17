const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('simple.db');

async function do_db_notworking() {
    const result = await db.run("CREATE TABLE IF NOT EXISTS users (id TEXT, name TEXT)");
    const result2 = await db.run("INSERT INTO users VALUES ('id001', 'user1')");

    // await가 기다려줄 수 있는건?
    // 내가 일을 시킨애가 일관된(공통된) 방법으로, 나의 진행상황을 알려줄 수 있을때...
    // 진행상황을 알려주는 애가 Promise라는 형태(객체)로 상태를 알려주고, 
    // 그때 이 상태는?? pending, fulfilled, rejected를 통해서 상태를 알려줌..
}

function runQuery(query) {
    return new Promise((resolve, reject) => {
        db.run(query, (err) => {
            if(err) {
                return reject(err);
            }
            resolve(this); 
        })
    })
}

function allQuery(query) {
    return new Promise((resolve, reject) => {
        db.all(query, (err, rows) => {
            if(err) {
                return reject(err);
            }
            resolve(rows); 
        })
    })
}

async function do_db_working() {
    // 테이블 생성
    await runQuery("CREATE TABLE IF NOT EXISTS users (id TEXT, name TEXT)");
    console.log('테이블이 성공적으로 생성되었습니다. ')

    // 데이터 삽입
    await runQuery("INSERT INTO users VALUES ('id001', 'user1')");
    console.log('데이터 삽입이 성공했습니다. ');

    // 데이터 조회
    const rows = await await allQuery('SELECT * FROM users');
    console.log('조회 성공했습니다. ');
    rows.forEach(row => console.log('조회된 메시지: ', row));
}

do_db_working();