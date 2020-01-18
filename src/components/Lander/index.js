import GameObject from '../GameObject';
import RandomNumberInRange from 'src/utils/RandomNumberInRange';

const Lander = function(x, y) {
  GameObject.call(this, x, y, []);
  this.deltaX = 0.5;
  this.deltaY = 0;
  this.rotation = 0;
  this.thrustPower = 0;
  this.shape = Lander.shape();
};

Lander.prototype = Object.create(GameObject.prototype);

Lander.prototype.constructor = Lander;

Lander.prototype.move = function(isUpPressed, isRightPressed, isLeftPressed) {
  if (isUpPressed) this.thrustOn();
  if (!isUpPressed) this.thrustOff();

  if (isRightPressed && !isLeftPressed) this.rotate(true);
  if (isLeftPressed && !isRightPressed) this.rotate(false);

  this.accelerate();

  this.x += this.deltaX;
  this.y += this.deltaY;
};

Lander.prototype.rotate = function(clockwise) {
  const maxRotation = 2 * Math.PI;
  if (clockwise) this.rotation += Lander.rotationAcceleration;
  if (!clockwise) this.rotation -= Lander.rotationAcceleration;
  if (this.rotation > maxRotation)
    this.rotation = this.rotation - maxRotation;
  if (this.rotation < 0) this.rotation = this.rotation + maxRotation;
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
  this.thrustPower += (1 - this.thrustPower) * 0.2;
  const acceleration = this.thrustPower * Lander.thrustAcceleration;
  this.deltaX += acceleration * Math.sin(this.rotation);
  this.deltaY -= acceleration * Math.cos(this.rotation);
};

Lander.prototype.thrustOff = function() {
  this.thrustPower = 0;
};

Lander.prototype.draw = function(context) {
  const cx = this.x + Lander.width;
  const cy = this.y + Lander.height / 2;

  context.save();
  context.translate(cx, cy);

  if (this.rotation > 0) context.rotate(this.rotation);

  GameObject.prototype.drawShape(context, this.shape);
  if (this.thrustPower > 0) GameObject.prototype.drawShape(context, Lander.thrust(this.thrustPower));

  context.translate(-cx, -cy);
  context.restore();
};

Lander.gravity = 0.0006;
Lander.drag = 0.0003;
Lander.thrustAcceleration = 0.002;
Lander.rotationAcceleration = 0.0174;
Lander.maxDelta = 0.35;
Lander.width = 5;
Lander.height = 6;
Lander.thrustGap = 2;
Lander.thrustWidth = Lander.width / 2;
Lander.thrustMaxHeight = Lander.height * 1.25;

Lander.shape = () => {
  return [
    { cmd: 'strokeStyle', style: 'white' },
    { cmd: 'fillStyle', style: 'black' },
    { cmd: 'lineWidth', width: 1 },
    { cmd: 'beginPath' },
    { cmd: 'moveTo', x: 0, y: -Lander.height },
    { cmd: 'lineTo', x: Lander.width, y: Lander.height },
    { cmd: 'lineTo', x: -Lander.width, y: Lander.height },
    { cmd: 'closePath' },
    { cmd: 'fill' },
    { cmd: 'stroke' },
  ];
};

Lander.thrust = (power) => {
  const height = Lander.thrustMaxHeight * 3 * power * RandomNumberInRange(0.75, 1);

  return [
    { cmd: 'strokeStyle', style: 'gray' },
    { cmd: 'fillStyle', style: 'black' },
    { cmd: 'lineWidth', width: 1 },
    { cmd: 'beginPath' },
    { cmd: 'moveTo', x: Lander.thrustWidth, y: Lander.height + Lander.thrustGap },
    { cmd: 'lineTo', x: 0, y: Lander.height + height + Lander.thrustGap },
    { cmd: 'lineTo', x: -Lander.thrustWidth, y: Lander.height + Lander.thrustGap },
    { cmd: 'closePath' },
    { cmd: 'fill' },
    { cmd: 'stroke' },
  ];
};

export default Lander;
