const {makeSketch} = require('./util');

// This is meant to be approximately square and have thicker lines for laser cutting

makeSketch({x: 32, y: 32, z: 90}, {padFrac: 0.1}, (scene, ops) => {
  for (let i = 0; i < 200; i++) {
    ops.randomShell(scene, 1);
  }

  ops.predicateFill(scene, 0, (x, y, z) => ((x % 8) < 2));
  ops.predicateFill(scene, 0, (x, y, z) => ((y % 8) < 2));
  // ops.predicateFill(scene, 0, (x, y, z) => ((z % 16) < 2));

  for (let i = 0; i < 4; i++) {
    ops.randomShell(scene, 1);
  }

  ops.frontCutaway(scene, 0.5);
});
