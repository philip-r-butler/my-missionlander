const Collision = function(obj1, obj2) {
  this.obj1 = obj1;
  this.obj2 = obj2;
  this.exists = false;
  this.x = undefined;
  this.y = undefined;

  this.isCollision = this.isCollision.bind(this);
};

Collision.prototype.isCollision = function(key) {
  return this.cp1[key] > this.cp2[Math.floor(parseFloat(key))];
};

Collision.prototype.isInside = function() {
  return Object.keys(this.cp1).every(key => this.cp2[Math.floor(key)]);
};

Collision.prototype.update = function() {
  this.cp1 = this.obj1.collisionPoints;
  this.cp2 = this.obj2.collisionPoints;

  this.exists = Object.keys(this.cp1).some(this.isCollision);

  if (this.exists) {
    this.x = Object.keys(this.cp1).filter(this.isCollision)[0];
    this.y = this.cp2[this.x];
  }

  this.inside = this.isInside();
  // console.log(this.inside);
};

export default Collision;
