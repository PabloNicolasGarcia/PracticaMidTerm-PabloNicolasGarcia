import './style.css'
import {renderProfile} from './js/ui/profileUi.js';
import {renderGame} from './js/ui/gameUi.js';
import {getUserFromSessionStorage} from './js/storage/sessionStorage.js';

const storedUser = getUserFromSessionStorage();
const app = document.getElementById('app');

if (storedUser) {
    renderGame(app, storedUser);
} else {
    renderProfile(app);
}