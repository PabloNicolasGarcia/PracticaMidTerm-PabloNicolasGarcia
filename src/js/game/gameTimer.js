export function createGameTimer(onTick) {
    if (typeof onTick !== 'function') {
        throw new Error('No se ha recibido una función para onTick')
    }

    const startTime = Date.now();

    function getElapsedMilliseconds() {
        const elapsedMilliseconds = Date.now() - startTime;
        return elapsedMilliseconds
    }

    function tick() {
        const elapsedMilliseconds = getElapsedMilliseconds();
        onTick(elapsedMilliseconds);
    }

    const timerInterval = setInterval(tick, 1000);

    function stop() {
        clearInterval(timerInterval);
    }

    return { getElapsedMilliseconds, stop }
}