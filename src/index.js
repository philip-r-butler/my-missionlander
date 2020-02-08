import 'css/common.css';
import Game from 'components/Game';

(function(global) {
  const canvases = { lander: 'lander', mountains: 'mountains', platforms: 'platforms', stars: 'stars'};
  const game = new Game(global, canvases);
  game.start();
}(window));
