export function getPokemonList() {
    return fetch('https://pokeapi.co/api/v2/pokemon?limit=2000')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar la lista de Pokémon');
            }
            return response.json()
        })
        .then(data => {
            if (data === null || typeof data !== 'object' || !Array.isArray(data.results)) {
                throw new Error('La lista de Pokémon no es válida');
            }
            if (!data.results.every(pokemon => pokemon !== null && typeof pokemon === 'object' &&
                typeof pokemon.name === 'string' && pokemon.name.trim() !== ''
            )) {
                throw new Error('La lista contiene Pokémon con datos no válidos');
            }

            return data;
        });
}

export function getPokemonData(namePokemon) {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${namePokemon}`)
        .then(response => {
            if (response.status === 404) {
                throw new Error('Pokémon no encontrado');
            }

            if (!response.ok) {
                throw new Error('No se pudieron cargar los datos del Pokémon');
            }
            return response.json();
        })
        .then(data => {
            if (data === null || typeof data !== 'object' || Array.isArray(data)) {
                throw new Error('Los datos del Pokémon no son válidos');
            }
            if (!Number.isInteger(data.id) || data.id <= 0) {
                throw new Error('El ID del Pokémon no es válido');
            }
            if (typeof data.name !== 'string' || data.name.trim() === '') {
                throw new Error('El nombre del Pokémon no es válido');
            }
            if (data.sprites === null || typeof data.sprites !== 'object' || Array.isArray(data.sprites)) {
                throw new Error('Los datos de imágenes del Pokémon no son válidos');
            }
            if (typeof data.sprites.front_default !== 'string' || data.sprites.front_default.trim() === '') {
                throw new Error('Este Pokémon no tiene una imagen disponible');
            }

            return data;
        });
}
