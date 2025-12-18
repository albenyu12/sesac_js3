const express = require('express');
const morgan = require('morgan');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// 할일: 아래 이 변수를 없애고 DB로 대체..., DB에 접속해서 요청하고..
const db = new sqlite3.Database('todoListDB.db');

// DB 초기화 -> 나중에 함수 만들어주기
db.exec(`CREATE TABLE IF NOT EXISTS todoList (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    todoItem TEXT
)`, (err) => {
    if (err) console.error(err);
})

app.use(express.static('public'));

app.use(express.json());

app.use(morgan('dev'));

app.post('/api/todo', (req, res) => {
    const text = req.body.text;
    // 할일: INSERTs INTO todoList 

    db.run('INSERT INTO todoList (todoItem) VALUES (?)', [text], function (err) {
        if (err) {
            console.error(err);
            return;
        }
        console.log('추가된 todo: ', this.lastID);
        this.push(this.lastID);
        res.json(this.lastID);
    })
})

app.get('/api/todo', (req, res) => {
    // 할일: SELECT * FROM todoList; 라고 해서 받아온 결과를 반납한다
    db.get('SELECT * FROM todoList', (err, rows) => {
        if(err) {
            console.error(err);
            return;
        }
        console.log('전체 todo: ', rows);
        res.json(rows);
    })
})

// app.delete('/api/todo/:id', (req, res) => {
//     const id = req.params.id;

//     db.run('DELETE FROM todoList WHERE id=?', id, function (err) {
//         if (err) {
//             console.error(err);
//             return;
//         }
//         console.log(`${id}번 todo 삭제 완료`);
//         this = this.filter(todo => todo.id != id);
//         res.json({ success: true });
//     })
// })

// 할일: put 만들기
// 할일: 존재여부 확인해서 적절하게 리턴
// 할일: 업데이트

app.listen(PORT, () => {
    console.log(`Server is up on http://127.0.0.1:${PORT}`);
})