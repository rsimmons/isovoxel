const {makeSketch} = require('./util');

makeSketch({x: 128, y: 128, z: 128}, {padFrac: 0.1}, (scene, ops) => {
/*
  for (let i = 0; i < 256; i++) {
    ops.randomShell(scene, 1);
  }
  const IN = 32;
  ops.predicateFill(scene, 0, (x, y, z) => ((x < IN) || (y < IN) || (x >= (scene.size.x-IN)) || (y >= (scene.size.y-IN)) || (z >= 32)));
*/

  ops.makeHollowShell(scene, {x: 0, y: 0, z: 0}, {x: scene.size.x, y: scene.size.y, z: 8}, 1);
  ops.predicateFill(scene, 0, (x, y, z) => ((y % 16) < 6));

  for (let i = 0; i < 128; i++) {
    ops.worm(scene, {x: 64, y: 64, z: 64}, 1+Math.floor(3*Math.random()), 2+Math.floor(2*Math.random()));
  }

  const RAD = 6;
  ops.makeHollowShell(scene, {x: 64-RAD, y: 64-RAD, z: 0}, {x: 64+RAD, y: 64+RAD, z: 128}, 1);

  // ops.predicateFill(scene, 0, (x, y, z) => ((x % 16) < 4));
  // ops.predicateFill(scene, 0, (x, y, z) => ((z % 16) < 4));

  ops.frontCutaway(scene, 0.5);
});
