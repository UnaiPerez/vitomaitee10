/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

document.addEventListener('DOMContentLoaded', function(){
    let loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    let aficionesContainer = document.getElementById('aficiones-container');
    let btnDelAficiones = document.getElementById('btn-del-aficiones');
    
    if(!loggedInUser) {
        alert('Inicia sesion para eliminar aficiones');
        window.location.href = 'login.html';
        return;
    }
    
    //Aficiones añadidas por el usuario
    function cargarAfiAñadidas(){
        let request = indexedDB.open('vitomaite10', 1);
        
        request.onsuccess = function(e){
            let db = e.target.result;
            let transaction = db.transaction(['usuAfi', 'aficion'], 'readonly');
            let usuAfiStore = transaction.objectStore('usuAfi');
            let afiStore = transaction.objectStore('aficion');
            
            let usuAfiRequest = usuAfiStore.getAll();
            
            usuAfiRequest.onsuccess = function(e){
                let aficionesUsuario = e.target.result.filter(usuAfi => usuAfi.emailUsuario === loggedInUser.email);
                if(aficionesUsuario.length === 0){
                    aficionesContainer.innerHTML = '<p>No tienes aficiones que se puedan eliminar</p>';
                } else {
                    aficionesUsuario.forEach(usuAfi => {
                        let aficionRequest = afiStore.get(usuAfi.idAficion);
                        aficionRequest.onsuccess = function(e){
                            let aficion = e.target.result;
                            let checkbox = document.createElement('div');
                            checkbox.innerHTML = 
                            `
                                <label>
                                     <input type="checkbox" value="${usuAfi.idAficion}" > ${aficion.nombre}
                                </label>
                            `;
                            aficionesContainer.appendChild(checkbox);
                        };
                    });
                }
            };
        };
    }
    
    //Eliminacion de las aficiones deseadas
    btnDelAficiones.addEventListener('click', function(){
        let checkboxes = aficionesContainer.querySelectorAll('input[type="checkbox"]:checked');
        if(checkboxes.length === 0){
            alert('Por favor, selecciona al menos una aficion');
            return;
        }
        let request = indexedDB.open('vitomaite10', 1);
        request.onsuccess = function(e){
            let db =e.target.result;
            let transaction = db.transaction(['usuAfi'],'readwrite');
            let usuAfiStore = transaction.objectStore('usuAfi');
            
            checkboxes.forEach(checkbox => {
                let idAficion = parseInt(checkbox.value,10);
                usuAfiStore.delete([loggedInUser.email,idAficion]).onsuccess = function(e){
                    console.log(`Aficion con el ID $[idAficion} eliminada.`);
                };
            });
            transaction.oncomplete = function() {
                alert('Las aficiones seleccionadas han sido eliminadas.');
                window.location.href = 'pantallaLogueado.html';
            };
        };
    });
    cargarAfiAñadidas();
});
