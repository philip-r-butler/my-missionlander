import GameObject from '../GameObject';

const Platform = function(width, height, landscape) {
  GameObject.call(this, 0, 0, []);
  this.width = width;
  this.height = height;
  this.landscape = landscape;
  this.makeShape();
};

Platform.prototype = Object.create(GameObject.prototype);

Platform.prototype.constructor = Platform;

Platform.prototype.makeShape = function() {
  const platforms = this.getPlatforms(this.landscape.getPoints());
  const points = this.makePoints(platforms);
  this.shape = Platform.shape(points, platforms);
};

Platform.prototype.getPlatforms = function(landscape) {
  const slopeTolerance = 0.02;
  const spacingTolerance = 50;
  return landscape
    .map((item, index, array) =>
      index > 0
        ? { x: index - 1, y: item, slope: array[index - 1] - item }
        : { x: index, y: item, slope: array[index] - item }
    )
    .filter((item, index, array) =>
      index > 0
        ? (item.slope > slopeTolerance
            && array[index - 1].slope < slopeTolerance)
          || (item.slope < slopeTolerance
            && array[index - 1].slope > slopeTolerance)
        : false
    )
    .filter((item, index, array) =>
      index > 0 ? item.x - array[index - 1].x > spacingTolerance : false
    )
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);
};

Platform.prototype.makePoints = function(platforms) {
  return platforms
    .map(point =>
      Array.from({ length: 20 }, (_, increment) => ({
        x: Math.floor(point.x - 10 + increment + 1),
        y: Math.floor(point.y - 8),
      }))
    )
    .flat();
};

Platform.prototype.setSize = function(width, height) {
  this.width = width;
  this.height = height;
  this.makeShape();
};

Platform.shape = (points = [], platforms = []) => {
  const startVerticals = [
    { cmd: 'strokeStyle', style: 'gray' },
    { cmd: 'lineWidth', width: 1 },
    { cmd: 'beginPath' },
  ];
  const start = [
    { cmd: 'strokeStyle', style: 'white' },
    { cmd: 'lineWidth', width: 1 },
    { cmd: 'beginPath' },
  ];
  const end = [{ cmd: 'stroke' }];
  const verticals = platforms.map(
    point => [
      {
        cmd: 'moveTo',
        x: point.x + 1,
        y: point.y,
      },
      { cmd: 'lineTo', x: point.x + 1, y: point.y - 8 },
      { cmd: 'stroke' },
    ]
  ).flat();
  const horizontals = points.map(point => ({
    cmd: 'rect',
    x: point.x,
    y: point.y,
    width: 1,
    height: 1,
  }));

  return startVerticals.concat(verticals, start, horizontals, end);
};

export default Platform;
