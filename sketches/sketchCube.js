const {makeSketch} = require('./util');

makeSketch({x: 16, y: 16, z: 16}, {padFrac: 0.1}, (scene, ops) => {
  ops.fillScene(scene);
});
