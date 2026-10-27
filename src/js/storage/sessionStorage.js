import { validateUsername } from '../validations/profileValidation.js';

export function saveUserToSessionStorage(user) {
    const userJSON = JSON.stringify(user);
    sessionStorage.setItem('user', userJSON);
}

export function getUserFromSessionStorage() {
    try{
        const userJSON = sessionStorage.getItem('user');
        if (userJSON === null) {
            return null;
        }
        const user = JSON.parse(userJSON);
        if (user === null || typeof user !== 'object' || Array.isArray(user)) {
            return null;
        }
        if (typeof user.userName !== 'string') {
            return null;
        }
        if (!validateUsername(user.userName)) {
            return null;
        }

        const pokemon = user.pokemonFavorite;
        if (pokemon === null || typeof pokemon !== 'object' || Array.isArray(pokemon)) {
            return null;
        }
        if (!Number.isInteger(pokemon.id) || pokemon.id <= 0) {
            return null;
        }
        if (typeof pokemon.name !== 'string' || pokemon.name.trim() === '') {
            return null;
        }
        if (typeof pokemon.img !== 'string' || pokemon.img.trim() === '') {
            return null;
        }

        return user;
        
    } catch {
        return null;
    }
}

export function clearUserFromSessionStorage() {
    sessionStorage.removeItem('user');
}