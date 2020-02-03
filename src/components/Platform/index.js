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
  this.makePlatforms(this.landscape.collisionPoints);
  this.makeCollisionPoints(this.platforms);
  this.shape = Platform.shape(this.collisionPoints, this.platforms);
};

Platform.prototype.makePlatforms = function(landscape) {
  const slopeTolerance = 0.02;
  const spacingTolerance = 50;
  this.platforms = Object.keys(landscape)
    .map((key, index, array) => {
      const y = landscape[key];
      return index > 0
        ? { x: index - 1, y, slope: landscape[array[index - 1]] - y }
        : { x: index, y, slope: 0 };
    })
    .filter((item, index, array) =>
      index > 0
        ? (item.slope > slopeTolerance && array[index - 1].slope < slopeTolerance)
          || (item.slope < slopeTolerance && array[index - 1].slope > slopeTolerance)
        : false
    )
    .filter((item, index, array) =>
      index > 0 ? item.x - array[index - 1].x > spacingTolerance : false
    )
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);
};

Platform.prototype.makeCollisionPoints = function(platforms) {
  this.collisionPoints = platforms
    .map(point =>
      Array.from({ length: 20 }, (_, increment) => ({
        x: Math.floor(point.x - 10 + increment + 1),
        y: Math.floor(point.y - 8),
      }))
    )
    .flat()
    .reduce((acc, item) => {
      acc[item.x] = item.y;
      return acc;
    }, {});
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
    { cmd: 'strokeStyle', style: 'lightGray' },
    { cmd: 'lineWidth', width: 1 },
    { cmd: 'beginPath' },
  ];
  const end = [{ cmd: 'stroke' }];
  const verticals = platforms
    .map(point => [
      {
        cmd: 'moveTo',
        x: point.x + 1,
        y: point.y,
      },
      { cmd: 'lineTo', x: point.x + 1, y: point.y - 8 },
      { cmd: 'stroke' },
    ])
    .flat();
  const horizontals = Object.keys(points).map(key => ({
    cmd: 'rect',
    x: key,
    y: points[key],
    width: 1,
    height: 1,
  }));

  return startVerticals.concat(verticals, start, horizontals, end);
};

export default Platform;
