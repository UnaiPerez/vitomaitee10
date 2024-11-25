let db;

function initDB() {
    let request = indexedDB.open('vitomaite10', 1);

    request.onupgradeneeded = function (event) {
        db = event.target.result;

        // Crear las tablas necesarias en caso de no existir
        if (!db.objectStoreNames.contains('usuario')) {
            db.createObjectStore('usuario', { keyPath: 'email' });
            console.log('Tabla "usuario" creada.');
        }
        
        if(!db.objectStoreNames.contains('aficion')){
            db.createObjectStore('aficion', {keyPath: 'id', autoIncrement: true});
            console.log('Tabla "aficion" creada.');
        }
        
        if(!db.objectStoreNames.contains('usuAfi')){
            db.createObjectStore('usuAfi', {keyPath: ['emailUsuario', 'idAficion']});
            console.log('Tabla "usuAfi" creada.');
        }
        
        if(!db.objectStoreNames.contains('meGusta')){
            db.createObjectStore('meGusta', {keyPath: ['emailOrigen', 'emailDestino']});
            console.log('Tabla "meGusta" creada.');
        }
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        console.log('Base de datos abierta con éxito.');

        // Llamar a la función para añadir usuarios iniciales
        addInitialUsers();
        addAficiones();
    };
    
  
    request.onerror = function (event) {
        console.error('Error al abrir la base de datos:', event.target.errorCode);
    };
}

function addInitialUsers() {
    let usuarios = [
        {
            email: 'juan1234@gmail.com',
            contraseña: 'juan1234',
            nombre: 'Juan',
            ciudad: 'Vitoria',
            edad: 28,
            genero: 'M',
            latitud: 42.8380031,
            longitud: -2.6760067,
            foto: 'images/perfilHombre.png'
        },
        {
            email: 'laura1234@gmail.com',
            contraseña: '1234',
            nombre: 'Laura',
            ciudad: 'Vitoria',
            edad: 34,
            genero: 'F',
            latitud: 42.8391109,
            longitud: -2.6746331,
            foto: 'images/perfilMujer.png'
        },
        {
            email: 'unai@gmail.com',
            contraseña: 'unai',
            nombre: 'Unai',
            ciudad: 'Vitoria',
            edad: 20,
            genero: 'M',
            latitud: 42.8482362,
            longitud: -2.6691077,
            foto: 'images/perfilHombre.png'
        },
        {
            email: 'natalia@gmail.com',
            contraseña: '1234',
            nombre: 'Natalia',
            ciudad: 'Bilbao',
            edad: 41,
            genero: 'F',
            latitud: 43.2565746,
            longitud: -2.9225389,
            foto: 'images/perfilMujer.png'
        },
        {
            email: 'ibai@gmail.com',
            contraseña: '1234',
            nombre: 'Ibai',
            ciudad: 'Bilbao',
            edad: 20,
            genero: 'M',
            latitud: 43.3035169,
            longitud: -1.9952225,
            foto: 'images/perfilHombre.png'
        },
        {
            email: 'messi@gmail.com',
            contraseña: 'messi10',
            nombre: 'Leo',
            ciudad: 'Donosti',
            edad: 38,
            genero: 'M',
            latitud: 43.3064427,
            longitud: -2.0152694,
            foto: 'images/messi.jpg'
        },
        {
            email: 'javi@gmail.com',
            contraseña: 'javi1234',
            nombre: 'Javi',
            ciudad: 'Vitoria',
            edad: 25,
            genero: 'M',
            latitud: 42.8451756,
            longitud: -2.6724441,
            foto: 'images/perfilHombre.png'
        },
        {
            email: 'lander@gmail.com',
            contraseña: 'Lander1234',
            nombre: 'Lander',
            ciudad: 'Donosti',
            edad: 44,
            genero: 'M',
            latitud: 43.3109903,
            longitud: -2.0062042,
            foto: 'images/perfilHombre.png'
        },
        {
            email: 'ana@gmail.com',
            contraseña: 'Ana1234',
            nombre: 'Ana',
            ciudad: 'Donosti',
            edad: 31,
            genero: 'F',
            latitud: 43.3051716,
            longitud: -1.9772279,
            foto: 'images/perfilMujer.png'
        },
        {
            email: 'akane@gmail.com',
            contraseña: 'Akane1234',
            nombre: 'Akane',
            ciudad: 'Vitoria',
            edad: 23,
            genero: 'F',
            latitud: 42.8645218,
            longitud: -2.6799322,
            foto: 'images/perfilMujer.png'
        },
        {
            email: 'aroa@gmail.com',
            contraseña: 'Aroa1234',
            nombre: 'Aroa',
            ciudad: 'Bilbao',
            edad: 33,
            genero: 'F',
            latitud: 43.2577946,
            longitud: -2.9225219,
            foto: 'images/perfilMujer.png'
        },
        {
            email: 'maria@gmail.com',
            contraseña: 'Maria1234',
            nombre: 'Maria',
            ciudad: 'Vitoria',
            edad: 54,
            genero: 'F',
            latitud: 42.8604922,
            longitud: -2.6836135,
            foto: 'images/perfilMujer.png'
        }
    ];

    let transaction = db.transaction(['usuario'], 'readwrite');
    let userStore = transaction.objectStore('usuario');

    usuarios.forEach(user => {
        let request = userStore.get(user.email);

        request.onsuccess = function (event) {
            if (!event.target.result) {
                // Solo agregar si no existe
                let addRequest = userStore.add(user);
                addRequest.onsuccess = function () {
                    console.log(`Usuario ${user.email} añadido con éxito.`);
                };
                addRequest.onerror = function (error) {
                    console.error(`Error al añadir usuario ${user.email}:`, error.target.error);
                };
            } else {
                console.log(`Usuario ${user.email} ya existe. No se añadió.`);
            }
        };

        request.onerror = function (error) {
            console.error(`Error al verificar usuario ${user.email}:`, error.target.error);
        };
    });

    transaction.oncomplete = function () {
        console.log('Verificación e inserción de usuarios iniciales completada.');
    };

    transaction.onerror = function (event) {
        console.error('Error en la transacción de usuarios iniciales:', event.target.error);
    };
}
// Añadir aficiones iniciales
function addAficiones() {
    let aficiones = [
        'Cine',
        'Ajedrez',
        'Teatro',
        'Futbol',
        'Lectura',
        'Bicicleta',
        'Musica',
        'Tenis',
        'Baloncesto',
        'Programacion',
        'Videojuegos',
        'Cocina',
        'Manualidades',
        'Mus'
    ];

    let transaction = db.transaction(['aficion'], 'readonly');
    let aficionStore = transaction.objectStore('aficion');
    let request = aficionStore.getAll(); // Obtener todas las aficiones existentes

    request.onsuccess = function (event) {
        let existingAficiones = event.target.result.map(afi => afi.nombre); // Extraer los nombres existentes

        let nuevasAficiones = aficiones.filter(nombre => !existingAficiones.includes(nombre)); // Filtrar las nuevas aficiones

        if (nuevasAficiones.length > 0) {
            let writeTransaction = db.transaction(['aficion'], 'readwrite');
            let aficionWriteStore = writeTransaction.objectStore('aficion');

            nuevasAficiones.forEach(nombre => {
                let addRequest = aficionWriteStore.add({ nombre });

                addRequest.onsuccess = function () {
                    console.log(`Afición añadida: ${nombre}`);
                };

                addRequest.onerror = function (event) {
                    console.error('Error añadiendo la afición:', event.target.error);
                };
            });

            writeTransaction.oncomplete = function () {
                console.log('Aficiones iniciales añadidas.');
            };

            writeTransaction.onerror = function (event) {
                console.error('Error en la transacción de aficiones:', event.target.error);
            };
        } else {
            console.log('Todas las aficiones ya existen. No se añadieron nuevas aficiones.');
        }
    };

    request.onerror = function (event) {
        console.error('Error al verificar aficiones existentes:', event.target.error);
    };
}

