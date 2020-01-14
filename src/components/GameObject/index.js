import drawElements from '../Draw';

class GameObject {
  constructor(x, y, shape) {
    this.x = x;
    this.y = y;
    this.shape = shape;
  }

  draw(context) {
    this.drawShape(context, this.shape);
  }

  drawShape(context, shape) {
    drawElements(context).execute(shape);
  }
}

export default GameObject;
