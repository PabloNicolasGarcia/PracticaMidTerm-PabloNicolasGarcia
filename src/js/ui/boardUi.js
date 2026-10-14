

export function renderBoard(container) {
    container.innerHTML = `
        <div id = 'timer'>0m 0s</div>
        <div id = 'board'></div>
        <button id = 'restartGame'>Reiniciar partida</button>
    `;
}