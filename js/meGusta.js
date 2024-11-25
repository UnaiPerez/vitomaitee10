/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

// Función para abrir la base de datos
async function openDB() {
    return new Promise((resolve, reject) => {
        if (db) {
            console.log("Base de datos ya está abierta.");
            resolve(db);
            return;
        }

        const request = indexedDB.open('vitomaite10', 1);

        request.onsuccess = function (event) {
            db = event.target.result;
            console.log('Base de datos abierta con éxito.');
            resolve(db);
        };

        request.onerror = function (event) {
            console.error('Error al abrir la base de datos:', event.target.errorCode);
            reject(event.target.errorCode);
        };
    });
}

// Función que maneja el clic en "Me gusta"
async function handleLikeButtonClick() {
    try {
        if (!db) await openDB();

        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        const selectedUser = JSON.parse(sessionStorage.getItem('selectedUser'));

        if (!loggedInUser || !selectedUser) {
            console.error("Datos faltantes:");
            console.error("loggedInUser:", loggedInUser);
            console.error("selectedUser:", selectedUser);
            alert("Algo salió mal. Por favor, vuelve a la página de resultados.");
            return;
        }

        const transaction = db.transaction(['meGusta'], 'readwrite');
        const meGustaStore = transaction.objectStore('meGusta');

        const likeEntry = {
            emailOrigen: loggedInUser.email,
            emailDestino: selectedUser.email
        };

        const request = meGustaStore.add(likeEntry);

        request.onsuccess = function () {
            alert(`Le has dado "Me gusta" a ${selectedUser.nombre}.`);
            window.location.href = "resultadosLogueado.html";
        };

        request.onerror = function (event) {
            if (event.target.error.name === 'ConstraintError') {
                alert('Ya le has dado "Me gusta" a este usuario.');
            } else {
                alert('Hubo un problema. Intenta nuevamente más tarde.');
            }
        };
    } catch (error) {
        alert("Hubo un problema inesperado. Intenta más tarde.");
        console.error("Error:", error);
    }
}

// Configurar el listener del botón "Me gusta"
document.addEventListener('DOMContentLoaded', async function () {
    try {
        await openDB();

        const btnLike = document.getElementById('btn-like');
        if (btnLike) {
            btnLike.addEventListener('click', handleLikeButtonClick);
        } else {
            console.warn("Botón 'Me gusta' no encontrado.");
        }
    } catch (error) {
        console.error("Error al inicializar:", error);
    }
});

