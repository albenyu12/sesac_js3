const express = require('express');
const app = express();
const PORT = 3000;

// 미들웨어들..
app.use((req, res, next) => {
    console.log("1. 내가 중간에 가로챔...ㅎㅎ 근데 너 로그인 안했구나??");
    // res.send("로그인부터 하고 오세요"); // 보내버리는 순간 끝난다

    next(); // 다음꺼 호출..
})

app.use((req, _, next) => {
    console.log("2. 나는 두번째 미들웨어");
    console.log("사용자 왔다감: ", req.socket.remoteAddress);
    next();
})

app.use((_req, _res, next) => {
    console.log("3. 나는 세번째 미들웨어... 나는 req/res 둘 다 안보고 안처리함");

    next();
})

// 라우터들..
app.get('/', (req, res) => {
    console.log(`4. 루트 라우트에 접속`);
    res.send("웰컴투 마이홈");
})

app.get('/users', (req, res) => {
    console.log(`사용자 라우트에 접속`);
    res.send("웰컴투 유저들의 홈");
})

app.listen(PORT, () => {
    console.log(`Server is ready, http://127.0.0.1:${PORT}`);
})