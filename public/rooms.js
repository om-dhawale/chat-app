const token = localStorage.getItem("token");

console.log(token);

if (!token) {
  window.location.href = "/index.html";
}

async function fetchRooms() {
  const res = await fetch("/room", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  const roomsList = document.getElementById("roomsList");
  roomsList.innerHTML = "";
  data.rooms.forEach((room) => {
    const div = document.createElement("div");
    div.className = "room";

    const name = document.createElement("span");
    name.className = "room-name";
    name.textContent = room.name;
    div.onclick = () => {
      localStorage.setItem("roomId", room.id);
      localStorage.setItem('roomName', room.name);
      window.location.href = "/chat.html";
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = async (e) => {
      e.stopPropagation();
      const res = await fetch(`/room/${room.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchRooms();
    };

    div.appendChild(name);
    div.appendChild(deleteBtn);
    roomsList.appendChild(div);
  });
}

async function createRoom() {
  const name = document.getElementById("roomName").value;
  const res = await fetch("/room", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (res.ok) {
    document.getElementById("roomName").value = "";
    fetchRooms();
  } else {
    alert(data.error || "Failed to create room");
  }
}

fetchRooms();
