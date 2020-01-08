import './assets/css/common.css';
import Game from './components/Game';

(global => {
  const game = new Game('canvas');

  global.addEventListener('resize', game.resize, false);

})(window);
