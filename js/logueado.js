/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


// Verificar si el usuario está logueado al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    let loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    // Si no hay usuario logueado, redirigir al login
    if (!loggedInUser) {
        alert('No estás logueado. Por favor, inicia sesión.');
        window.location.href = 'login.html';
        return;
    }

    // Mostrar el nombre y la foto del usuario
    let userNameElement = document.getElementById('username');
    let userPhotoElement = document.getElementById('userPhoto');

    if (userNameElement) {
        userNameElement.textContent = `¡Hola, ${loggedInUser.nombre}!`;
    }

    if (userPhotoElement) {
        userPhotoElement.src = loggedInUser.foto; // Base64 o URL
        userPhotoElement.alt = `Foto de ${loggedInUser.nombre}`;
    }

    // Vincular el botón de logout
    let logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutUser);
    }
});

// Función para manejar el logout
function logoutUser() {
    sessionStorage.removeItem('loggedInUser');
    alert('Has cerrado sesión con éxito.');
    window.location.href = 'index.html';
}

