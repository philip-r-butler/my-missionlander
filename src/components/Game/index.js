import Background from '../Background';
import Lander from '../Lander';
import Landscape from '../Landscape';
import Stars from '../Stars';

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
  this.stars = new Stars(20, this.canvas.width, this.canvas.height);
  this.lander = new Lander(110, 150);
  //     this.platform = new GameObject(x, y, shape);
};

Game.prototype.setSize = function() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  this.canvas.width = width;
  this.canvas.height = height;
};

Game.prototype.update = function() {
  this.lander.move(this.isUpPressed, this.isRightPressed, this.isLeftPressed);
};

Game.prototype.draw = function() {
  this.background.draw(this.context);
  this.stars.draw(this.context);
  this.lander.draw(this.context);
  this.landscape.draw(this.context);
};

Game.prototype.animate = function() {
  this.update();
  this.draw();
  window.requestAnimationFrame(this.animate.bind(this));
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
  this.draw();
};

export default Game;
