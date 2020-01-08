import Background from '../Background';
import Lander from '../Lander';

export default class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');

    this.startTime = -1;
    this.animationLength = 10000;

    this.resize = this.resize.bind(this);
    this.setSize = this.setSize.bind(this);
    this.animate = this.animate.bind(this);

    this.create();
    this.draw();

    window.requestAnimationFrame(this.animate);
  }

  create() {
    this.createGameObjects();
    this.setSize();
  }

  createGameObjects() {
    this.background = new Background('black', 0, 0);
    this.lander = new Lander(50, 150);
    //     this.landscape = new GameObject(x, y, shape);
    //     this.platform = new GameObject(x, y, shape);
    //     this.stars = new Stars(x, y)
  }

  setSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = width;
    this.canvas.height = height;
    this.background.setSize(width, height);
  }

  draw() {
    this.background.draw(this.context);
    this.lander.move();
    this.lander.draw(this.context);

    // this.rocket.draw();
    // this.landscape.draw();
    // this.stars.draw();
  }

  resize() {
    this.setSize();
    this.draw();
  }

  animate(timestamp) {
    let progress = 0;

    if (this.startTime < 0) {
      this.startTime = timestamp;
    }
    if (this.startTime >= 0) {
      progress = timestamp - this.startTime;
      this.draw();
    }

    if (progress < this.animationLength) {
      window.requestAnimationFrame(this.animate.bind(this));
    }
  }
}
