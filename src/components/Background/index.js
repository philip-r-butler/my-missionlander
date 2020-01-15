import GameObject from '../GameObject';

class Background extends GameObject {
  constructor(color, width, height) {
    super();
    this.x = 0;
    this.y = 0;
    this.color = color;
    this.width = width;
    this.height = height;

    this.makeShape();
  }

  makeShape() {
    super.shape = Background.shape(
      this.x,
      this.y,
      this.width,
      this.height,
      this.color
    );
  }

  draw(context) {
    this.makeShape();
    super.draw(context);
  }
}

Background.shape = (x = 0, y = 0, width = 0, height = 0, color = '') => [
  { cmd: 'fillStyle', style: color },
  { cmd: 'fillRect', x, y, width, height },
];

export default Background;
