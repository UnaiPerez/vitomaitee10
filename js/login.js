/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

// Abrir la base de datos existente
function openDB() {
    let request = indexedDB.open('vitomaite10', 1);

    request.onsuccess = function (event) {
        let db = event.target.result;
        console.log('Base de datos abierta con éxito.');
    };

    request.onerror = function (event) {
        console.error('Error al abrir la base de datos:', event.target.errorCode);
        alert('Hubo un problema al conectarse a la base de datos.');
    };
}

function loginUser() {
    // Obtener los valores añadidos
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    // Verificar que se haya ingresado información
    if (!email || !password) {
        alert('Por favor, ingresa el email y la contraseña.');
        return;
    }

    // Verificar que la base de datos esté lista
    if (!db) {
        alert('La base de datos no está disponible. Intenta de nuevo más tarde.');
        return;
    }
   
    let transaction = db.transaction(['usuario'], 'readonly');
    let userStore = transaction.objectStore('usuario');

    
    let request = userStore.get(email);

    request.onsuccess = function (event) {
        let user = event.target.result;

        // Mira si el usuario existe o no
        if (!user) {
            alert('El email no está registrado.');
            return;
        }

        // Verifica la contraseña
        if (user.contraseña === password) {
            alert(`¡Bienvenido, ${user.nombre}!`);
            sessionStorage.setItem('loggedInUser', JSON.stringify(user));
            window.location.href = 'pantallaLogueado.html';
        } else {
            alert('La contraseña es incorrecta.');
        }
    };

    request.onerror = function () {
        console.error('Error al buscar el usuario.');
        alert('Hubo un error al intentar iniciar sesión.');
    };
}

