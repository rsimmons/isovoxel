const {makeSketch} = require('./util');

makeSketch({x: 256, y: 256, z: 256}, {padFrac: 0}, (scene, ops) => {
  for (let i = 0; i < 512; i++) {
    ops.worm(scene, {x: Math.floor(256*Math.random()), y: Math.floor(256*Math.random()), z: (Math.random() < 0.5) ? 0 : 255}, 1+Math.floor(3*Math.random()), 2+Math.floor(2*Math.random()));
  }
});
