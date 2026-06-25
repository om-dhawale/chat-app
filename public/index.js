const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

function toggleForm() {
    loginForm.classList.toggle('hidden');
    registerForm.classList.toggle('hidden');
}

async function register() {
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    if (res.ok) {
        alert('Registered successfully! Please login.');
        toggleForm();
    } else {
        alert(data.error || 'Registration failed');
    }
}

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        window.location.href = '/rooms.html';
    } else {
        alert(data.error || 'Login failed');
    }
}

