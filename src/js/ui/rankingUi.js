export function renderRanking(container, results, idLastGame) {
    if (!Array.isArray(results)) {
        throw new TypeError('No es un array valido para listar');
    } else if (results.length === 0) {
        container.textContent = 'Todavia no hay resultados';
        return;
    }

    container.innerHTML = `
        <table id="tableRanking">
            <thead>
                <tr>
                    <th>Posición</th>
                    <th>Jugador</th>
                    <th>Pokémon</th>
                    <th>Tiempo</th>
                    <th>Cartas</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
        <p id="omittedResults"></p>
    `;

    const tableBody = container.querySelector('tbody');
    let visibleResults = 0;

    results.forEach((result, index) => {
        // Mostramos las cinco primeras posiciones y el último resultado,
        // aunque este quede fuera del grupo inicial.
        if (index < 5 || result.id === idLastGame) {
            const row = document.createElement('tr');
            const tdPosition = document.createElement('td');
            const tdPlayer = document.createElement('td');
            const tdPokemon = document.createElement('td');
            const tdElapsedMilliseconds = document.createElement('td');
            const tdNumCards = document.createElement('td');

            const minutes = Math.floor((result.elapsedMilliseconds / 1000) / 60);
            const seconds = Math.floor((result.elapsedMilliseconds / 1000) % 60);
            const time = `${minutes}m ${seconds}s`
            // La posición corresponde al ranking completo, no solo a las filas visibles.
            tdPosition.textContent = index + 1;
            tdPlayer.textContent = result.userName;
            tdPokemon.textContent = result.pokemonFavorite.name;
            tdElapsedMilliseconds.textContent = time;
            tdNumCards.textContent = result.numCards;
            row.appendChild(tdPosition);
            row.appendChild(tdPlayer);
            row.appendChild(tdPokemon);
            row.appendChild(tdElapsedMilliseconds);
            row.appendChild(tdNumCards);
            tableBody.appendChild(row);
            visibleResults++

            if (result.id === idLastGame) {
                row.classList.add('latest-result')
            }
        }
    });
    const omittedResultsHtml = document.getElementById('omittedResults');
    const omittedResults = results.length - visibleResults;
    if (omittedResults > 0) {
        omittedResultsHtml.textContent = `Hay un total de ${omittedResults} omitidos`
    }

}