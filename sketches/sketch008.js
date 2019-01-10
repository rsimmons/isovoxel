const {makeSketch} = require('./util');

makeSketch({x: 96, y: 96, z: 96}, {padFrac: 0.1}, (scene, ops) => {
  ops.predicateFill(scene, 1, (x, y, z) => ((y % 8) < 1));
  for (let i = 0; i < 200; i++) {
    ops.randomShell(scene, 1);
  }
  for (let i = 0; i < 20; i++) {
    ops.randomBox(scene, 0);
  }
  ops.topFrontCutaway(scene, 0.67);
});
