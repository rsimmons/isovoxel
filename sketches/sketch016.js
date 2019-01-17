const {makeSketch} = require('./util');

makeSketch({x: 64, y: 64, z: 128}, {padFrac: 0.1}, (scene, ops) => {
  for (let i = 0; i < 180; i++) {
    ops.worm(scene, {x: Math.floor(64*Math.random()), y: Math.floor(64*Math.random()), z: (Math.random() < 0.5) ? 0 : 127}, 1+Math.floor(3*Math.random()), 2+Math.floor(2*Math.random()));
  }
});
