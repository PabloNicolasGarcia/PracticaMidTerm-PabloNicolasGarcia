import {validateUsername} from '../validations/profileValidation.js';
import {getPokemon, getPokemonList, getPokemonData} from '../api/pokeApi.js';

export function renderProfile(app) {
    app.innerHTML = `
    <h1 id="profile-title">Crear perfil</h1>
    <form id="profile-form">
    <label for="username">Nombre:</label>
    <input type="text" id="username" name="username" required>
    <p id="usernameError" style="color: red;"></p>
    <label for="pokemonFav">Pokemon Favorito:</label>
    <input type="text" id="pokemonFav" name="pokemonFav" required>
    <div id="pokemonFavSuggestions"></div>
    <div id="pokemonSelected"></div>
    <p id="pokemonFavError" style="color: red;"></p>
    <button type="submit">Crear Perfil</button>
    </form>
    `;

    const form = document.getElementById('profile-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const usernameError = document.getElementById('usernameError');
        const pokemonFav = document.getElementById('pokemonFav').value;
        const pokemonFavError = document.getElementById('pokemonFavError');

        if (!validateUsername(username)) {
            usernameError.textContent = 'El nombre de usuario debe tener entre 3 y 15 caracteres.';
        } else {
            usernameError.textContent = '';
        }

        getPokemon(pokemonFav)
        .then(exists => {
            if (!exists) {
                pokemonFavError.textContent = 'El Pokémon ingresado no existe.';
            } else {
                pokemonFavError.textContent = '';
            }
        })
        .catch(error => {
            console.error('Error al verificar el Pokémon:', error);
            pokemonFavError.textContent = 'Ocurrió un error al verificar el Pokémon.';
        });

    });

    const pokemonFavInput = document.getElementById('pokemonFav');
    const pokemonFavSuggestions = document.getElementById('pokemonFavSuggestions');

    let pokemonList = [];
    getPokemonList()
        .then(data => {
            pokemonList = data.results;
        });

    pokemonFavInput.addEventListener('input', () => {
        if (pokemonList.length === 0) {
            return;
        }
        if (pokemonFavInput.value.trim() === '') {
            pokemonFavSuggestions.innerHTML = '';
            return;
        }

        const coincidencias = pokemonList.filter(pokemon =>
        pokemon.name.includes(pokemonFavInput.value.trim().toLowerCase())
        );
        pokemonFavSuggestions.innerHTML = coincidencias.slice(0, 5).map(pokemon => 
            `<div>${pokemon.name}</div>`).join('');


    });

   const pokemonSelected = document.getElementById('pokemonSelected');

    pokemonFavSuggestions.addEventListener('click', (event) => {
        if (event.target.tagName === 'DIV') {
            pokemonFavInput.value = event.target.textContent;
            pokemonFavSuggestions.innerHTML = '';

            getPokemonData(pokemonFavInput.value.trim().toLowerCase())
        .then(data => {
            if (data) {
                pokemonSelected.innerHTML = `
                <img src="${data.sprites.front_default}" alt="${data.name}">
                <p>${data.name}</p>
                `;
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos del Pokémon:', error);
        });

        }

    })
}
