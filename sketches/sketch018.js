const {makeSketch} = require('./util');

makeSketch({x: 64, y: 64, z: 128}, {padFrac: 0.1}, (scene, ops) => {
  for (let i = 0; i < 200; i++) {
    ops.randomShell(scene, 1);
  }

  ops.predicateFill(scene, 0, (x, y, z) => ((x % 16) < 4));
  ops.predicateFill(scene, 0, (x, y, z) => ((y % 32) < 4));
  ops.predicateFill(scene, 0, (x, y, z) => ((z % 16) < 4));

  ops.frontCutaway(scene, 0.67);

  for (let i = 0; i < 512; i++) {
    ops.worm(scene, {x: Math.floor(64*Math.random()), y: Math.floor(64*Math.random()), z: 0}, 1+Math.floor(3*Math.random()), 2+Math.floor(2*Math.random()));
    // ops.worm(scene, {x: 56, y: 56, z: 0}, 1+Math.floor(3*Math.random()), 2+Math.floor(2*Math.random()));
  }

});
