export function validateUsername(username) {
    const trimmedUsername = username.trim();
    return trimmedUsername.length >= 3 && trimmedUsername.length <= 15;
}