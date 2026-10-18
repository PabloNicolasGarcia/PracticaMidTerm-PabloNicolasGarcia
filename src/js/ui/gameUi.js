import {clearUserFromSessionStorage} from '../storage/sessionStorage.js';
import {renderProfile} from './profileUi.js';
import {numCartasValidation} from '../validations/gameValidations.js';
import { renderBoard } from './boardUi.js';
import { prepareGame, shuffleCards } from '../game/gameSetup.js';
import { GameResult } from '../models/gameResult.js';
import { saveGameResult } from '../storage/gameHistoryStorage.js';

export function renderGame(app, user) {
    app.innerHTML = `
        <header>
            <h1>Bienvenido al juego</h1>
            <p>¡Disfruta jugando!</p>
            <p>Usuario: ${user.userName}</p>
            <p>Pokémon favorito: ${user.pokemonFavorite.name}</p>
            <img src="${user.pokemonFavorite.img}" alt="${user.pokemonFavorite.name}">
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
            <p id="sinListaRanking"> Todavía no hay resultados </p>
        </aside>
    `;
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

            console.log(cards);
            cleanupBoard = renderBoard(startingGame, cards, restartGame, finishGame);
        } catch (error) {
            gameError.textContent = error.message;
        } finally {
            startGameButton.disabled = false;
            startGameButton.textContent = 'Iniciar Juego';
        }

    });

    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', () => {
        if (typeof cleanupBoard === 'function') {
            cleanupBoard();
        }
        clearUserFromSessionStorage();
        renderProfile(app);
    });

    function restartGame(cards) {
        gameError.textContent = '';
        try{
            shuffleCards(cards);
            cleanupBoard = renderBoard(startingGame, cards, restartGame, finishGame);
        } catch (error) {
            gameError.textContent = error.message;
        }
    }

    function finishGame(elapsedMilliseconds, numCards) {
        try {
            const id = crypto.randomUUID()
            const gameResult = new GameResult(id, user.userName, user.pokemonFavorite, elapsedMilliseconds, numCards);
            saveGameResult(gameResult);
            console.log(gameResult);
        } catch {
            gameError.textContent = 'No se puedo guardar el registro de la partida correctamente'
        }
        
    }

    console.log('Usuario en renderGame:', user);
}