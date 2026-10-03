import {validateUsername} from '../validations/profileValidation.js';

export function renderProfile(app) {
    app.innerHTML = `
    <h1 id="profile-title">Crear perfil</h1>
    <form id="profile-form">
    <label for="username">Nombre:</label>
    <input type="text" id="username" name="username" required>
    <p id="usernameError" style="color: red;"></p>
    <label for="pokemonFav">Pokemon Favorito:</label>
    <input type="text" id="pokemonFav" name="pokemonFav" required>
    <button type="submit">Crear Perfil</button>
    </form>
    `;

    const form = document.getElementById('profile-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const usernameError = document.getElementById('usernameError');

        if (!validateUsername(username)) {
            usernameError.textContent = 'El nombre de usuario debe tener entre 3 y 15 caracteres.';
        } else {
            usernameError.textContent = '';
        }

    });
}