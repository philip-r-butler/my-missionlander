import GameObject from '../GameObject';
import RandomNumberInRange from 'utils/RandomNumberInRange';

const Lander = function(x, y) {
  GameObject.call(this, x, y, []);
  this.deltaX = Lander.initialDeltaX;
  this.deltaY = Lander.initialDeltaY;
  this.rotation = 0;
  this.thrustPower = 0;
  this.canLand = false;
  this.isLanded = false;
  this.isCrashed = false;
  this.fuel = Lander.initialFuel;
  this.shape = Lander.shape();
  this.makeCollisionPoints();
};

Lander.prototype = Object.create(GameObject.prototype);

Lander.prototype.constructor = Lander;

Lander.prototype.update = function(isUpPressed, isRightPressed, isLeftPressed) {
  this.makeCollisionPoints();
  if (this.isLanded || this.isCrashed) {
    this.deltaX = 0;
    this.deltaY = 0;
    return;
  }

  if (isUpPressed) this.thrustOn();
  if (!isUpPressed) this.thrustOff();

  if (isRightPressed && !isLeftPressed) this.rotateClockwise();
  if (isLeftPressed && !isRightPressed) this.rotateCounterClockwise();

  this.accelerate();
  this.checkCanLand();

  this.x += this.deltaX;
  this.y += this.deltaY;
};

Lander.prototype.makeCollisionPoints = function() {
  const x = Math.floor(this.x);
  const w = Math.ceil(Lander.halfWidth);
  this.collisionPoints = {
    [x]: this.y - Lander.halfHeight,
    [x - w]: this.y + Lander.halfHeight,
    [x + w]: this.y + Lander.halfHeight,
  };
};

Lander.prototype.rotateClockwise = function() {
  this.rotation += Lander.rotationAcceleration;
  this.checkRotation();
};

Lander.prototype.rotateCounterClockwise = function(clockwise) {
  if (!clockwise) this.rotation -= Lander.rotationAcceleration;
  this.checkRotation();
};

Lander.prototype.checkRotation = function() {
  if (this.rotation > Lander.maxRotation)
    this.rotation = this.rotation - Lander.maxRotation;
  if (this.rotation < 0) this.rotation = this.rotation + Lander.maxRotation;
};

Lander.prototype.accelerate = function() {
  this.deltaX *= 1 - Lander.drag;
  this.deltaY = this.deltaY > Lander.maxDelta
    ? Lander.maxDelta
    : this.deltaY < -Lander.maxDelta
      ? -Lander.maxDelta
      : this.deltaY + Lander.gravity;
};

Lander.prototype.thrustOn = function() {
  if (this.fuel < 1) {
    this.thrustPower = 0;
    this.fuel = 0;
    return;
  }

  this.thrustPower += (1 - this.thrustPower) * 0.2;
  this.fuel -= this.thrustPower * (1 - Lander.fuelEfficiency);
  const acceleration = this.thrustPower * Lander.thrustAcceleration;
  this.deltaX += acceleration * Math.sin(this.rotation);
  this.deltaY -= acceleration * Math.cos(this.rotation);
};

Lander.prototype.thrustOff = function() {
  this.thrustPower = 0;
};

Lander.prototype.checkCanLand = function() {
  this.canLand = (
    (this.rotation < Lander.landingRotationTolerance
      || this.rotation > Math.PI * 2 - Lander.landingRotationTolerance)
    && Math.abs(this.deltaX) < Lander.landingMaxDelta
    && Math.abs(this.deltaY) < Lander.landingMaxDelta
  );
};

Lander.prototype.draw = function(context) {
  if (this.isCrashed) return;

  context.save();
  context.translate(this.x, this.y);

  if (this.rotation > 0) context.rotate(this.rotation);

  GameObject.prototype.drawShape(context, this.shape);
  if (this.thrustPower > 0 && !this.isLanded)
    GameObject.prototype.drawShape(context, Lander.thrust(this.thrustPower));

  context.translate(-this.x, -this.y);
  context.restore();
};

Lander.initialDeltaX = 0.5;
Lander.initialDeltaY = 0;
Lander.initialFuel = 1000;
Lander.fuelEfficiency = 0.5;
Lander.gravity = 0.001;
Lander.drag = 0.0003;
Lander.thrustAcceleration = 0.002;
Lander.rotationAcceleration = 0.0174;
Lander.maxDelta = 1.25;
Lander.maxRotation = 2 * Math.PI;
Lander.landingRotationTolerance = 0.1;
Lander.landingMaxDelta = 0.1;
Lander.width = 10;
Lander.height = 12;
Lander.halfWidth = Lander.width / 2;
Lander.halfHeight = Lander.height / 2;
Lander.thrustGap = 2;
Lander.thrustWidth = Lander.halfWidth;
Lander.halfThrustWidth = Lander.thrustWidth / 2;
Lander.thrustMaxHeight = Lander.height * 1.25;

Lander.shape = () => {
  return [
    { cmd: 'strokeStyle', style: 'white' },
    { cmd: 'fillStyle', style: 'black' },
    { cmd: 'lineWidth', width: 1 },
    { cmd: 'beginPath' },
    { cmd: 'moveTo', x: 0, y: -Lander.halfHeight },
    { cmd: 'lineTo', x: Lander.halfWidth, y: Lander.halfHeight },
    { cmd: 'lineTo', x: -Lander.halfWidth, y: Lander.halfHeight },
    { cmd: 'closePath' },
    { cmd: 'fill' },
    { cmd: 'stroke' },
  ];
};

Lander.thrust = power => {
  const height = Lander.thrustMaxHeight * 2 * power * RandomNumberInRange(0.75, 1);

  return [
    { cmd: 'strokeStyle', style: 'gray' },
    { cmd: 'fillStyle', style: 'black' },
    { cmd: 'lineWidth', width: 1 },
    { cmd: 'beginPath' },
    {
      cmd: 'moveTo',
      x: Lander.halfThrustWidth,
      y: Lander.halfHeight + Lander.thrustGap,
    },
    { cmd: 'lineTo', x: 0, y: Lander.halfHeight + height + Lander.thrustGap },
    {
      cmd: 'lineTo',
      x: -Lander.halfThrustWidth,
      y: Lander.halfHeight + Lander.thrustGap,
    },
    { cmd: 'closePath' },
    { cmd: 'fill' },
    { cmd: 'stroke' },
  ];
};

export default Lander;
