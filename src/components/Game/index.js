import Lander from 'components/Lander';
import Stars from 'components/Stars';
import MountainRange from 'components/MountainRange';
import LandingPlatform from 'components/LandingPlatform';
import GameInformation from 'components/GameInformation';

function Game(global, canvases) {
  this.window = global;
  this.winMessage = this.window.document.getElementById('win');
  this.looseMessage = this.window.document.getElementById('loose');

  this.createCanvases(canvases);
  this.createEventListeners();
  this.createKeyCommands();

  this.setSize();

  this.animate = this.animate.bind(this);
}

Game.prototype.start = function() {
  this.winMessage.style.display = 'none';
  this.looseMessage.style.display = 'none';
  this.gameStopped = false;
  this.animationStopped = false;

  this.createGameObjects();
  this.drawBackground();

  this.animation && this.window.cancelAnimationFrame(this.animation);
  this.animate();
};

Game.prototype.createCanvases = function(canvases) {
  this.canvases = Object.keys(canvases).reduce((acc, key) => {
    const canvas = this.window.document.getElementById(canvases[key]);
    const context = canvas.getContext('2d');
    acc[key] = { canvas, context };
    return acc;
  }, {});
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
  const width = this.width;
  const height = this.height;

  this.mountainRange = new MountainRange({
    width,
    height,
    scale: 0.6,
    smoothness: 0.003,
    seed: 59.17262745556566,
  });
  this.landingPlatforms = new LandingPlatform(this.mountainRange.points);
  this.makeCollisionLandscape();
  this.stars = new Stars(0.2, width, height);
  this.lander = new Lander(
    50,
    50,
    this.collisionLandscape,
    this.mountainRange,
    this.landingPlatforms
  );
  this.gameInformation = new GameInformation(this.window);
};

Game.prototype.setSize = function() {
  this.width = this.window.innerWidth;
  this.height = this.window.innerHeight;

  Object.keys(this.canvases).forEach(key => {
    this.canvases[key].canvas.width = this.width;
    this.canvases[key].canvas.height = this.height;
  });
};

Game.prototype.makeCollisionLandscape = function() {
  this.collisionLandscape = {
    collisionPoints: Object.assign(
      {},
      this.mountainRange.collisionPoints,
      this.landingPlatforms.collisionPoints
    ),
  };
};

Game.prototype.update = function() {
  this.lander.update(this.isUpPressed, this.isRightPressed, this.isLeftPressed);

  // prettier-ignore
  !this.gameStopped && this.gameInformation.update(this.lander, this.collisionLandscape);

  if (this.lander.isCrashed || this.lander.isLanded) this.gameStopped = true;
  if (this.lander.isLanded || (this.lander.isCrashed && !this.lander.exploding)) {
    this.animationStopped = true;
  }
  this.lander.isCrashed && this.loose();
  this.lander.isLanded && this.win();
};

Game.prototype.drawBackground = function() {
  this.stars.draw(this.canvases.stars.context);
  this.landingPlatforms.draw(this.canvases.platforms.context);
  this.mountainRange.draw(this.canvases.mountains.context);
};

Game.prototype.draw = function() {
  this.canvases.lander.context.clearRect(0, 0, this.width, this.height);
  this.lander.draw(this.canvases.lander.context);
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
  this.setSize();
  this.stars.setSize(this.width, this.height);
  this.mountainRange.setSize(this.width, this.height);
  this.landingPlatforms.setSize(this.width, this.height);
  this.drawBackground();
  this.draw();
};

export default Game;
