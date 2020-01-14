import Background from '../Background';
import Lander from '../Lander';
import Landscape from '../Landscape';
import Stars from '../Stars';

export default class Game {
  constructor(global, canvasId) {
    this.window = global;
    this.canvas = this.window.document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');

    this.isUpPressed = false;
    this.isLeftPressed = false;
    this.isRightPressed = false;

    this.setSize = this.setSize.bind(this);
    this.animate = this.animate.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    this.window.addEventListener('resize', this.onResize, false);
    this.window.addEventListener('keydown', this.onKeyDown, false);
    this.window.addEventListener('keyup', this.onKeyUp, false);

    this.create();
    this.draw();
  }

  start() {
    this.window.requestAnimationFrame(this.animate);
  }

  create() {
    this.createGameObjects();
    this.setSize();
  }

  createGameObjects() {
    this.background = new Background('black', 0, 0);
    this.landscape = new Landscape();
    this.stars = new Stars(20);
    this.lander = new Lander(110, 150);
    //     this.platform = new GameObject(x, y, shape);
  }

  setSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = width;
    this.canvas.height = height;
    this.background.setSize(width, height);
  }

  onKeyDown(e) {
    const keyCommands = {
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
    if (e.key in keyCommands) keyCommands[e.key]();
  }

  onKeyUp(e) {
    const keyCommands = {
      ArrowUp: () => (this.isUpPressed = false),
      ArrowLeft: () => (this.isLeftPressed = false),
      ArrowRight: () => (this.isRightPressed = false),
    };
    if (e.key in keyCommands) keyCommands[e.key]();
  }

  update() {
    this.lander.move(this.isUpPressed, this.isRightPressed, this.isLeftPressed);
  }

  draw() {
    this.background.draw(this.context);
    this.stars.draw(this.context);
    this.lander.draw(this.context);
    this.landscape.draw(this.context);
  }

  onResize() {
    this.setSize();
    this.draw();
  }

  animate() {
    this.update();
    this.draw();

    window.requestAnimationFrame(this.animate.bind(this));
  }
}
