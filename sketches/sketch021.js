const {makeSketch} = require('./util');

makeSketch({x: 128, y: 128, z: 128}, {padFrac: 0.1}, (scene, ops) => {
  // ops.makeHollowShell(scene, {x: 0, y: 0, z: 0}, {x: scene.size.x, y: scene.size.y, z: 8}, 1);

  const RAD = 16;
  ops.fillBox(scene, {x: 64-RAD, y: 64-RAD, z: 0}, {x: 64+RAD, y: 64+RAD, z: 128}, 1);
  ops.predicateFill(scene, 0, (x, y, z) => ((z % 16) >= 12));

  for (let i = 0; i < 96; i++) {
    ops.worm(scene, {x: 64, y: 64, z: 96}, 1+Math.floor(3*Math.random()), 2+Math.floor(2*Math.random()));
  }

  ops.frontCutaway(scene, 0.5);
});
