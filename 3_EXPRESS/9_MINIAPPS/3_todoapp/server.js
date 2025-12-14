const express = require('express');
const morgan = require('morgan');

const app = express();
const PORT = 3000;
const todoList = [];

app.use(express.static('public'));

app.use(express.json());

app.use(morgan('dev'));

app.post('/api/todo', (req, res) => {
    const todoInput = req.body.text;
    todoList.push(todoInput);
    res.json(todoInput);
})

app.get('/api/todo', (req, res) => {
    res.json(todoList);
})

app.listen(PORT, () => {
    console.log(`Server is up on http://127.0.0.1:${PORT}`);
})