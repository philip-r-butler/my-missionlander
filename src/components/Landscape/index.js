import * as Noise from 'perlin-noise-3d';
import GameObject from '../GameObject';

const Landscape = function(color, width, height) {
  GameObject.call(this, 0, 0, []);
  this.width = width;
  this.height = height;

  this.makeShape();
};

Landscape.prototype = Object.create(GameObject.prototype);

Landscape.prototype.constructor = Landscape;

Landscape.prototype.makePoints = function() {
  const noise = new Noise();
  noise.noiseSeed(Landscape.seed);

  const data = Array.from({ length: this.width }, (_, increment) =>
    noise.get(increment * Landscape.smoothness)
  );
  const minPoint = Math.min(...data);
  const range = Math.max(...data) - minPoint;

  this.points = data.map(
    point => this.height * (1 + (Landscape.range * (point - minPoint - range)) / range)
  );
};

Landscape.prototype.makeShape = function() {
  this.makePoints();
  this.shape = Landscape.shape(this.width, this.height, this.points);
};

Landscape.prototype.setSize = function(width, height) {
  this.width = width;
  this.height = height;
  this.makeShape();
};

Landscape.prototype.getPoints = function() {
  return this.points;
};

Landscape.seed = Math.random() * 100;
Landscape.range = 0.6;
Landscape.smoothness = 0.003;

Landscape.shape = (width = 0, height = 0, peaks = []) => {
  const firstPeak = peaks[0];
  const lastPeak = peaks[peaks.length - 1];
  const start = [
    { cmd: 'strokeStyle', style: '#666666' },
    { cmd: 'lineWidth', width: 2 },
    { cmd: 'beginPath' },
    { cmd: 'moveTo', x: -1, y: height + 1 },
    { cmd: 'lineTo', x: -1, y: firstPeak },
  ];
  const points = peaks.map((y, x) => ({ cmd: 'lineTo', x, y }));
  const end = [
    { cmd: 'lineTo', x: width + 1, y: lastPeak },
    { cmd: 'lineTo', x: width + 1, y: height + 1 },
    { cmd: 'closePath' },
    { cmd: 'fillStyle', style: 'black' },
    { cmd: 'fill' },
    { cmd: 'stroke' },
  ];

  return start.concat(points, end);
};

export default Landscape;
