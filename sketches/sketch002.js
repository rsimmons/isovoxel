const {makeSketch} = require('./util');

makeSketch({x: 64, y: 64, z: 128}, {padFrac: 0.1}, (scene, ops) => {
  // ops.predicateFill(scene, 1, (x, y, z) => (((x % 8) < 4) && ((y % 8) < 4) && ((z % 8) < 4)));
  ops.predicateFill(scene, 1, (x, y, z) => (((x % 8) < 3) && ((y % 8) < 3)));
  // ops.predicateFill(scene, 1, (x, y, z) => ((y % 4) < 1));
  // ops.predicateFill(scene, 0, (x, y, z) => ((z % 8) < 2));
  for (let i = 0; i < 200; i++) {
    ops.randomShell(scene, 1);
    // ops.randomBox(scene, 0);
  }
  ops.frontCutaway(scene, 0.5);
});
