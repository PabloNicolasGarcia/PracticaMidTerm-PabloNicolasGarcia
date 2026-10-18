import { getPokemonList } from "../api/pokeApi.js";
import { getPokemonData } from "../api/pokeApi.js";
import { Card } from "../models/card.js";
import { Pokemon } from "../models/pokemon.js";

export function numPokemonsRequired(numCartas) {
    const numPokemons = numCartas / 2;
    return numPokemons;
}

export async function prepareGame(numCartas) {
    const numPokemons = numPokemonsRequired(numCartas);
    
    const data = await getPokemonList();
    const pokemonList = [...data.results];
    
    if (numPokemons > pokemonList.length) {
        throw new Error(
            `Solo se pueden crear ${pokemonList.length * 2} cartas con los Pokémon disponibles`
        );
    }

    let finalPokemons = [];
    
    for (let i = 0; i < numPokemons; i++) {
        const randomIndex = Math.floor(Math.random() * pokemonList.length)
        const selectedPokemon = pokemonList[randomIndex]
        pokemonList.splice(randomIndex, 1);
        finalPokemons.push(selectedPokemon);
    }

    const pokemonPromises = finalPokemons.map(element => {
        return getPokemonData(element.name)
    });

    const pokemons = await Promise.all(pokemonPromises);
    const cards = [];
    pokemons.forEach(pokemon => {
        const pokemonModel = new Pokemon(pokemon.name, pokemon.id, pokemon.sprites.front_default);
        cards.push(new Card(cards.length, pokemonModel));
        cards.push(new Card(cards.length, pokemonModel));
    });

    return shuffleCards(cards);
    
}

export function shuffleCards(cards) {
        for (let i = cards.length -1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1))
        const temporaryCard = cards[i];
        cards[i] = cards[randomIndex];
        cards[randomIndex] = temporaryCard;
    }
    return cards;
}