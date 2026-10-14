export function getPokemonList() {
    return fetch('https://pokeapi.co/api/v2/pokemon?limit=2000')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar la lista de Pokémon');
            }
            return response.json()
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
        });
}
