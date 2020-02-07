import Particle from 'components/Particle';

const Explosion = function(numOfParticles, landscape) {
  this.active = false;
  this.landscape = landscape;
  this.makeParticles(numOfParticles);
};

Explosion.prototype.makeParticles = function(num) {
  this.particles = Array.from({ length: num }, (_, i) => i);
};

Explosion.prototype.start = function({ x, y, deltaX, deltaY }) {
  this.active = true;
  this.particles = this.particles.map(() => new Particle(x, y, deltaX, deltaY, this.landscape));
};

Explosion.prototype.isAlive = function() {
  return this.particles.some(Explosion.particleAlive);
};

Explosion.prototype.update = function() {
  this.particles.forEach(Explosion.particleUpdate);
};

Explosion.prototype.draw = function(context) {
  const particleDraw = Explosion.particleDraw(context);
  this.particles.forEach(particleDraw);
};

Explosion.particleUpdate = particle => particle.update();
Explosion.particleAlive = particle => particle.alive;
Explosion.particleDraw = context => particle => particle.draw(context);

export default Explosion;
