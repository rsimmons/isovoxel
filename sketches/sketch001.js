const {makeSketch} = require('./util');

makeSketch({x: 64, y: 64, z: 64}, {padFrac: 0.1}, (scene, ops) => {
  ops.fillScene(scene);
  for (let i = 0; i < 1000; i++) {
    ops.randomBox(scene, (Math.random() < 0.5) ? 0 : 1);
  }
  ops.frontCutaway(scene, 0.7);
});
