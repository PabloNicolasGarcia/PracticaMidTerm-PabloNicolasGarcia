import {clearUserFromSessionStorage} from '../storage/sessionStorage.js';
import {renderProfile} from './profileUi.js';
import {numCartasValidation} from '../validations/gameValidations.js';

export function renderGame(app, user) {
    app.innerHTML = `
        <h1>Bienvenido al juego</h1>
        <p>¡Disfruta jugando!</p>
        <p>Usuario: ${user.userName}</p>
        <p>Pokémon favorito: ${user.pokemonFavorite.name}</p>
        <img src="${user.pokemonFavorite.img}" alt="${user.pokemonFavorite.name}">
        <p>Id del Pokémon favorito: ${user.pokemonFavorite.id}</p>
        <button id="logoutButton">Cerrar sesión</button>
        <label for="numCartas">Número de cartas:</label>
        <input type="number" id="numCartas" name="numCartas">
        <p id="numCartasError" style="color: red;"></p>
        <button id="startGameButton">Iniciar Juego</button>
    `;

    const startGameButton = document.getElementById('startGameButton');
    startGameButton.addEventListener('click', () => {
        const numCartasInput = document.getElementById('numCartas');
        const numCartasError = document.getElementById('numCartasError');
        const numCartas = Number(numCartasInput.value);

        if (!numCartasValidation(numCartas)) {
            numCartasError.textContent = 'El numero de cartas debe de ser positivo, entero y par';
            return;
        } else {
            numCartasError.textContent = '';
        }

    });

    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', () => {
        clearUserFromSessionStorage();
        renderProfile(app);
    });

console.log('Usuario en renderGame:', user);
}