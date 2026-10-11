export function numCartasValidation(numCartas) {
    return Number.isInteger(numCartas) && numCartas > 0 && numCartas % 2 === 0;
}