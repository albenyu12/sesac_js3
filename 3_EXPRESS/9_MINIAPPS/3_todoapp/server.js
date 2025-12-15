const express = require('express');
const morgan = require('morgan');

const app = express();
const PORT = 3000;
const todoList = [];

app.use(express.static('public'));

app.use(express.json());

app.use(morgan('dev'));

app.post('/api/todo', (req, res) => {
    const { id, text } = req.body;
    const newTodo = { id: parseInt(id), text };
    todoList.push(newTodo);
    res.json(newTodo);
})

app.get('/api/todo', (req, res) => {
    res.json(todoList);
})

app.delete('/api/todo/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = todoList.findIndex(todo => todo.id === id);
    if (index !== -1) todoList.splice(index, 1);
    console.log(todoList);
    res.json({ success: true });
})

app.listen(PORT, () => {
    console.log(`Server is up on http://127.0.0.1:${PORT}`);
})