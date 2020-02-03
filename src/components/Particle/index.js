import GameObject from 'components/GameObject';
import randomNumberInRange from 'utils/RandomNumberInRange';
import Collision from 'components/Collision';

const Particle = function(x, y, deltaX, deltaY, landscape) {
  GameObject.call(this, x, y, []);

  this.x = x;
  this.y = y;
  this.makeShape();
  this.initialiseDeltaX(deltaX);
  this.initialiseDeltaY(deltaY);
  this.landscape = landscape;
  this.alive = true;
  this.collision = new Collision(this, this.landscape);

  this.update = this.update.bind(this);
};

Particle.prototype = Object.create(GameObject.prototype);

Particle.prototype.constructor = Particle;

Particle.prototype.makeShape = function() {
  this.height = randomNumberInRange(4, 8);
  this.halfHeight = this.height / 2;
  this.width = (this.height * 5) / 6;
  this.halfWidth = this.width / 2;

  this.shape = Particle.shape(this.width, this.height);
  this.makeCollisionPoints();
};

Particle.prototype.makeCollisionPoints = function() {
  const x = Math.floor(this.x);
  const w = Math.ceil(this.halfHeight);
  this.collisionPoints = {
    [x]: this.y - this.halfHeight,
    [x - w]: this.y + this.halfHeight,
    [x + w]: this.y + this.halfHeight,
  };
};

Particle.prototype.initialiseDeltaX = function(initialDelta) {
  this.deltaX = (randomNumberInRange(-30, 30)
    * (Math.abs(initialDelta) < 0.25
      ? Math.sign(initialDelta) * 0.4
      : initialDelta))
    / this.height;
};

Particle.prototype.initialiseDeltaY = function(initialDelta) {
  this.deltaY = (randomNumberInRange(-50, 10) * Math.min(initialDelta, 1.5))
    / this.height;
};

Particle.prototype.setAlive = function() {
  this.alive = Math.abs(this.deltaX) > 0.001 && Math.abs(this.deltaY) > 0.001 && this.x > 0 && this.y > 0 && this.y < this.landscape.collisionPoints[Math.floor(this.x)];
};

Particle.prototype.update = function() {
  if (!this.alive) return;

  this.x += this.deltaX;
  this.y += this.deltaY;
  this.deltaY = this.deltaY + Particle.gravity;

  this.makeCollisionPoints();
  this.collision.update();

  if (this.collision.exists) {
    this.y = this.collision.y - this.halfHeight;
    this.deltaX *= 0.5;
    this.deltaY *= -0.5;
  }

  this.setAlive();
};

Particle.prototype.draw = function(context) {
  context.save();
  context.translate(this.x, this.y);
  GameObject.prototype.drawShape(context, this.shape);
  context.translate(-this.x, -this.y);
  context.restore();
};

Particle.shape = (width, height) => [
  { cmd: 'strokeStyle', style: 'gray' },
  { cmd: 'fillStyle', style: 'black' },
  { cmd: 'lineWidth', width: 1 },
  { cmd: 'beginPath' },
  { cmd: 'moveTo', x: 0, y: -height / 2},
  { cmd: 'lineTo', x: width / 2, y: height / 2 },
  { cmd: 'lineTo', x: -width / 2, y: height / 2 },
  { cmd: 'closePath' },
  { cmd: 'fill' },
  { cmd: 'stroke' },
];

Particle.gravity = 0.08;

export default Particle;
