import drawElements from '../Draw';

class GameObject {
  constructor(x, y, shape) {
    this.x = x;
    this.y = y;
    this.shape = shape;
  }

  draw(context) {
    drawElements(context).execute(this.shape);
  }
}

export default GameObject;
