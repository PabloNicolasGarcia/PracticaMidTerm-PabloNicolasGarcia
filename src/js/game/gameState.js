export function createGameState(cards) {
    if ((!Array.isArray(cards)) || cards.length === 0 || cards.length%2 !== 0) {
        throw new Error('Debe de ser un array no vacio y par.')
    }

    const selectedCards = [];
    const totalPairs = cards.length / 2;
    const matchedCardIds = [];
    let gameFinished = false;
    let matchedPairs = 0;

    function selectedCard(card) {
        if (selectedCards.length >= 2 || gameFinished || matchedCardIds.includes(card.id) || selectedCards.some(selectedCard => selectedCard.id === card.id)){
                return
        };
        
        selectedCards.push(card)

        if (selectedCards.length === 1) {
            return { type: 'first' };
        }

        if (selectedCards.length === 2) {
            if (selectedCards[0].pokemon.id === selectedCards[1].pokemon.id) {
                matchedCardIds.push(selectedCards[0].id, selectedCards[1].id);
                matchedPairs++;
                selectedCards.splice(0,2)
                if (matchedPairs === totalPairs) {
                    gameFinished = true;
                }
                return { type: 'match', gameFinished };
            }
            return { type: 'mismatch', cards: [...selectedCards] };
        }
    }

    function clearSelectedCards() {
        selectedCards.splice(0,2)
    }

    return { selectedCard, clearSelectedCards };
}