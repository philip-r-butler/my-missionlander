import drawElements from '../Draw';

const GameObject = function(x, y, shape) {
  this.x = x;
  this.y = y;
  this.shape = shape;
  this.doDraw = true;
  this.doUpdate = true;
};

GameObject.prototype.setSize = function(width, height) {
  this.width = width;
  this.height = height;
};

GameObject.prototype.draw = function(context) {
  this.drawShape(context, this.shape);
};

GameObject.prototype.drawShape = function(context, shape) {
  this.doDraw && drawElements(context).execute(shape);
};

export default GameObject;
