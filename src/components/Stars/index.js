import GameObject from 'components/GameObject';
import round from 'utils/Round';

const Stars = function(density, width, height) {
  GameObject.call(this, 0, 0, []);
  this.width = width;
  this.height = height;
  this.density = density;
  this.shape = this.makeShape();
};

Stars.prototype = Object.create(GameObject.prototype);

Stars.prototype.constructor = Stars;

Stars.prototype.makeShape = function() {
  return Stars.shape(
    this.numberOfStars(this.density, this.width),
    this.width,
    this.height
  );
};

Stars.prototype.numberOfStars = function(density, width) {
  return round(density * width);
};

Stars.prototype.setSize = function(width, height) {
  this.width = width;
  this.height = height;
  this.shape = this.makeShape();
};

Stars.makeStars = (number = 0, width = 0, height = 0) =>
  [...Array(number)]
    .map(() => [
      {
        cmd: 'rect',
        x: round(Math.random() * width),
        y: round(Math.random() * height),
        width: 1,
        height: 1,
      },
      { cmd: 'fillStyle', style: 'white' },
      { cmd: 'fill' },
    ])
    .flat();

Stars.shape = (number = 0, width = 0, height = 0) => {
  const start = [
    { cmd: 'strokeStyle', style: 'white' },
    { cmd: 'lineWidth', width: 1 },
    { cmd: 'beginPath' },
  ];
  const end = [{ cmd: 'stroke' }];
  return start.concat(Stars.makeStars(number, width, height), end);
};

export default Stars;
