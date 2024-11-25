
// verLikes.js
async function verMisLikes() {
    try {
        // Asegurar que la base de datos está abierta
        if (!db) {
            await openDB();
        }

        let loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

        if (!loggedInUser) {
            alert('No se encontró información del usuario logueado.');
            return;
        }

        let transaction = db.transaction(['meGusta', 'usuario'], 'readonly');
        let meGustaStore = transaction.objectStore('meGusta');
        let usuarioStore = transaction.objectStore('usuario');

        // Obtener todos los "me gusta" hacia el usuario logueado
        let likesRequest = meGustaStore.getAll();
        likesRequest.onsuccess = function (event) {
            let allLikes = event.target.result;

            // Filtrar quiénes le dieron like al usuario logueado
            let likesRecibidos = allLikes.filter(
                like => like.emailDestino === loggedInUser.email
            );

            if (likesRecibidos.length === 0) {
                document.getElementById('likes-container').innerHTML = `<p>No tienes likes aún.</p>`;
                return;
            }

            let likesContainer = document.getElementById('likes-container');
            likesContainer.innerHTML = ''; // Limpiar la sección

            likesRecibidos.forEach(like => {
                // Verificar si hay reciprocidad
                let reciproco = allLikes.some(
                    l => l.emailOrigen === loggedInUser.email && l.emailDestino === like.emailOrigen
                );

                // Obtener la información del usuario
                let userRequest = usuarioStore.get(like.emailOrigen);
                userRequest.onsuccess = function (event) {
                    let user = event.target.result;
                    if (user) {
                        // Crear la tarjeta de usuario
                        let userCard = document.createElement('div');
                        userCard.className = 'user-card';
                        userCard.innerHTML = `
                            <img src="${user.foto}" alt="Foto de ${user.nombre}">
                            <h3>${user.nombre}, ${user.edad}</h3>
                            <p>${user.ciudad}</p>
                            ${reciproco ? '<div class="heart">❤️</div>' : ''}
                        `;
                        likesContainer.appendChild(userCard);
                    }
                };
            });
        };

        likesRequest.onerror = function () {
            alert('Hubo un problema al cargar los likes.');
        };
    } catch (error) {
        console.error('Error inesperado:', error);
        alert('Ocurrió un error al intentar cargar los likes.');
    }
}

// Iniciar la función al cargar la página
document.addEventListener('DOMContentLoaded', verMisLikes);
