import GameObject from '../GameObject';

class Stars extends GameObject {
  constructor(number, width, height) {
    super(0, 0);
    this.width = width;
    this.height = height;
    this.number = number;
    super.shape = this.makeShape();
  }

  makeShape() {
    return Stars.shape(
      this.numberOfStars(this.number, this.width),
      this.width,
      this.height
    );
  }

  numberOfStars(number, width) {
    return Math.floor(number * width / 500);
  }

  setSize(width, height) {
    super.setSize(width, height);
    super.shape = this.makeShape();
  }
}

Stars.makeStars = (number = 20, width = 1000, height = 500) =>
  [...Array(number)]
    .map(() => [
      {
        cmd: 'rect',
        x: Math.random() * width,
        y: Math.random() * height,
        width: 2,
        height: 2,
      },
      { cmd: 'fillStyle', style: 'white' },
      { cmd: 'fill' },
    ])
    .flat();

Stars.shape = (number, width, height) => {
  const start = [
    { cmd: 'strokeStyle', style: 'white' },
    { cmd: 'lineWidth', width: 1 },
    { cmd: 'beginPath' },
  ];
  const end = [{ cmd: 'stroke' }];
  return start.concat(Stars.makeStars(number, width, height), end);
};

export default Stars;
