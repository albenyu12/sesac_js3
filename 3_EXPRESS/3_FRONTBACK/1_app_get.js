const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/submit', (req, res) => {
    const name = req.query.name;
    const age = req.query.age;

    console.log(`사용자 이름: ${name}`);
    console.log(`사용자 나이: ${age}`);

    console.log('사용자가 보내온걸 출력할 예정');
    res.send(`<h1>안녕하세요, ${name}님</h1>`);
});

app.listen(PORT, () => {
    console.log(`Server is ready at http://127.0.0.1:${PORT}`);
});