const Collision = function() {};

Collision.prototype.isCollision = function(projectile, boundary) {
  return Object.keys(projectile).some(key => projectile[key] >= boundary[Math.floor(parseFloat(key))] - 1);
};

export default Collision;
