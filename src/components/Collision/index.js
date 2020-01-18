const Collision = function(lander, landscape) {
  this.setLander(lander);
  this.setLandscape(landscape);
};

Collision.prototype.update = function(lander, landscape) {
  this.setLander(lander);
  this.setLandscape(landscape);
};

Collision.prototype.setLander = function(lander) {
  this.lander = lander;
};

Collision.prototype.setLandscape = function(landscape) {
  this.landscape = landscape;
};

Collision.prototype.isCollision = function() {
  const landerLeftX = Math.ceil(this.lander.x - this.lander.width);
  const landerRightX = Math.ceil(this.lander.x + this.lander.width);
  const landerY = this.lander.y + this.lander.height;
  return landerY >= this.landscape.points[landerLeftX] || landerY >= this.landscape.points[landerRightX];
};

export default Collision;
