import Lander from 'components/Lander';
import Stars from 'components/Stars';
import MountainRange from 'components/MountainRange';
import LandingPlatform from 'components/LandingPlatform';
import GameInformation from 'components/GameInformation';
import GameCanvas from 'components/GameCanvas';

function Game(global) {
  this.window = global;
  this.width = this.window.innerWidth;
  this.height = this.window.innerHeight;
  this.winMessage = this.window.document.getElementById('win');
  this.looseMessage = this.window.document.getElementById('loose');

  this.createEventListeners();
  this.createKeyCommands();
  this.createGameObjects();

  this.animate = this.animate.bind(this);
}

Game.prototype.start = function() {
  this.winMessage.style.display = 'none';
  this.looseMessage.style.display = 'none';

  this.gameStopped = false;
  this.animationStopped = false;

  this.draw();
  this.gameCanvas.setDoDraw(['stars', 'mountains','platforms'], false);

  this.animation && this.window.cancelAnimationFrame(this.animation);
  this.animate();
};

Game.prototype.createEventListeners = function() {
  this.window.addEventListener('resize', this.onResize.bind(this), false);
  this.window.addEventListener('keydown', this.onKeyDown.bind(this), false);
  this.window.addEventListener('keyup', this.onKeyUp.bind(this), false);
};

Game.prototype.createKeyCommands = function() {
  this.isUpPressed = false;
  this.isLeftPressed = false;
  this.isRightPressed = false;

  this.onKeyDownCommands = {
    ArrowUp: () => (this.isUpPressed = true),
    ArrowLeft: () => {
      this.isRightPressed = false;
      this.isLeftPressed = true;
    },
    ArrowRight: () => {
      this.isLeftPressed = false;
      this.isRightPressed = true;
    },
    ' ': () => this.gameStopped && this.start(),
  };

  this.onKeyUpCommands = {
    ArrowUp: () => (this.isUpPressed = false),
    ArrowLeft: () => (this.isLeftPressed = false),
    ArrowRight: () => (this.isRightPressed = false),
  };
};

Game.prototype.createGameObjects = function() {
  const stars = new Stars(0.2, this.width, this.height);
  const mountains = new MountainRange({
    width: this.width,
    height: this.height,
    scale: 0.6,
    smoothness: 0.003,
    seed: 59.17262745556566,
  });
  const platforms = new LandingPlatform(mountains.points);
  this.collisionPoints = Object.assign({}, mountains.collisionPoints, platforms.collisionPoints);
  const lander = new Lander(
    this.width,
    this.height,
    50,
    50,
    this.collisionPoints,
    mountains.collisionPoints,
    platforms.collisionPoints
  );
  this.gameObjects = {
    stars,
    platforms,
    mountains,
    lander,
  };
  this.gameCanvas = new GameCanvas(this.window, this.gameObjects);
  this.gameInformation = new GameInformation(this.window);
};

Game.prototype.update = function() {
  this.gameObjects.lander.update(this.isUpPressed, this.isRightPressed, this.isLeftPressed);

  // prettier-ignore
  !this.gameStopped && this.gameInformation.update(this.gameObjects.lander, this.collisionPoints);

  if (this.gameObjects.lander.isCrashed || this.gameObjects.lander.isLanded) this.gameStopped = true;
  // prettier-ignore
  if (this.gameObjects.lander.isLanded || (this.gameObjects.lander.isCrashed && !this.gameObjects.lander.exploding)) {
    this.animationStopped = true;
  }
  this.gameObjects.lander.isCrashed && this.loose();
  this.gameObjects.lander.isLanded && this.win();
};

Game.prototype.draw = function() {
  this.gameCanvas.draw();
  this.gameInformation.draw();
};

Game.prototype.win = function() {
  this.winMessage.style.display = 'block';
};

Game.prototype.loose = function() {
  this.looseMessage.style.display = 'block';
};

Game.prototype.animate = function() {
  this.draw();
  this.update();
  if (!this.animationStopped) {
    this.animation = this.window.requestAnimationFrame(this.animate);
  }
};

Game.prototype.onKeyDown = function(e) {
  const keyCommands = this.onKeyDownCommands;
  if (e.key in keyCommands) keyCommands[e.key]();
};

Game.prototype.onKeyUp = function(e) {
  const keyCommands = this.onKeyUpCommands;
  if (e.key in keyCommands) keyCommands[e.key]();
};

Game.prototype.onResize = function() {
  this.gameCanvas.setSize();
  this.draw();
};

export default Game;
