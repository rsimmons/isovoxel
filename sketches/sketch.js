const {makeSketch} = require('./util');

makeSketch({x: 64, y: 64, z: 64}, {padFrac: 0.1}, (scene, ops) => {
  // ops.fillBox(scene, vec3Create(0, 0, 0), vec3Create(1000, 1000, 1000), 1);
  for (let i = 0; i < 1000; i++) {
    ops.randomBox(scene, (Math.random() < 0.85) ? 0 : 1);
  }
});
