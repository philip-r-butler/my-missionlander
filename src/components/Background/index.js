import drawElements from '../Draw';

class Background {
  constructor(color, width, height) {
    this.color = color;
    this.setSize(width, height);
  }

  setSize(width, height){
    this.width = width;
    this.height = height;
  }

  draw(context) {
    const shape = [
      { cmd: 'fillStyle', style: this.color },
      { cmd: 'fillRect', x: 0, y: 0, width: this.width, height: this.height },
    ];
    drawElements(context).execute(shape);
  }
}

export default Background;
