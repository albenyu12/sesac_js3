const { runQuery, allQuery } = require('./5_intro_db_library');

async function do_db_working() {
    // 테이블 생성
    await runQuery("CREATE TABLE IF NOT EXISTS users (id TEXT, name TEXT)");
    console.log('테이블이 성공적으로 생성되었습니다. ')

    // 데이터 삽입
    await runQuery("INSERT INTO users VALUES ('id001', 'user1')");
    console.log('데이터 삽입이 성공했습니다. ');

    // 데이터 조회
    const rows = await allQuery('SELECT * FROM users');
    console.log('조회 성공했습니다. ');
    rows.forEach(row => console.log('조회된 메시지: ', row));
}

do_db_working();