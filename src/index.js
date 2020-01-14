import './assets/css/common.css';
import Game from './components/Game';

(global => {
  const game = new Game(global, 'canvas');
  game.start();
})(window);
