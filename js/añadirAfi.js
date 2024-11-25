/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

document.addEventListener('DOMContentLoaded', function() {
    let loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    let aficionesContainer =document.getElementById('aficiones-container');
    let btnAdd = document.getElementById('btn-add-aficiones');
    
    //Obtener todas las aficiones de la tabla
    function cargarAficionesDisponibles(){
        let request = indexedDB.open('vitomaite10', 1);
        
        request.onsuccess = function(e){
            let db = e.target.result;
            
            let aficionesTransaction = db.transaction(['aficion'],'readonly');
            let aficionStore = aficionesTransaction.objectStore('aficion');
            let aficionRequest = aficionStore.getAll();
            
            aficionRequest.onsuccess = function(e){
                let todasAficiones = e.target.result;
                
                //Ahora conseguir las aficiones añadidas por el usuario
                let usuAfiTransaction = db.transaction(['usuAfi'],'readonly');
                let usuAfiStore = usuAfiTransaction.objectStore('usuAfi');
                let usuAfiRequest = usuAfiStore.getAll();
                usuAfiRequest.onsuccess = function(e) {
                    let aficionesUsu = e.target.result
                            .filter(usuAfi => usuAfi.emailUsuario === loggedInUser.email)
                            .map(usuAfi => usuAfi.idAficion);
                    
                    //Filtrar solo las aficiones no añadidas por el usuario
                    let aficionesDisponibles = todasAficiones.filter(
                            aficion => !aficionesUsu.includes(aficion.id)
                            );
                    
                    if(aficionesDisponibles.length === 0) {
                        aficionesContainer.innerHTML = '<p>No hay aficiones disponibles</p>';
                    } else {
                        aficionesDisponibles.forEach(aficion => {
                            let checkbox = document.createElement('div');
                            checkbox.innerHTML = `
                               <label>
                                    <input type="checkbox" value="${aficion.id}"> ${aficion.nombre}
                               </label>
                            `;
                            aficionesContainer.appendChild(checkbox);
                        });
                    }
                };
            };
        };
    }
    
    //añadir las aficiones
    btnAdd.addEventListener('click', function(){
        let checkboxes = aficionesContainer.querySelectorAll('input[type="checkbox"]:checked');
        if(checkboxes.lenght === 0){
            alert('Seleccione al menos una aficion para añadir, por favor');
            return;
        }
        
        let request = indexedDB.open('vitomaite10', 1);
        
        
        request.onsuccess = function(e){
            let db = e.target.result;
            let transaction = db.transaction(['usuAfi'],'readwrite');
            let usuAfiStore = transaction.objectStore('usuAfi');
            
            checkboxes.forEach(checkbox => {
                let idAficion = parseInt(checkbox.value, 10);
                let nuevaAficion = {
                    emailUsuario: loggedInUser.email,
                    idAficion: idAficion
                };
                
                usuAfiStore.add(nuevaAficion).onsuccess = function(){
                    console.log(`Aficion con ID ${idAficion} añadida.`);
                };
            });
            
            transaction.oncomplete = function (){
                alert('Aficiones añadidas correctamente.');
                window.location.href = 'pantallaLogueado.html';
            };
        };
    });
     cargarAficionesDisponibles();
});