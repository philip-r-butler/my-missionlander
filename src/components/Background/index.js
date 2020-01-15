import GameObject from '../GameObject';

const Background = function(color, width, height) {
  GameObject.call(this, 0, 0, []);
  this.x = 0;
  this.y = 0;
  this.color = color;
  this.width = width;
  this.height = height;

  this.makeShape();
};

Background.prototype = Object.create(GameObject.prototype);

Background.prototype.constructor = Background;

Background.prototype.makeShape = function() {
  this.shape = Background.shape(
    this.x,
    this.y,
    this.width,
    this.height,
    this.color
  );
};

Background.prototype.draw = function(context) {
  this.makeShape();
  GameObject.prototype.drawShape(context, this.shape);
};

Background.shape = (x = 0, y = 0, width = 0, height = 0, color = '') => [
  { cmd: 'fillStyle', style: color },
  { cmd: 'fillRect', x, y, width, height },
];

export default Background;
