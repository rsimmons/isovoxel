const {makeSketch} = require('./util');

makeSketch({x: 64, y: 64, z: 64}, {padFrac: 0.1}, (scene, ops) => {
  for (let i = 0; i < 200; i++) {
    ops.randomShell(scene, 1);
  }
  ops.predicateFill(scene, 0, (x, y, z) => ((x % 16) < 4));
  ops.predicateFill(scene, 0, (x, y, z) => ((y % 16) < 4));
  ops.predicateFill(scene, 0, (x, y, z) => ((z % 16) < 4));
  ops.topFrontCutaway(scene, 0.75);
});
