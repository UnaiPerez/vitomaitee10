document.addEventListener('DOMContentLoaded', function () {
    let resultsContainer = document.getElementById('results-container');

    // Obtener los resultados de la búsqueda desde sessionStorage
    let results = JSON.parse(sessionStorage.getItem('searchResults'));

    if (!results || results.length === 0) {
        resultsContainer.innerHTML = '<p>No se encontraron usuarios con las aficiones seleccionadas.</p>';
        return;
    }

    results.forEach(user => {
        let userCard = document.createElement('div');
        userCard.classList.add('user-card');

        userCard.innerHTML = `
            <div class="user-info">
                <img src="${user.foto}" alt="Foto de ${user.nombre}" class="user-photo">
                <h3>${user.nombre}, ${user.edad}</h3>
                <p>${user.ciudad}</p>
                <a href="#" class="view-details" data-email="${user.email}">Ver más detalles</a>
            </div>
        `;

        resultsContainer.appendChild(userCard);
    });
    
    document.querySelectorAll('.view-details').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Evitar el comportamiento por defecto del enlace

            let email = this.dataset.email;
            let user = results.find(u => u.email === email);

            if (user) {
                sessionStorage.setItem('selectedUser', JSON.stringify(user));
                window.location.href = `detalles.html?email=${encodeURIComponent(email)}`;
            } else {
                alert('No se pudo encontrar la información del usuario.');
            }
        });
    });
});
