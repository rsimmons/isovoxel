const {makeSketch} = require('./util');

// This is meant to be approximately square and have thicker lines for laser cutting

makeSketch({x: 32, y: 32, z: 40}, {padFrac: 0.1}, (scene, ops) => {
  for (let i = 0; i < 100; i++) {
    ops.randomShell(scene, 1);
  }
  // for (let i = 0; i < 10; i++) {
  //   ops.randomBox(scene, 0);
  // }

  ops.predicateFill(scene, 0, (x, y, z) => ((x % 8) < 2));
  ops.predicateFill(scene, 0, (x, y, z) => ((y % 8) < 2));
  ops.frontCutaway(scene, 0.5);
});
