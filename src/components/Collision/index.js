const Collision = function(obj1, obj2) {
  this.obj1 = obj1;
  this.obj2 = obj2;
  this.exists = false;
  this.x = undefined;
  this.y = undefined;

  this.collisionPoints1 = this.obj1.collisionPoints;
  this.collisionPoints2 = this.obj2;

  this.isCollision = (key) => this.collisionPoints1[key] > this.collisionPoints2[Math.floor(parseFloat(key))];
  this.isInside = () => Object.keys(this.collisionPoints1).every(key => this.collisionPoints2[Math.floor(key)]);
};

Collision.prototype.update = function() {
  this.collisionPoints1 = this.obj1.collisionPoints;
  this.collisionPoints2 = this.obj2;

  this.exists = Object.keys(this.collisionPoints1).some(this.isCollision);

  if (this.exists) {
    this.x = Object.keys(this.collisionPoints1).filter(this.isCollision)[0];
    this.y = this.collisionPoints2[this.x];
  }

  this.inside = this.isInside();
};

export default Collision;
