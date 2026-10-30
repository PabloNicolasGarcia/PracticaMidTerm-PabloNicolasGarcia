export function getGameHistory() {
    const history = localStorage.getItem('gameHistory')
    if (history === null) {
        return [];
    }
    // Los errores se propagan a la interfaz para no sustituir un historial
    // dañado por un array vacío y sobrescribir los datos anteriores.
    const parsedHistory = JSON.parse(history);

    if (!Array.isArray(parsedHistory)) {
        throw new TypeError("parsedHistory no es un array válido.");
    };
    
    return parsedHistory;
}

export function saveGameResult(gameResult) {
    const history = getGameHistory()
    // El identificador evita guardar dos veces el mismo resultado.
    if (history.some(result => result.id === gameResult.id)) {
        return;
    }

    history.push(gameResult);
    localStorage.setItem('gameHistory', JSON.stringify(history));
}