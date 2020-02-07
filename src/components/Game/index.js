import Background from 'components/Background';
import Lander from 'components/Lander';
import Stars from 'components/Stars';
import MountainRange from 'components/MountainRange';
import LandingPlatform from 'components/LandingPlatform';
import GameInformation from 'components/GameInformation';

function Game(global, canvasId) {
  this.window = global;
  this.canvas = this.window.document.getElementById(canvasId);
  this.context = this.canvas.getContext('2d');

  this.winMessage = this.window.document.getElementById('win');
  this.looseMessage = this.window.document.getElementById('loose');

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
  this.background = new Background(
    'black',
    this.canvas.width,
    this.canvas.height
  );
  this.mountainRange = new MountainRange({
    width: this.canvas.width,
    height: this.canvas.height,
    scale: 0.6,
    smoothness: 0.003,
    seed: 59.17262745556566,
  });
  this.landingPlatforms = new LandingPlatform(this.mountainRange.points);
  this.makeCollisionLandscape();
  this.stars = new Stars(0.04, this.canvas.width, this.canvas.height);
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
  const width = this.window.innerWidth;
  const height = this.window.innerHeight;

  this.canvas.width = width;
  this.canvas.height = height;
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
  if (this.lander.isLanded || this.lander.isCrashed && !this.lander.exploding) this.animationStopped = true;
  this.lander.isCrashed && this.loose();
  this.lander.isLanded && this.win();
};

Game.prototype.draw = function() {
  this.background.draw(this.context);
  this.stars.draw(this.context);
  this.landingPlatforms.draw(this.context);
  this.mountainRange.draw(this.context);
  this.lander.draw(this.context);
  this.gameInformation.draw();
};

Game.prototype.win = function() {
  this.winMessage.style.display = 'block';
};

Game.prototype.loose = function() {
  this.looseMessage.style.display = 'block';
};

Game.prototype.animate = function() {
  this.update();
  this.draw();
  !this.animationStopped && this.window.requestAnimationFrame(this.animate);
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
  this.background.setSize(this.canvas.width, this.canvas.height);
  this.stars.setSize(this.canvas.width, this.canvas.height);
  this.mountainRange.setSize(this.canvas.width, this.canvas.height);
  this.landingPlatforms.setSize(this.canvas.width, this.canvas.height);
  this.draw();
};

export default Game;
