export function sortGameResults(results){
    if (!Array.isArray(results)) {
        throw new TypeError('No es un array valido.')
    }
    // Ordenamos una copia para conservar el orden del array recibido.
    // Primero se priorizan más cartas y, en caso de empate, menos tiempo.
    const sortedResults = [...results];
    sortedResults.sort((a, b) => {
        if (a.numCards === b.numCards) {
            return a.elapsedMilliseconds - b.elapsedMilliseconds;
        }
        return b.numCards - a.numCards;
    });

    return sortedResults;

}