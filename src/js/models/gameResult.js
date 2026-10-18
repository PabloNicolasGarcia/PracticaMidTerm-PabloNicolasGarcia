export class GameResult {
    constructor (id, userName, pokemonFavorite, elapsedMilliseconds, numCards) {
        this.id = id;
        this.userName = userName;
        this.pokemonFavorite = pokemonFavorite;
        this.elapsedMilliseconds = elapsedMilliseconds;
        this.numCards = numCards;
    }
}