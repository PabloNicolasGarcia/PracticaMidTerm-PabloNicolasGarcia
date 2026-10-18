export function getGameHistory() {
    const history = localStorage.getItem('gameHistory')
    if (history === null) {
        return [];
    }
    
    const parsedHistory = JSON.parse(history);

    if (!Array.isArray(parsedHistory)) {
        throw new TypeError("parsedHistory no es un array válido.");
    };
    
    return parsedHistory;
}

export function saveGameResult(gameResult) {
    const history = getGameHistory()

    if (history.some(result => result.id === gameResult.id)) {
        return;
    }

    history.push(gameResult);
    localStorage.setItem('gameHistory', JSON.stringify(history));
}