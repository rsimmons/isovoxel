const {makeSketch} = require('./util');

// Sized to be close to 2x1 to fit Ponoko materials of that shape
makeSketch({x: 64, y: 64, z: 172}, {padFrac: 0.1}, (scene, ops) => {
  for (let i = 0; i < 200; i++) {
    ops.randomShell(scene, 1);
  }
  ops.predicateFill(scene, 0, (x, y, z) => ((x % 8) < 2));
  ops.predicateFill(scene, 0, (x, y, z) => ((z % 16) < 4));
  ops.frontCutaway(scene, 0.5);
});
