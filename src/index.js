import './assets/css/common.css';
import Game from './components/Game';

(function(global) {
  const game = new Game(global, 'canvas');
  game.run();
}(window));
