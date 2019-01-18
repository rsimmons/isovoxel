const {makeSketch} = require('./util');

makeSketch({x: 128, y: 128, z: 128}, {padFrac: 0.1}, (scene, ops) => {
  function wormsFrom(pos) {
    for (let i = 0; i < 96; i++) {
      ops.worm(scene, pos, 1+Math.floor(5*Math.random()), 2+Math.floor(2*Math.random()));
    }
  }

  const OFFSET = 8;
  wormsFrom({x: OFFSET, y: OFFSET, z: OFFSET});
  wormsFrom({x: scene.size.x-1-OFFSET, y: OFFSET, z: OFFSET});
  wormsFrom({x: OFFSET, y: scene.size.y-1-OFFSET, z: OFFSET});
  wormsFrom({x: scene.size.x-1-OFFSET, y: scene.size.y-1-OFFSET, z: OFFSET});
  // wormsFrom({x: OFFSET, y: OFFSET, z: scene.size.z-1-OFFSET}); // FRONT CORNER
  wormsFrom({x: scene.size.x-1-OFFSET, y: OFFSET, z: scene.size.z-1-OFFSET});
  wormsFrom({x: OFFSET, y: scene.size.y-1-OFFSET, z: scene.size.z-1-OFFSET});
  wormsFrom({x: scene.size.x-1-OFFSET, y: scene.size.y-1-OFFSET, z: scene.size.z-1-OFFSET});
});
