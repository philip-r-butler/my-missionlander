import Lander from 'components/Lander';

const GameInformation = function(global) {
  this.window = global;
  this.setDisplayNodes();
  this.score = 0;
  this.startTime = Date.now();
  this.time = '';
};

GameInformation.prototype.setDisplayNodes = function() {
  this.displayScore = this.window.document.getElementById('score');
  this.displayTime = this.window.document.getElementById('time');
  this.displayFuel = this.window.document.getElementById('fuel');
  this.displayAltitude = this.window.document.getElementById('altitude');
  this.displayHSpeed = this.window.document.getElementById('hSpeed');
  this.displayVSpeed = this.window.document.getElementById('vSpeed');
};

GameInformation.prototype.update = function(lander, collisionPoints) {
  this.score = 0;
  this.time = this.formatElapsedTime();
  this.fuel = this.formatFuel(lander.fuel);
  this.altitude = this.formatAltitude(
    lander.x + Lander.halfWidth,
    lander.x - Lander.halfWidth,
    lander.y - Lander.halfHeight,
    collisionPoints
  );
  this.hSpeed = this.formatSpeed(lander.deltaX);
  this.vSpeed = this.formatSpeed(lander.deltaY);
};

GameInformation.prototype.formatElapsedTime = function() {
  const seconds = this.getElapsedSeconds();
  const minutes = Math.floor(seconds / 60);
  return minutes.toString().padStart(2, '0') + ':' + Math.floor(seconds - (minutes * 60)).toString().padStart(2, '0');
};

GameInformation.prototype.formatFuel = function(fuel) {
  return Math.floor(fuel).toString();
};

GameInformation.prototype.formatAltitude = function(x1, x2, y, floor) {
  return Math.floor(
    Math.min(floor[Math.floor(x1)], floor[Math.floor(x2)]) - y
  ).toString();
};

GameInformation.prototype.formatSpeed = function(delta) {
  return Math.floor(delta * 100).toString();
};

GameInformation.prototype.getElapsedSeconds = function() {
  return Math.max((180) - (Date.now() - this.startTime) / 1000, 0);
};

GameInformation.prototype.draw = function() {
  this.displayScore.innerText = this.score;
  this.displayTime.innerText = this.time;
  this.displayFuel.innerText = this.fuel;
  this.displayAltitude.innerText = this.altitude;
  this.displayHSpeed.innerText = this.hSpeed;
  this.displayVSpeed.innerText = this.vSpeed;
};

export default GameInformation;
