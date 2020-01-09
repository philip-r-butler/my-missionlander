const drawElements = context => ({
  execute: obj =>
    obj.forEach(element => command(context)[element.cmd](element)),
});

const command = context => ({
  strokeStyle: ({ style }) => (context.strokeStyle = style),
  beginPath: () => context.beginPath(),
  moveTo: ({ x, y }) => context.moveTo(x, y),
  translate: ({ x, y }) => context.translate(x, y),
  lineTo: ({ x, y }) => context.lineTo(x, y),
  lineWidth: ({ width }) => (context.lineWidth = width),
  closePath: () => context.closePath(),
  stroke: () => context.stroke(),
  rect: ({ x, y, width, height }) => context.rect(x, y, width, height),
  fillStyle: ({ style }) => (context.fillStyle = style),
  fillRect: ({ x, y, width, height }) => context.fillRect(x, y, width, height),
});

export default drawElements;
