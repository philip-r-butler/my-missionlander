import GameObject from '../GameObject';
import RandomNumberInRange from 'utils/RandomNumberInRange';
import Collision from 'components/Collision';
import Explosion from 'components/Explosion';
import round from 'utils/Round';

const Lander = function(
  x,
  y,
  collisionLandscape,
  crashLandscape,
  landingLandscape
) {
  GameObject.call(this, x, y, []);
  this.collisionLandscape = collisionLandscape;
  this.deltaX = Lander.initialDeltaX;
  this.deltaY = Lander.initialDeltaY;
  this.rotation = 0;
  this.thrustPower = 0;
  this.canLand = false;
  this.isLanded = false;
  this.isCrashed = false;
  this.fuel = Lander.initialFuel;
  this.shape = Lander.shape();
  this.exploding = false;
  this.explosion = new Explosion(15, this.collisionLandscape);
  this.makeCollisionPoints();
  this.crash = new Collision(this, crashLandscape);
  this.landing = new Collision(this, landingLandscape);
};

Lander.prototype = Object.create(GameObject.prototype);

Lander.prototype.constructor = Lander;

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
  // prettier-ignore
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
  // prettier-ignore
  this.canLand = (this.rotation < Lander.landingRotationTolerance
    || this.rotation > Math.PI * 2 - Lander.landingRotationTolerance)
    && Math.abs(this.deltaX) < Lander.landingMaxDelta
    && Math.abs(this.deltaY) < Lander.landingMaxDelta;
};

Lander.prototype.zerofy = function() {
  this.deltaX = 0;
  this.deltaY = 0;
  // this.y = this.collisionLandscape.collisionPoints[Math.floor(this.x)];
  this.rotation = 0;
};

Lander.prototype.explode = function() {
  this.exploding = true;
  !this.explosion.active && this.explosion.start(this);
};

Lander.prototype.update = function(isUpPressed, isRightPressed, isLeftPressed) {
  this.crash.update();
  this.landing.update();

  if (!this.isCrashed && !this.isLanded) {
    // prettier-ignore
    this.isCrashed = this.crash.exists || (this.landing.exists && (!this.landing.inside || !this.canLand));
    this.isLanded = this.canLand && this.landing.exists && this.landing.inside;
  }

  if (this.isLanded) return;

  if (this.isCrashed && !this.exploding) {
    this.explode();
    this.zerofy();
    return;
  }

  if (this.exploding) {
    this.explosion.update();
    if (this.explosion.active && !this.explosion.isAlive()) this.exploding = false;
    return;
  }

  this.makeCollisionPoints();

  if (isUpPressed) this.thrustOn();
  if (!isUpPressed) this.thrustOff();

  if (isRightPressed && !isLeftPressed) this.rotateClockwise();
  if (isLeftPressed && !isRightPressed) this.rotateCounterClockwise();

  this.accelerate();
  this.checkCanLand();

  this.x += this.deltaX;
  this.y += this.deltaY;
};

Lander.prototype.draw = function(context) {
  const x = this.x;
  const y = this.y;

  if (this.exploding) {
    this.explosion.draw(context);
    return;
  }

  context.save();
  context.translate(x, y);

  if (this.rotation > 0) context.rotate(this.rotation);

  GameObject.prototype.drawShape(context, this.shape);
  if (this.thrustPower > 0 && !this.isLanded)
    GameObject.prototype.drawShape(context, Lander.thrust(this.thrustPower));

  context.translate(-x, -y);
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
Lander.landingMaxDelta = 0.2;
Lander.width = 10;
Lander.height = 12;
Lander.halfWidth = round(Lander.width / 2);
Lander.halfHeight = round(Lander.height / 2);
Lander.thrustGap = 2;
Lander.thrustWidth = round(Lander.halfWidth);
Lander.halfThrustWidth = round(Lander.thrustWidth / 2);
Lander.thrustMaxHeight = round(Lander.height * 1.25);

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
  // prettier-ignore
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
