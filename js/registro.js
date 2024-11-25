
//Empezar abriendo la conexion
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
// Función para manejar el registro de usuarios
function registerUser() {
    // Capturar los datos del formulario
    let email = document.getElementById('email').value.trim();
    let password = document.getElementById('password').value.trim();
    let name = document.getElementById('name').value.trim();
    let city = document.getElementById('city').value;
    let latitud = parseFloat(document.getElementById('latitud').value);
    let longitud = parseFloat(document.getElementById('longitud').value);
    let age = parseInt(document.getElementById('age').value, 10);
    let gender = document.getElementById('gender').value;
    let photoFile = document.getElementById('photo').files[0];

    // Validar datos básicos
    if (!email || !password || !name || !city || isNaN(latitud) || isNaN(longitud) || isNaN(age) || !gender || !photoFile) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }
    
    // Validar la correcta estructura del email
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, ingresa un correo electrónico válido.');
        return;
    }
    
    //comprobar edad minima
    if (age < 18){
        alert('Por favor, ingrese una edad valida (Mayor de 18).');
        return;
    }

    // Leer la foto en formato Base64
    let reader = new FileReader();
    reader.onload = function (event) {
        let photoBase64 = event.target.result;

        let user = {
            email,
            contraseña: password,
            nombre: name,
            ciudad: city,
            latitud,
            longitud,
            edad: age,
            genero: gender,
            foto: photoBase64
        };

        // Verificar y guardar el usuario en IndexedDB
        saveUserToDB(user);
    };
    reader.readAsDataURL(photoFile);
}

// Guardar el usuario usuario
function saveUserToDB(user) {
    let transaction = db.transaction(['usuario'], 'readwrite');
    let userStore = transaction.objectStore('usuario');

    // Verificar si el email ya está registrado
    let request = userStore.get(user.email);
    request.onsuccess = function (event) {
        if (event.target.result) {
            alert('El correo ya está registrado. Por favor, utiliza otro correo o inicia sesión.');
        } else {
            // Agregar el nuevo usuario
            const addRequest = userStore.add(user);

            addRequest.onsuccess = function () {
                alert('Usuario registrado con éxito.');
                window.location.href = 'login.html';
            };

            addRequest.onerror = function (error) {
                console.error('Error al guardar el usuario:', error.target.error);
            };
        }
    };

    request.onerror = function (error) {
        console.error('Error al verificar el usuario:', error.target.error);
    };
}


document.addEventListener('DOMContentLoaded', function () {

    // Vincular el botón de registro
    let registerButton = document.getElementById('btn-register');
    registerButton.addEventListener('click', registerUser);
});

