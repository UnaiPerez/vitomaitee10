/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

let db;

function openDB() {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open('vitomaite10', 1);

        request.onsuccess = function (event) {
            db = event.target.result;
            console.log('Base de datos abierta con éxito.');
            resolve(db);
        };

        request.onerror = function (event) {
            console.error('Error al abrir la base de datos:', event.target.errorCode);
            reject(event.target.error);
        };

        request.onupgradeneeded = function (event) {
            db = event.target.result;
            if (!db.objectStoreNames.contains('usuario')) {
                db.createObjectStore('usuario', { keyPath: 'email' });
            }
            if (!db.objectStoreNames.contains('meGusta')) {
                db.createObjectStore('meGusta', { keyPath: ['emailOrigen', 'emailDestino'] });
            }
        };
    });
}
