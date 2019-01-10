const fs = require('fs');

const {createScene, ops, renderScene} = require('isovoxel-core');

function makeSketch(size, svgOpts, genFunc) {
  const scene = createScene(size);

  genFunc(scene, ops);

  const {svg, uncombinedSegments} = renderScene(scene, svgOpts);
  fs.writeFileSync('out.svg', svg);
  fs.writeFileSync('out_uncombined_segments.json', JSON.stringify(uncombinedSegments));
}

module.exports = {
  makeSketch,
};
