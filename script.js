// ثبت‌نام
document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    
    const response = await fetch('/register', {
        method: 'POST',
        body: formData,
    });

    if (response.ok) {
        alert('Registration successful! Please log in.');
        window.location.href = 'login.html';
    } else {
        alert('Registration failed.');
    }
});

// ورود
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    
    const response = await fetch('/login', {
        method: 'POST',
        body: formData,
    });

    if (response.ok) {
        alert('Login successful!');
        window.location.href = 'upload.html'; // به صفحه بارگذاری ویدیو منتقل شوید
    } else {
        alert('Login failed.');
    }
});