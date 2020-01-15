import * as Noise from 'perlin-noise-3d';
import GameObject from '../GameObject';

class Landscape extends GameObject {
  constructor(color, width, height) {
    super();
    this.width = width;
    this.height = height;

    this.makeShape();
  }

  makeShape() {
    this.makePeaks();
    super.shape = Landscape.shape(this.width, this.height, this.peaks);
  }

  makePeaks() {
    const noise = new Noise();
    noise.noiseSeed(Landscape.seed);

    const points = Array.from({ length: this.width }, (_, increment) =>
      noise.get(increment * Landscape.smoothness)
    );
    const minPoint = Math.min(...points);
    const range = Math.max(...points) - minPoint;

    this.peaks = points.map(point => this.height * (1 + Landscape.scale * (point - minPoint - range) / range));
  }

  setSize(width, height) {
    super.setSize(width, height);
    this.makeShape();
  }
}

Landscape.seed = Math.random() * 100;
Landscape.scale = 0.6;
Landscape.smoothness = 0.003;

Landscape.shape = (width = 0, height = 0, peaks = []) => {
  const firstPeak = peaks[0];
  const lastPeak = peaks[peaks.length - 1];
  const start = [
    { cmd: 'strokeStyle', style: 'white' },
    { cmd: 'lineWidth', width: 1 },
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
