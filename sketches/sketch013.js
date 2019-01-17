const {makeSketch} = require('./util');

// This is meant to be approximately square and have thicker lines for laser cutting

makeSketch({x: 96, y: 96, z: 36}, {padFrac: 0.1}, (scene, ops) => {
  for (let i = 0; i < 30; i++) {
    ops.randomShell(scene, 1);
  }

  ops.predicateFill(scene, 0, (x, y, z) => ((x % 10) < 3));
  ops.predicateFill(scene, 0, (x, y, z) => ((y % 8) < 2));
  // ops.predicateFill(scene, 0, (x, y, z) => ((z % 16) < 2));

  for (let i = 0; i < 8; i++) {
    ops.randomBox(scene, 1);
  }

/*
  for (let i = 0; i < 8; i++) {
    ops.randomBox(scene, 0);
  }
*/

  ops.predicateFill(scene, 0, (x, y, z) => {
    const xy = (x & ~7) + (y & ~7);
    const width = 32;
    const midXY = 0.5*scene.size.x + 0.5*scene.size.y;
    return (xy < (midXY - width)) || (xy > (midXY + width));
  });

  // ops.frontCutaway(scene, 0.5);
});
