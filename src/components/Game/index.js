import Background from '../Background';
import Lander from '../Lander';
import Landscape from '../Landscape';
import Platform from '../Platform';
import Stars from '../Stars';
import Collision from '../Collision';
import GameInformation from '../GameInformation';

function Game(global, canvasId) {
  this.window = global;
  this.canvas = this.window.document.getElementById(canvasId);
  this.context = this.canvas.getContext('2d');

  this.setSize();
  this.create();
  this.draw();
}

Game.prototype.run = function() {
  this.window.requestAnimationFrame(this.animate.bind(this));
};

Game.prototype.create = function() {
  this.createEventListeners();
  this.createKeyCommands();
  this.createGameObjects();
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

  this.onKeyDownCommnands = {
    ArrowUp: () => (this.isUpPressed = true),
    ArrowLeft: () => {
      this.isRightPressed = false;
      this.isLeftPressed = true;
    },
    ArrowRight: () => {
      this.isLeftPressed = false;
      this.isRightPressed = true;
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
  this.collision = new Collision();
  this.gameInformation = new GameInformation(this.window);
};

Game.prototype.setSize = function() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  this.canvas.width = width;
  this.canvas.height = height;
};

Game.prototype.update = function() {
  this.lander.move(this.isUpPressed, this.isRightPressed, this.isLeftPressed);
  this.gameInformation.update(this.lander, this.landscape);
};

Game.prototype.draw = function() {
  this.background.draw(this.context);
  this.stars.draw(this.context);
  this.platform.draw(this.context);
  this.landscape.draw(this.context);
  this.lander.draw(this.context);
  this.gameInformation.draw();
};

Game.prototype.animate = function() {
  const landerCanLand = this.lander.canLand();
  const lander = this.lander.collisionPoints();
  const isCollisionWithPlatform = this.collision.isCollision(
    lander,
    this.platform.points
  );
  const isCollisionWithLandscape = this.collision.isCollision(
    lander,
    this.landscape.points
  );
  const isCollision = isCollisionWithLandscape || isCollisionWithPlatform;
  const isLanderOnPlatform = Object.keys(lander).every(
    key => this.platform.points[Math.floor(key)]
  );

  const isCrashed = isCollision && !(isLanderOnPlatform && landerCanLand);
  const isLanded = isCollision && isLanderOnPlatform && landerCanLand;

  this.update();
  this.draw();

  if (isLanded) console.log('LANDED');
  if (isCrashed) console.log('BIG CRASH');
  if (!isCrashed && !isLanded) {
    window.requestAnimationFrame(this.animate.bind(this));
  }
};

Game.prototype.onKeyDown = function(e) {
  const keyCommands = this.onKeyDownCommnands;
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
