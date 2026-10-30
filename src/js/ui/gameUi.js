import { clearUserFromSessionStorage } from '../storage/sessionStorage.js';
import { renderProfile } from './profileUi.js';
import { numCartasValidation } from '../validations/gameValidations.js';
import { renderBoard } from './boardUi.js';
import { prepareGame, shuffleCards } from '../game/gameSetup.js';
import { GameResult } from '../models/gameResult.js';
import { saveGameResult, getGameHistory } from '../storage/gameHistoryStorage.js';
import { sortGameResults } from '../rankings/ranking.js';
import { renderRanking } from './rankingUi.js';

export function renderGame(app, user) {
    app.innerHTML = `
        <header>
            <h1>Bienvenido al juego</h1>
            <p>¡Disfruta jugando!</p>
            <p id="gameUsername"></p>
            <p>Pokémon favorito: ${user.pokemonFavorite.name}</p>
            <img id="favoritePokemonImage" src="${user.pokemonFavorite.img}" alt="${user.pokemonFavorite.name}">
            <p>Id del Pokémon favorito: ${user.pokemonFavorite.id}</p>
            <button id="logoutButton">Cerrar sesión</button>
        </header>
        <section id="startingGame">
            <label for="numCartas">Número de cartas:</label>
            <input type="number" id="numCartas" name="numCartas">
            <button id="startGameButton">Iniciar Juego</button>
        </section>
        <p id="gameError" style="color: red;"></p>
        <p id="numCartasError" style="color: red;"></p>
        <aside id="ranking">
            <h2>Ranking partidas</h2>
            <div id= "listaRanking"></div>
        </aside>
    `;

    app.querySelector('#gameUsername').textContent = `Usuario: ${user.userName}`;
    const favoriteImage = app.querySelector('#favoritePokemonImage');
    favoriteImage.addEventListener('error', () => {
        favoriteImage.remove();
    }, { once: true });

    const rankingContainer = document.getElementById('listaRanking');

    function updateRanking(idLastGame = null) {
        try {
            const gameHistory = getGameHistory();
            const sortedResults = sortGameResults(gameHistory);
            renderRanking(rankingContainer, sortedResults, idLastGame);
        } catch {
            rankingContainer.textContent = 'No se pudo cargar el Ranking';
        }
    }
    updateRanking();

    const startingGame = document.getElementById('startingGame')
    const gameError = document.getElementById('gameError')
    let cleanupBoard = null;
    const startGameButton = document.getElementById('startGameButton');

    startGameButton.addEventListener('click', async () => {
        const numCartasInput = document.getElementById('numCartas');
        const numCartasError = document.getElementById('numCartasError');
        const numCartas = Number(numCartasInput.value);
        gameError.textContent = '';

        if (!numCartasValidation(numCartas)) {
            numCartasError.textContent = 'El numero de cartas debe de ser positivo, entero y par';
            return;
        } else {
            numCartasError.textContent = '';
        }

        startGameButton.disabled = true;
        startGameButton.textContent = 'Cargando…';

        try {
            const cards = await prepareGame(numCartas);

            if (!startingGame.isConnected) {
                return;
            }
            cleanupBoard = renderBoard(startingGame, cards, restartGame, finishGame, endGame);
        } catch (error) {
            gameError.textContent = error.message;
        } finally {
            startGameButton.disabled = false;
            startGameButton.textContent = 'Iniciar Juego';
        }

    });

    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', () => {
        try {
            clearUserFromSessionStorage();
        } catch {
            gameError.textContent = 'No se pudo cerrar la sesión. Inténtalo de nuevo.';
            return;
        }
        if (typeof cleanupBoard === 'function') {
            cleanupBoard();
        }
        renderProfile(app);
    });

    function restartGame(cards) {
        gameError.textContent = '';
        try {
            shuffleCards(cards);
            cleanupBoard = renderBoard(startingGame, cards, restartGame, finishGame, endGame);
        } catch (error) {
            gameError.textContent = error.message;
        }
    }

    function finishGame(elapsedMilliseconds, numCards) {
        try {
            const id = crypto.randomUUID()
            const gameResult = new GameResult(id, user.userName, user.pokemonFavorite, elapsedMilliseconds, numCards);
            saveGameResult(gameResult);
            updateRanking(gameResult.id);
        } catch {
            gameError.textContent = 'No se puedo guardar el registro de la partida correctamente'
        }

    }

    function endGame() {
        renderGame(app, user);
    }
}