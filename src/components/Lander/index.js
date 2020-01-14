import GameObject from '../GameObject';

class Lander extends GameObject {
  constructor(x, y) {
    super(x, y, Lander.shape());

    this.deltaX = 0.415;
    this.deltaY = 0;
    this.rotation = 0;
    this.thrustPower = 0;
  }

  move(isUpPressed, isRightPressed, isLeftPressed) {
    if (isUpPressed) this.thrustOn();
    if (!isUpPressed) this.thrustOff();

    if (isRightPressed && !isLeftPressed) this.rotate(true);
    if (isLeftPressed && !isRightPressed) this.rotate(false);

    this.accelerate();

    this.x += this.deltaX;
    this.y += this.deltaY;

    super.shape = Lander.shape();
  }

  thrustOn() {
    this.thrustPower += (1 - this.thrustPower) * 0.2;
    this.deltaY -= this.thrustPower * Lander.thrustAcceleration;
  }

  thrustOff() {
    this.thrustPower = 0;
  }

  rotate(clockwise) {
    const maxRotation = 2 * Math.PI;
    if (clockwise) this.rotation += Lander.rotationAcceleration;
    if (!clockwise) this.rotation -= Lander.rotationAcceleration;
    if (this.rotation > maxRotation) this.rotation = this.rotation - maxRotation;
    if (this.rotation < 0) this.rotation = this.rotation + maxRotation;
  }

  accelerate() {
    this.deltaX *= (1 - Lander.drag);
    this.deltaY = this.deltaY > Lander.maxDelta
      ? Lander.maxDelta
      : this.deltaY < -Lander.maxDelta
        ? -Lander.maxDelta
        : this.deltaY + Lander.gravity;
  }

  draw(context) {
    const cx = this.x + Lander.width;
    const cy = this.y + Lander.height;

    context.save();
    context.translate(cx, cy);
    if (this.rotation > 0) context.rotate(this.rotation);
    super.draw(context);
    if (this.thrustPower > 0) super.drawShape(context, Lander.thrust());
    context.translate(-cx, -cy);
    context.restore();
  }
}

Lander.gravity = 0.0006;
Lander.drag = 0.0003;
Lander.thrustAcceleration = 0.0015;
Lander.rotationAcceleration = 0.0174;
Lander.maxDelta = 0.35;
Lander.width = 10;
Lander.height = 10;

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

Lander.thrust = () => {
  const gap = 3;
  const width = Lander.width / 2;
  const height = 15;

  return [
    { cmd: 'strokeStyle', style: 'white' },
    { cmd: 'fillStyle', style: 'black' },
    { cmd: 'lineWidth', width: 1 },
    { cmd: 'beginPath' },
    { cmd: 'moveTo', x: width, y: Lander.height + gap },
    { cmd: 'lineTo', x: 0, y: Lander.height + height + gap },
    { cmd: 'lineTo', x: -width, y: Lander.height + gap },
    { cmd: 'closePath' },
    { cmd: 'fill' },
    { cmd: 'stroke' },
  ];
};

export default Lander;
