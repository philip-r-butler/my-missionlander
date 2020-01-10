import GameObject from '../GameObject';

class Background extends GameObject {
  constructor(color, width, height) {
    super(0, 0);
    this.color = color;
    this.width = width;
    this.height = height;
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
  }

  draw(context) {
    super.shape = Background.shape(
      this.x,
      this.y,
      this.width,
      this.height,
      this.color
    );
    super.draw(context);
  }
}

Background.shape = (x, y, width, height, color) => [
  { cmd: 'fillStyle', style: color },
  { cmd: 'fillRect', x, y, width, height },
];

export default Background;
