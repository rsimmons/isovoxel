const {makeSketch} = require('./util');

makeSketch({x: 64, y: 64, z: 180}, {padFrac: 0.1}, (scene, ops) => {
  for (let i = 0; i < 200; i++) {
    if (Math.random() < 0.9) {
      ops.randomShell(scene, 2);
    } else {
      ops.randomBox(scene, (Math.random() < 0.5) ? 1 : 0);
    }
  }
  ops.predicateFill(scene, 0, (x, y, z) => ((x % 8) < 4));
  ops.predicateFill(scene, 0, (x, y, z) => ((y % 12) < 4));
  // ops.predicateFill(scene, 0, (x, y, z) => ((z % 32) < 1));
  ops.frontCutaway(scene, 0.67);
});
