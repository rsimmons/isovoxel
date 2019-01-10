const {makeSketch} = require('./util');

makeSketch({x: 64, y: 64, z: 128}, {padFrac: 0.1}, (scene, ops) => {
  for (let i = 0; i < 200; i++) {
    ops.randomBox(scene, (Math.random() < 0.3) ? 1 : 0);
  }
  ops.predicateFill(scene, 0, (x, y, z) => ((z % 4) < 3));
  ops.frontCutaway(scene, 0.67);
});
