
document.addEventListener('DOMContentLoaded', async function () {
    let db;
    // Abrir la base de datos
    async function openDB() {
        return new Promise((resolve, reject) => {
            let request = indexedDB.open('vitomaite10', 1);

            request.onsuccess = function (event) {
                db = event.target.result;
                resolve(db);
            };

            request.onerror = function (event) {
                console.error('Error al abrir la base de datos:', event.target.errorCode);
                reject(event.target.errorCode);
            };
        });
    }

    // Cargar las aficiones en forma de checkboxes
    async function cargarAficiones() {
        let transaction = db.transaction(['aficion'], 'readonly');
        let aficionStore = transaction.objectStore('aficion');
        let request = aficionStore.getAll();

        request.onsuccess = function (event) {
            let aficiones = event.target.result;

            let checkboxesContainer = document.getElementById('checkboxes');
            checkboxesContainer.innerHTML = ''; // Limpiar contenido previo

            aficiones.forEach(aficion => {
                let checkboxItem = document.createElement('div');
                checkboxItem.classList.add('checkbox-item');

                checkboxItem.innerHTML = `
                    <input type="checkbox" id="aficion-${aficion.id}" value="${aficion.id}">
                    <label for="aficion-${aficion.id}">${aficion.nombre}</label>
                `;

                checkboxesContainer.appendChild(checkboxItem);
            });
        };

        request.onerror = function () {
            console.error('Error al cargar las aficiones.');
        };
    }

    // Manejar la búsqueda
    function manejarBusqueda() {
        let loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        
        let checkboxes = Array.from(document.querySelectorAll('#checkboxes input:checked'));
        let selectedAficiones = checkboxes.map(checkbox => parseInt(checkbox.value, 10));

        if (selectedAficiones.length === 0) {
            alert('Por favor, selecciona al menos una afición.');
            return;
        }

        let transaction = db.transaction(['usuario', 'usuAfi'], 'readonly');
        let usuarioStore = transaction.objectStore('usuario');
        let usuAfiStore = transaction.objectStore('usuAfi');

        // Obtener usuarios y filtrar
        usuarioStore.getAll().onsuccess = function (event) {
            let usuarios = event.target.result;

            usuAfiStore.getAll().onsuccess = function (event) {
                let userAficiones = event.target.result;

                let usuariosFiltrados = usuarios.filter(usuario => {
                    let aficionesUsuario = userAficiones
                        .filter(ua => ua.emailUsuario === usuario.email)
                        .map(ua => ua.idAficion);
                
                let notLoggedInUser = usuario.email !== loggedInUser.email;

                    return selectedAficiones.every(id => aficionesUsuario.includes(id)) && notLoggedInUser;
                });

                // Guardar resultados en sessionStorage y redirigir
                sessionStorage.setItem('searchResults', JSON.stringify(usuariosFiltrados));
                window.location.href = 'resultadosBusquedaAficiones.html';
            };
        };
    }

    // Inicializar y vincular eventos
    await openDB();
    cargarAficiones();

    let searchButton = document.getElementById('btn-search');
    searchButton.addEventListener('click', manejarBusqueda);
});


