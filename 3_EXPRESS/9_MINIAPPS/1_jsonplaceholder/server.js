const express = require('express');
const app = express();
const PORT = 3000;

const posts = [
    { id: 1, title: '나의 첫번째 글', body: '이것은 나의 첫번째 글입니다.'},
    { id: 2, title: '나의 두번째 글', body: '이것은 나의 두번째 글입니다.'},
]

app.use(express.json());

app.use(express.static('public'));

app.get('/api/posts', (req, res) => {
    res.json(posts);
});

app.post('/api/posts', (req, res) => {
    const newPost = req.body;
    posts.push(newPost);
    res.json(newPost);
})

app.delete('/api/posts', (req, res) => {
    res.json(posts);
})

app.listen(PORT, () => {
    console.log('서버레디');
});