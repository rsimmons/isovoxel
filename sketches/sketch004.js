const {makeSketch} = require('./util');

makeSketch({x: 64, y: 64, z: 128}, {padFrac: 0.1}, (scene, ops) => {
  for (let i = 0; i < 100; i++) {
    ops.randomShell(scene, 2);
  }
  ops.predicateFill(scene, 0, (x, y, z) => ((z % 8) < 7));
  ops.frontCutaway(scene, 0.67);
});
