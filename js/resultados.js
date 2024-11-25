/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

document.addEventListener('DOMContentLoaded', function () {
    let resultsContainer = document.getElementById('results-container');

    let results = JSON.parse(sessionStorage.getItem('searchResults'));

    if (!results || results.length === 0) {
        resultsContainer.textContent = 'No se encontraron resultados.';
        return;
    }

    results.forEach(user => {
        let userCard = document.createElement('div');
        userCard.classList.add('user-card');


        userCard.innerHTML = `
            <img src="${user.foto}" alt="Foto de ${user.nombre}" class="user-photo">
            <h3>${user.nombre}, ${user.edad}</h3>
            <p>${user.ciudad}</p>
            <a href="login.html">Inicia sesión para ver más detalles</a>
        `;

        resultsContainer.appendChild(userCard);
    });
});
