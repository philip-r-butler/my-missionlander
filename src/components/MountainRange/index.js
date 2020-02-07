import GameObject from 'components/GameObject';
import * as Noise from 'perlin-noise-3d';

const MountainRange = function(params = {}) {
  GameObject.call(this, 0, 0, []);
  this.initialiseProperties(this, params, MountainRange.defaults);
  this.makeShape();
};

MountainRange.prototype = Object.create(GameObject.prototype);

MountainRange.prototype.constructor = MountainRange;

MountainRange.prototype.initialiseProperties = function(obj, params, defaults) {
  Object.keys(defaults).forEach(
    key => (obj[key] = params[key] || defaults[key])
  );
};

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
  noise.noiseSeed(MountainRange.levels[1].seed);

  const data = Array.from({ length: this.width }, (_, i) =>
    noise.get(i * this.smoothness)
  );
  const minPoint = Math.min(...data);
  const range = Math.max(...data) - minPoint;

  this.points = data.map((point, x, arr) => {
    const y = this.calculateY(point, this.height, this.scale, minPoint, range);
    const slope = x > 0
      ? this.calculateY(
        arr[x - 1],
        this.height,
        this.scale,
        minPoint,
        range
      ) - y
      : 0;
    return { x, y, slope };
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

MountainRange.prototype.calculateY = function(
  point,
  height,
  scale,
  minPoint,
  range
) {
  return Math.floor(
    height * (1 + (scale * (point - minPoint - range)) / range)
  );
};

MountainRange.defaults = {
  width: 1024,
  height: 800,
  scale: 1,
  seed: 0.5,
  smoothness: 0.003,
};

MountainRange.levels = {
  1: { seed: 59.17262745556566 },
  2: { seed: 47.373043350415635 },
  3: { seed: 41.41870104674111 },
  4: { seed: 97.98805490301626 },
  5: { seed: 14.647031675482115 },
};

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
