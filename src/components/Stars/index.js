import GameObject from '../GameObject';

class Stars extends GameObject {
  constructor(number) {
    super(0, 0, Stars.shape(number));
  }
}

Stars.generateStars = number =>
  [...Array(number)].map(() => [
    {
      cmd: 'rect',
      x: Math.random() * 1000,
      y: Math.random() * 500,
      width: 2,
      height: 2,
    },
    { cmd: 'fillStyle', style: 'white' },
    { cmd: 'fill' },
  ]).flat();

Stars.shape = (number = 10) => {
  const start = [
    { cmd: 'strokeStyle', style: 'white' },
    { cmd: 'lineWidth', width: 1 },
    { cmd: 'beginPath' },
  ];
  const end = [{ cmd: 'stroke' }];
  return start.concat(Stars.generateStars(number), end);
};

export default Stars;
