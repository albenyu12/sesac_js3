const input = document.getElementById('input');
const sendBtn = document.getElementById('sendBtn');
const chatbox = document.getElementById('chatbox');

function add(role, text) {
    console.log(`Role: ${role}, Text: ${text}`);

    const bubble = document.createElement('div');
    bubble.className = 'mb-2';
    bubble.className = `d-flex ${role === 'user' ? 'justify-content-end' : 'justify-content-start'}`

    const badge = role === 'user'
        ? `<span class="badge text-bg-primary me-2">나</span>`
        : `<span class="badge text-bg-secondary me-2">봇</span>`;


    bubble.innerHTML = `${badge}<span>${text}</span>`;
    chatbox.appendChild(bubble);
    chatbox.scrollTop = chatbox.scrollHeight;
}

async function chat(message) {
    const res = await fetch('/api/chat', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    })
    const data = await res.json();
    console.log(data);
    return data.reply;
}

sendBtn.addEventListener('click', async () => {
    send();
})

async function send() {
    const text = input.value.trim();
    if (!text) return;

    add('user', text);
    input.value = '';

    try {
        const reply = await chat(text);
        add('bot', reply);
    } catch (err) {
        add('bot', err);
    }
}

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        send();
    }
})