import GameObject from 'components/GameObject';
import * as Noise from 'perlin-noise-3d';
import round from 'utils/Round';

const MountainRange = function({
  width,
  height,
  scale,
  seed,
  smoothness,
}) {
  GameObject.call(this, 0, 0, []);
  this.width = width;
  this.height = height;
  this.scale = scale;
  this.seed = seed;
  this.smoothness = smoothness;
  this.makeShape();

};

MountainRange.prototype = new GameObject();

MountainRange.prototype.constructor = MountainRange;

MountainRange.prototype.makeShape = function() {
  this.makePoints();
  this.makeCollisionPoints();
  this.shape = MountainRange.shape(
    this.width,
    this.height,
    this.collisionPoints
  );
};

MountainRange.prototype.makePoints = function() {
  const noise = new Noise();
  noise.noiseSeed(this.seed);

  const data = Array.from({ length: round(this.width) }, (_, i) =>
    noise.get((i) * this.smoothness)
  );
  this.minPoint = Math.min(...data);
  this.range = Math.max(...data) - this.minPoint;

  this.points = data.map((point, x, arr) => {
    const y = this.calculateY(arr[x - 1]);
    const y2 = this.calculateY(point);
    const slope = x > 0 ? y2 - y : 0;
    return { x, y: y2, slope };
  });
};

MountainRange.prototype.makeCollisionPoints = function() {
  this.collisionPoints = this.points.reduce((acc, item) => {
    acc[item.x] = item.y;
    return acc;
  }, {});
};

MountainRange.prototype.setSize = function(width, height) {
  this.width = width;
  this.height = height;
  this.makeShape();
};

MountainRange.prototype.calculateY = function(point) {
  // prettier-ignore
  return round(this.height * (1 + (this.scale * (point - this.minPoint - this.range)) / this.range));
};

// MountainRange.prototype.draw = function() {
//   GameObject.prototype.drawShape(this.viewport.context, this.shape);
// };

// MountainRange.levels = {
//   1: { seed: 59.17262745556566 },
//   2: { seed: 47.373043350415635 },
//   3: { seed: 41.41870104674111 },
//   4: { seed: 97.98805490301626 },
//   5: { seed: 14.647031675482115 },
// };

MountainRange.shape = (width = 0, height = 0, points = []) => {
  const firstPeak = points[0];
  const keys = Object.keys(points);
  const lastPeak = points[keys[[keys.length - 1]]];
  const start = [
    { cmd: 'strokeStyle', style: '#666666' },
    { cmd: 'lineWidth', width: 2 },
    { cmd: 'beginPath' },
    { cmd: 'moveTo', x: -1, y: height + 1 },
    { cmd: 'lineTo', x: -1, y: firstPeak },
  ];
  const lines = keys.map(key => ({ cmd: 'lineTo', x: key, y: points[key] }));
  const end = [
    { cmd: 'lineTo', x: width + 1, y: lastPeak },
    { cmd: 'lineTo', x: width + 1, y: height + 1 },
    { cmd: 'closePath' },
    { cmd: 'fillStyle', style: 'black' },
    { cmd: 'fill' },
    { cmd: 'stroke' },
  ];

  return start.concat(lines, end);
};

export default MountainRange;
