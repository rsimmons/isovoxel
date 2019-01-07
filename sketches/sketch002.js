const {makeSketch} = require('./util');

makeSketch({x: 64, y: 64, z: 64}, {padFrac: 0.1}, (scene, ops) => {
  for (let i = 0; i < 300; i++) {
    ops.randomShell(scene, 1);
  }
  ops.topFrontCutaway(scene, 0.75);
});
