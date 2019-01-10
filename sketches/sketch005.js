const {makeSketch} = require('./util');

makeSketch({x: 64, y: 64, z: 64}, {padFrac: 0.1}, (scene, ops) => {
  for (let i = 0; i < 200; i++) {
    // ops.randomBox(scene, (Math.random() < 0.3) ? 1 : 0);
    ops.randomShell(scene, 1);
  }
  const cx = 0.5*scene.size.x, cy = 0.5*scene.size.y, cz = 0.5*scene.size.z;
  // ops.predicateFill(scene, 0, (x, y, z) => (((cx - x)**2 + (cy - y)**2 + (cz - z)**2) > (32**2)));
  ops.predicateFill(scene, 0, (x, y, z) => (((cx - x)**2 + (cy - y)**2) > (32**2)));
  ops.topFrontCutaway(scene, 0.5);
});
