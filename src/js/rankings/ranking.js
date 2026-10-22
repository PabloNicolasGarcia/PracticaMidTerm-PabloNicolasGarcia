export function sortGameResults(results){
    if (!Array.isArray(results)) {
        throw new TypeError('No es un array valido.')
    }

    const sortedResults = [...results];
    sortedResults.sort((a, b) => {
        if (a.numCards === b.numCards) {
            return a.elapsedMilliseconds - b.elapsedMilliseconds;
        }
        return b.numCards - a.numCards;
    });

    return sortedResults;

}