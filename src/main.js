import './style.css'
import {renderProfile} from './js/ui/profileUi.js';
import {getUserFromSessionStorage} from './js/storage/sessionStorage.js';

const storedUser = getUserFromSessionStorage();
const app = document.getElementById('app');

if (storedUser) {
    console.log('Entrando en el juego con el usuario:', storedUser);
} else {
    renderProfile(app);
}