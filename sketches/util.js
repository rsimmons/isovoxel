const fs = require('fs');

const {createScene, ops} = require('../lib/scene');
const {renderSceneToSVG} = require('../lib/render');

function makeSketch(size, svgOpts, genFunc) {
  const scene = createScene(size);

  genFunc(scene, ops);

  const svg = renderSceneToSVG(scene, svgOpts);
  fs.writeFileSync('out.svg', svg);
}

module.exports = {
  makeSketch,
};
