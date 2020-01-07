export default class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.resize();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.draw();
    }

    draw() {
        let background = this.canvas.getContext('2d');
        background.fillStyle = 'black';
        background.fillRect(0,0,this.canvas.width, this.canvas.height);
    }
}