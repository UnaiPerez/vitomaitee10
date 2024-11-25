/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


document.addEventListener('DOMContentLoaded', function(){
    let loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    let aficionesContainer = document.getElementById('aficiones-container');
    
    function cargarAfiAñadidas(){
        let request = indexedDB.open('vitomaite10',1);
        
        request.onsuccess = function(e){
            let db = e.target.result;
            let transaction = db.transaction(['usuAfi','aficion'],'readonly');
            let usuAfiStore = transaction.objectStore('usuAfi');
            let afiStore = transaction.objectStore('aficion');
            
            let usuAfiRequest = usuAfiStore.getAll();
            usuAfiRequest.onsuccess = function(e){
                let aficionesUsuario = e.target.result.filter(usuAfi => usuAfi.emailUsuario === loggedInUser.email);
                if(aficionesUsuario.length === 0){
                    aficionesContainer.innerHTML = '<p>No tienes ninguna aficion añadida</p>';
                } else {
                    aficionesUsuario.forEach(usuAfi => {
                        let aficionRequest = afiStore.get(usuAfi.idAficion);
                        aficionRequest.onsuccess = function(e){
                            let aficion = e.target.result;
                            if(aficion){
                                let aficionCard = document.createElement('div');
                                aficionCard.classList.add('aficion-card');
                                aficionCard.textContent = aficion.nombre;
                                aficionesContainer.appendChild(aficionCard);
                            }
                        };
                    });
                } 
            };
            usuAfiRequest.onerror = function(){
                console.error('Error obteniendo tus aficiones.');
            };
        };
    }
    cargarAfiAñadidas();
});