// API Base URL - Update this to your backend URL
const API_BASE_URL = 'http://localhost:8000';

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutBtn = document.getElementById('logoutBtn');
const userDataDiv = document.getElementById('userData');

// Check if user is logged in
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    
    if (token && window.location.pathname.includes('dashboard.html')) {
        fetchUserData();
    } else if (token && !window.location.pathname.includes('dashboard.html')) {
        window.location.href = 'dashboard.html';
    } else if (!token && window.location.pathname.includes('dashboard.html')) {
        window.location.href = 'login.html';
    }
});

// Login Form Handler
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('token', data.access_token);
                window.location.href = 'dashboard.html';
            } else {
                alert('Login failed: ' + (data.detail || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during login');
        }
    });
}

// Register Form Handler
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert('Registration successful! Please login.');
                window.location.href = 'login.html';
            } else {
                alert('Registration failed: ' + (data.detail || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during registration');
        }
    });
}

// Logout Handler
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });
}

// Fetch User Data
async function fetchUserData() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayUserData(data);
        } else {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error:', error);
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
}

// Display User Data
function displayUserData(user) {
    if (userDataDiv) {
        userDataDiv.innerHTML = `
            <p><strong>Username:</strong> ${user.username}</p>
            <p><strong>Email:</strong> ${user.email}</p>
        `;
    }
}