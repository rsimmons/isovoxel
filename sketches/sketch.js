const fs = require('fs');

const {createScene, fillBox, randVoxelVec} = require('../lib/scene');
const {renderSceneToSVG} = require('../lib/render');

const scene = createScene(64, 64, 64);

// fillBox(scene, vec3Create(0, 0, 0), vec3Create(1000, 1000, 1000), 1);
for (let i = 0; i < 1000; i++) {
  fillBox(scene, randVoxelVec(scene), randVoxelVec(scene), (Math.random() < 0.85) ? 0 : 1);
}

const svg = renderSceneToSVG(scene, {padFrac: 0.1});
fs.writeFileSync('out.svg', svg);
