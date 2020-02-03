import Particle from 'components/Particle';

const Explosion = function(numOfParticles, landscape) {
  this.active = false;
  this.particles = Array.from({ length: numOfParticles }, (_, i) => i);
  this.landscape = landscape;
};

Explosion.prototype.explode = function({ x, y, deltaX, deltaY }) {
  this.active = true;
  this.particles = this.particles.map(() => new Particle(x, y, deltaX, deltaY, this.landscape));
};

Explosion.prototype.isAlive = function() {
  return this.particles.some(particle => particle.alive);
};

Explosion.prototype.update = function() {
  if (!this.active) return;
  this.particles.forEach(particle => particle.update());
};

Explosion.prototype.draw = function(context) {
  if (!this.active) return;
  this.particles.forEach(particle => particle.draw(context));
};

export default Explosion;
