export function getPokemon(namePokemon) {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${namePokemon}`)
    .then(response => {
        return response.ok;
    });   
}

export function getPokemonList() {
    return fetch('https://pokeapi.co/api/v2/pokemon?limit=2000')
    .then(response => response.json())
}

export function getPokemonData(namePokemon) {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${namePokemon}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Pokémon no encontrado');
            }
            return response.json();
        });
}
