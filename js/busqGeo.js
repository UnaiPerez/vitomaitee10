// Archivo: geolocalizacion.js

document.addEventListener("DOMContentLoaded", function () {
    const radiusInput = document.getElementById("radius");
    const radiusValue = document.getElementById("radius-value");
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser")); // Usuario logueado
    const allUsers = []; // Aquí se cargarán los usuarios desde IndexedDB

    let map;
    let userLocationMarker;
    let userMarkers = [];

    // Inicializa el mapa
    function initMap(lat, lng) {
        // Crear el mapa centrado en la ubicación del usuario
        map = new google.maps.Map(document.getElementById("map"), {
            center: { lat, lng },
            zoom: 14,
        });

        // Marcador para la ubicación del usuario logueado
        userLocationMarker = new google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: "Tu ubicación",
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Marcador azul
        });
    }

    // Calcular distancia entre dos coordenadas (Haversine Formula)
    function calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Radio de la Tierra en km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLng = ((lng2 - lng1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distancia en km
    }

    // Filtrar usuarios por radio
    function filterUsersByRadius(lat, lng, radius) {
        return allUsers.filter((user) => {
            const distance = calculateDistance(lat, lng, user.latitud, user.longitud);
            return distance <= radius;
        });
    }

    // Mostrar marcadores para usuarios filtrados
    function showFilteredUsers(lat, lng, radius) {
        // Limpiar los marcadores existentes
        userMarkers.forEach((marker) => marker.setMap(null));
        userMarkers = [];

        const filteredUsers = filterUsersByRadius(lat, lng, radius);

        filteredUsers.forEach((user) => {
            const marker = new google.maps.Marker({
                position: { lat: user.latitud, lng: user.longitud },
                map: map,
                title: `${user.nombre}, ${user.edad} años`,
            });

            // Mostrar un infowindow al hacer clic en el marcador
            const infoWindow = new google.maps.InfoWindow({
                content: `<strong>${user.nombre}</strong><br>Edad: ${user.edad}`,
            });

            marker.addListener("click", () => {
                infoWindow.open(map, marker);
            });

            userMarkers.push(marker);
        });
    }

    // Obtener ubicación del usuario logueado
    function getLoggedInUserLocation() {
        if (!loggedInUser) {
            alert("No estás logueado.");
            window.location.href = "login.html";
            return;
        }

        const { latitud, longitud } = loggedInUser;

        // Inicializa el mapa en la ubicación del usuario logueado
        initMap(latitud, longitud);

        // Mostrar usuarios cercanos en el radio inicial
        showFilteredUsers(latitud, longitud, parseFloat(radiusInput.value));
    }

    // Cargar usuarios desde IndexedDB
    function loadUsersFromDB() {
        const request = indexedDB.open("vitomaite10", 1);

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction(["usuario"], "readonly");
            const userStore = transaction.objectStore("usuario");

            const getAllUsersRequest = userStore.getAll();

            getAllUsersRequest.onsuccess = function (event) {
                const users = event.target.result;

                // Excluir al usuario logueado
                allUsers.push(...users.filter((user) => user.email !== loggedInUser.email));

                // Obtener ubicación del usuario logueado
                getLoggedInUserLocation();
            };

            getAllUsersRequest.onerror = function () {
                console.error("Error al cargar los usuarios.");
            };
        };

        request.onerror = function () {
            console.error("Error al abrir la base de datos.");
        };
    }

    // Actualizar el radio dinámicamente
    radiusInput.addEventListener("input", function () {
        const radius = parseFloat(radiusInput.value);
        radiusValue.textContent = `${radius} km`;

        if (loggedInUser) {
            const { latitud, longitud } = loggedInUser;
            showFilteredUsers(latitud, longitud, radius);
        }
    });

    // Cargar usuarios desde IndexedDB al cargar la página
    loadUsersFromDB();
});
