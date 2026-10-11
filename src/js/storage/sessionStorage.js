export function saveUserToSessionStorage(user) {
    const userJSON = JSON.stringify(user);
    sessionStorage.setItem('user', userJSON);
}


export function getUserFromSessionStorage() {
    const userJSON = sessionStorage.getItem('user');
    return userJSON ? JSON.parse(userJSON) : null;
}
