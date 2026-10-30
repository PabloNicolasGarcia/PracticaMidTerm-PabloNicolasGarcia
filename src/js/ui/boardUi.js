import cardBackUrl from '../../assets/card-back.jpg';
import { createGameTimer } from '../game/gameTimer.js';
import { createGameState } from '../game/gameState.js';

export function renderBoard(container, cards, onRestart, onFinish, onEndGame) {
    if (typeof onRestart !== 'function') {
        throw new Error('No se recibió una función válida para reiniciar')
    }

    if (typeof onFinish !== 'function') {
        throw new Error('No se recibió una función válida para finalizar partida completada')
    }

    if (typeof onEndGame !== 'function') {
        throw new Error('No se recibió una función válida para finalizar partida sin completar')
    }

    if (!Array.isArray(cards) || cards.length === 0) {
        throw new Error('No hay cartas disponibles para mostrar');
    }
    container.innerHTML = `
        <div class="board-toolbar">
            <div id = "timer">0m 0s</div>
            <button id="endGame">Finalizar partida</button>
            <button id = "restartGame">Reiniciar partida</button>
        </div>
        <p id="gameStatus"></p>
        <div id = "board"></div>
    `;

    const timer = container.querySelector('#timer');
    const gameStatus = container.querySelector('#gameStatus');


    function updateTimer(elapsedMilliseconds) {
        const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000) % 60;
        const elapsedMinute = Math.floor((elapsedMilliseconds / 1000) / 60);
        timer.textContent = `${elapsedMinute}m ${elapsedSeconds}s`;
    };
    const gameTimer = createGameTimer(updateTimer);
    const gameState = createGameState(cards);
    const board = container.querySelector('#board');
    let gameFinished = false;
    let hideCardsTimeout = null;
    // Detiene el reloj, cancela la ocultación pendiente y bloquea el tablero anterior.
    function cleanupGame() {
        gameTimer.stop();
        clearTimeout(hideCardsTimeout);
        hideCardsTimeout = null;
        gameFinished = true;
    }


    cards.forEach(card => {
        const cardButton = document.createElement('button');
        const cardImageBack = document.createElement('img');
        cardImageBack.src = cardBackUrl;
        cardImageBack.alt = "Reverso de la carta";
        cardButton.replaceChildren(cardImageBack);
        board.appendChild(cardButton);
        cardButton.dataset.cardId = card.id;
        const cardImage = document.createElement('img');
        // Si falla la descarga, recordamos el error sin revelar una carta oculta.
        // El nombre sustituye a la imagen únicamente cuando la carta está descubierta.
        let imageFailed = false;
        cardImage.addEventListener('error', () => {
            imageFailed = true;
            if (cardImage.parentNode === cardButton) {
                cardButton.textContent = card.pokemon.name;
            }
        });

        cardImage.src = card.pokemon.img;
        cardImage.alt = card.pokemon.name;
        cardButton.addEventListener('click', () => {
            if (gameFinished) {
                return
            };
            const result = gameState.selectedCard(card);
            if (!result) {
                return;
            }
            if (imageFailed) {
                cardButton.textContent = card.pokemon.name;
            } else {
                cardButton.replaceChildren(cardImage);
            }
            cardButton.disabled = true;
            if ((result.type !== 'first')) {
                if (result.type === 'match') {
                    // En este punto los botones desactivados son las parejas anteriores
                    // y las dos cartas que acaban de coincidir.
                    board.querySelectorAll('button:disabled').forEach(button => {
                        button.classList.add('matched');
                    });
                    if (result.gameFinished) {
                        // Fijamos el tiempo mostrado y bloqueamos el juego antes de comunicar
                        // la victoria, evitando que nuevas selecciones repitan el guardado.
                        const elapsedMilliseconds = gameTimer.getElapsedMilliseconds();
                        updateTimer(elapsedMilliseconds);
                        gameTimer.stop();
                        gameFinished = true;
                        gameStatus.textContent = 'Victoria!';
                        onFinish(elapsedMilliseconds, cards.length);
                    }
                } else {
                    const buttonCardOne = board.querySelector(`[data-card-id="${result.cards[0].id}"]`);
                    const buttonCardTwo = board.querySelector(`[data-card-id="${result.cards[1].id}"]`);

                    if (!buttonCardOne || !buttonCardTwo) {
                        return
                    };

                    hideCardsTimeout = setTimeout(() => {
                        buttonCardOne.disabled = false;
                        buttonCardTwo.disabled = false;
                        buttonCardOne.replaceChildren(cardImageBack.cloneNode(true));
                        buttonCardTwo.replaceChildren(cardImageBack.cloneNode(true));
                        gameState.clearSelectedCards();
                        hideCardsTimeout = null;
                    }, 1000);
                }
            }
        })
    });

    const restartGame = container.querySelector('#restartGame')
    restartGame.addEventListener('click', () => {
        cleanupGame();
        onRestart(cards);
    })

    const endGame = container.querySelector('#endGame')
    endGame.addEventListener('click', () => {
        cleanupGame();
        onEndGame();
    })
    // Permite que la pantalla principal libere también el tablero al cerrar sesión.
    return cleanupGame;
}