import {clearUserFromSessionStorage} from '../storage/sessionStorage.js';
import {renderProfile} from './profileUi.js';

export function renderGame(app, user) {
    app.innerHTML = `
        <h1>Bienvenido al juego</h1>
        <p>¡Disfruta jugando!</p>
        <p>Usuario: ${user.userName}</p>
        <p>Pokémon favorito: ${user.pokemonFavorite.name}</p>
        <img src="${user.pokemonFavorite.img}" alt="${user.pokemonFavorite.name}">
        <p>Id del Pokémon favorito: ${user.pokemonFavorite.id}</p>
        <button id="logoutButton">Cerrar sesión</button>
    `;

    

    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', () => {
        clearUserFromSessionStorage();
        renderProfile(app);
    });

console.log('Usuario en renderGame:', user);
}