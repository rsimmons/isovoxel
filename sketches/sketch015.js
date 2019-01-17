const {makeSketch} = require('./util');

makeSketch({x: 64, y: 64, z: 128}, {padFrac: 0.1}, (scene, ops) => {
  for (let i = 0; i < 128; i++) {
    ops.worm(scene, {x: 32, y: 32, z: 64}, 1+Math.floor(3*Math.random()), 2+Math.floor(2*Math.random()));
  }
});
