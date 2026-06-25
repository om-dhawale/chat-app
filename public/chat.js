const token = localStorage.getItem("token");
const roomId = localStorage.getItem("roomId");
const username = localStorage.getItem("username");
document.getElementById('roomTitle').textContent = localStorage.getItem('roomName') || 'Room';

if (!token || !roomId) {
  window.location.href = "/index.html";
}

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const ws = new WebSocket(`${protocol}//${window.location.host}?token=${token}`);

ws.onopen = () => {
  ws.send(JSON.stringify({ type: "join_room", roomId: parseInt(roomId) }));
};

document.getElementById("messageInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

ws.onmessage = (event) => {
  const messages = document.getElementById("messages");
  const div = document.createElement("div");
  div.className = "message theirs";
  const msg = JSON.parse(event.data);
  div.textContent = `${msg.username}: ${msg.body}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
};

ws.onclose = () => {
  const messages = document.getElementById("messages");
  const div = document.createElement("div");
  div.className = "message";
  div.textContent = "Disconnected. Please refresh the page.";
  div.style.color = "red";
  div.style.textAlign = "center";
  messages.appendChild(div);
};

function sendMessage() {
  const input = document.getElementById("messageInput");
  const body = input.value;
  if (!body.trim()) return;
  ws.send(JSON.stringify({ type: "message", roomId: parseInt(roomId), body }));
  const messages = document.getElementById("messages");
  const div = document.createElement("div");
  div.className = "message mine";
  div.textContent = `${username}: ${body}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  input.value = "";
}

async function loadMessages() {
  const messages = document.getElementById("messages");
  messages.innerHTML = '<div style="text-align:center; color:#999;">Loading messages...</div>';
  const res = await fetch(`/messages/${roomId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  messages.innerHTML = '';
  data.messages.forEach((msg) => {
    const div = document.createElement("div");
    div.className = `message ${msg.username === username ? "mine" : "theirs"}`;
    div.textContent = `${msg.username}: ${msg.body}`;
    messages.appendChild(div);
  });
}

loadMessages();
