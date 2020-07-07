const GameCanvas = function(window, canvases) {
  this.window = window;
  this.keys = Object.keys(canvases);
  this.canvases = this.keys.reduce((acc, key) => {
    const canvas = this.window.document.getElementById(key);
    const context = canvas.getContext('2d');
    acc[key] = { canvas, context, gameObjects: canvases[key] };
    return acc;
  }, {});
  this.setSize();
};

GameCanvas.prototype.draw = function() {
  this.keys.forEach(key =>
    this.canvases[key].gameObjects.draw(this.canvases[key].context)
  );
};

GameCanvas.prototype.setDoDraw = function(keys, value) {
  keys.forEach(key => (this.canvases[key].gameObjects.doDraw = value));
};

GameCanvas.prototype.update = function() {};

GameCanvas.prototype.setSize = function() {
  this.width = this.window.innerWidth;
  this.height = this.window.innerHeight;

  Object.keys(this.canvases).forEach(key => {
    this.canvases[key].canvas.width = this.width;
    this.canvases[key].canvas.height = this.height;
  });
};

export default GameCanvas;
