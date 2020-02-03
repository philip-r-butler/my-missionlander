import Background from 'components/Background';
import Lander from 'components/Lander';
import Landscape from 'components/Landscape';
import Platform from 'components/Platform';
import Stars from 'components/Stars';
import Collision from 'components/Collision';
import Explosion from 'components/Explosion';
import GameInformation from 'components/GameInformation';

function Game(global, canvasId) {
  this.window = global;
  this.canvas = this.window.document.getElementById(canvasId);
  this.context = this.canvas.getContext('2d');
  this.winMessage = this.window.document.getElementById('win');
  this.looseMessage = this.window.document.getElementById('loose');

  this.animate = this.animate.bind(this);

  this.createEventListeners();
  this.createKeyCommands();

  this.setSize();
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
    ' ': () => {
      if (this.gameStopped) this.start();
    },
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
  this.landscape = new Landscape(
    'black',
    this.canvas.width,
    this.canvas.height
  );
  this.platform = new Platform(
    this.canvas.width,
    this.canvas.height,
    this.landscape
  );
  this.stars = new Stars(0.04, this.canvas.width, this.canvas.height);
  this.lander = new Lander(50, 50);
  this.crash = new Collision(this.lander, this.landscape);
  this.landing = new Collision(this.lander, this.platform);
  this.explosion = new Explosion(15, this.landscape);
  this.gameInformation = new GameInformation(this.window);

};

Game.prototype.setSize = function() {
  const width = this.window.innerWidth;
  const height = this.window.innerHeight;

  this.canvas.width = width;
  this.canvas.height = height;
};

Game.prototype.update = function() {
  this.lander.update(this.isUpPressed, this.isRightPressed, this.isLeftPressed);
  this.crash.update();
  this.landing.update();
  this.explosion.update();
  if (!this.gameStopped) this.gameInformation.update(this.lander, this.landscape.collisionPoints);
};

Game.prototype.draw = function() {
  this.background.draw(this.context);
  this.stars.draw(this.context);
  this.platform.draw(this.context);
  this.explosion.draw(this.context);
  this.landscape.draw(this.context);
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
  if (!this.lander.isCrashed && !this.lander.isLanded) {
    this.lander.isLanded = this.landing.exists && this.landing.inside && this.lander.canLand;
    this.lander.isCrashed = this.crash.exists || (this.landing.exists && !(this.landing.inside && this.lander.canLand));
  }

  if (this.lander.isCrashed) {
    this.gameStopped = true;
    if (!this.explosion.active) this.explosion.explode(this.lander);
    if (this.explosion.active && !this.explosion.isAlive()) this.animationStopped = true;
    this.loose();
  }

  if (this.lander.isLanded) {
    this.gameStopped = true;
    this.animationStopped = true;
    this.win();
  }

  this.update();
  this.draw();

  if (!this.animationStopped) this.window.requestAnimationFrame(this.animate);
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
  this.landscape.setSize(this.canvas.width, this.canvas.height);
  this.platform.setSize(this.canvas.width, this.canvas.height);
  this.draw();
};

export default Game;