function manejarBusqueda(event){
    event.preventDefault(); // Prevenir cualquier recarga no deseada


    let gender = document.getElementById('gender').value;
    let ageMin = document.getElementById('age-min').value;
    let ageMax = document.getElementById('age-max').value;
    let city = document.getElementById('city').value;
    
    if(isNaN(ageMin) || isNaN(ageMax) || !gender){
        alert('Por favor, introduce datos en todos los campos');
        return;
    }
    
    let transaction = db.transaction(['usuario'],'readonly');
    let userStore = transaction.objectStore('usuario');
    let request = userStore.getAll(); //para obtener todos los usuarios
    
    request.onsuccess = function (e){
        let allUsers = e.target.result;
        
        //Filtrar usuarios por los criterios indicados
        let filteredUsers = allUsers.filter(user => {
            let genderMatch =
                gender === 'Todos' || user.genero === gender;
            let ageMatch = user.edad >= ageMin && user.edad <= ageMax;
            let cityMatch = !city || user.ciudad === city;

            return genderMatch && ageMatch && cityMatch;
        });
        
        // Guarda los resultados en sessionStorage y muestra los 
        sessionStorage.setItem('searchResults', JSON.stringify(filteredUsers));
        window.location.href = 'resultados.html';
    };
    
}

 function manejarBusquedaLogueado(event) {
        let loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        event.preventDefault();

        let gender = document.getElementById('gender').value;
        let ageMin = parseInt(document.getElementById('age-min').value, 10);
        let ageMax = parseInt(document.getElementById('age-max').value, 10);
        let city = document.getElementById('city').value;

        if (isNaN(ageMin) || isNaN(ageMax) || !gender) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        let transaction = db.transaction(['usuario'], 'readonly');
        let userStore = transaction.objectStore('usuario');

        userStore.getAll().onsuccess = function (event) {
            let allUsers = event.target.result;

            let filteredUsers = allUsers.filter(user => {
                let genderMatch = gender === 'Todos' || user.genero === gender;
                let ageMatch = user.edad >= ageMin && user.edad <= ageMax;
                let cityMatch = !city || user.ciudad === city;

                // Excluir al usuario logueado
                let notLoggedInUser = user.email !== loggedInUser.email;

                return genderMatch && ageMatch && cityMatch && notLoggedInUser;
            });

            sessionStorage.setItem('searchResults', JSON.stringify(filteredUsers));
            window.location.href = 'resultadosLogueado.html';
        };
    }

// Inicializar la base de datos y vincular el botón de búsqueda
document.addEventListener('DOMContentLoaded', function () {
    initDB();

    let searchButton = document.getElementById('btn-search');
    if (searchButton) {
        searchButton.addEventListener('click', manejarBusqueda);
    }

    let searchButtonLogueado = document.getElementById('btn-search-logueado');
    if (searchButtonLogueado) {
        searchButtonLogueado.addEventListener('click', manejarBusquedaLogueado);
    }
});




        
