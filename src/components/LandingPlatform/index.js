import GameObject from 'components/GameObject';

const LandingPlatform = function(landscape) {
  GameObject.call(this, 0, 0, []);

  this.landscape = landscape;
  this.platforms = LandingPlatform.levels[1];

  this.makeShape();
};

LandingPlatform.prototype = Object.create(GameObject.prototype);

LandingPlatform.prototype.constructor = LandingPlatform;

LandingPlatform.prototype.makeShape = function() {
  this.makePoints();
  this.makeCollisionPoints();
  this.shape = LandingPlatform.shape(
    this.platforms,
    this.landscape
  );
};

LandingPlatform.prototype.makePoints = function() {
  const landscape = this.landscape;
  this.points = this.platforms
    .map(point => {
      const y = Math.max(...landscape.filter((_, index) => index >= point.left && index <= point.right).map(p => p.y)) - point.height;
      return Array.from({ length: point.right - point.left }, (_, increment) => ({
        x: point.left + increment,
        y,
        slope: 0,
      }));
    })
    .flat();
};

LandingPlatform.prototype.makeCollisionPoints = function() {
  this.collisionPoints = this.points.reduce((acc, item) => {
    acc[item.x] = item.y;
    return acc;
  }, {});
};

LandingPlatform.prototype.setSize = function(width, height) {
  this.width = width;
  this.height = height;
  this.makeShape();
};

LandingPlatform.levels = {
  1: [
    {
      left: 365,
      right: 505,
      height: 20,
    },
    {
      left: 550,
      right: 580,
      height: 15,
    },
    {
      left: 615,
      right: 645,
      height: 30,
    },
    {
      left: 780,
      right: 820,
      height: 15,
    },
    {
      left: 915,
      right: 945,
      height: 10,
    },
    {
      left: 985,
      right: 1015,
      height: 15,
    },
  ],
};

LandingPlatform.shape = (platforms = [], landscape) => {
  const start = [
    { cmd: 'strokeStyle', style: '#666666' },
    { cmd: 'lineWidth', width: 2 },
    { cmd: 'beginPath' },
  ];
  const middle = platforms
    .map(point => {
      const y = Math.max(...landscape.filter((_, index) => index >= point.left && index <= point.right).map(p => p.y)) - point.height;
      const center = point.left + Math.floor((point.right - point.left)/ 2);
      return [
        { cmd: 'moveTo', x: point.left, y },
        { cmd: 'lineTo', x: point.right, y },
        { cmd: 'moveTo', x: center, y },
        { cmd: 'lineTo', x: center, y: landscape[center].y},
        { cmd: 'stroke' },
      ];
    })
    .flat();
  const end = [{ cmd: 'stroke' }];

  return start.concat(middle, end);
};

export default LandingPlatform;
