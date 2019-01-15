const fs = require('fs');
const path = require('path');

// The min/max bounds is rounded inward to be safe
const sizeSpecs = {
  '24x12': {
    min: {x: -272, y: 5},
    max: {x: 268, y: 268},
    mmPerUnit: 1.1024794,
  },
  P2: {
    min: {x: 15, y: 15},
    max: {x: 1102, y: 1102},
    mmPerUnit: 0.3527778,
  },
};

function getPathsBounds(paths) {
  const min = {x: Infinity, y: Infinity};
  const max = {x: -Infinity, y: -Infinity};

  for (const path of paths) {
    for (const v of path) {
      if (v.x < min.x) {
        min.x = v.x;
      }
      if (v.x > max.x) {
        max.x = v.x;
      }
      if (v.y < min.y) {
        min.y = v.y;
      }
      if (v.y > max.y) {
        max.y = v.y;
      }
    }
  }

  return {min, max};
}

function getTransfromToFit(fromBounds, toBounds) {
}

function cutPathsToPonokoSVG(paths, sizeStr) {
  const pieces = [];

  pieces.push('<g id="isovoxel" fill="none" stroke="rgb(0,0,255)" stroke-width="0.01mm">\n');
  for (const path of paths) {
    pieces.push('<path d="');
    for (let i = 0; i < path.length; i++) {
      const p = path[i];
      pieces.push(`${i ? 'L' : 'M'} ${p.x} ${p.y} `);
    }
    pieces.push('Z" />\n');
  }
  pieces.push('</g>\n');

  // Size to fit
  // const designBounds = getPathsBounds(paths);

  /*
  // FOR VERIFYING SPECS
  const spec = sizeSpecs[sizeStr];
  pieces.length = 0;
  pieces.push(`<rect x="${spec.min.x}" y="${spec.min.y}" width="${spec.max.x-spec.min.x}" height="${spec.max.y-spec.min.y}" fill="none" stroke-width="0.01mm" stroke="rgb(0,0,255)" />`);
  */

  const PLACEHOLDER = '<g id="REPLACEME" />';
  const templateFileStr = fs.readFileSync(path.resolve(__dirname, 'templates/' + sizeStr + '.svg'), 'utf8');
  return templateFileStr.replace(PLACEHOLDER, pieces.join(''));
}

module.exports = {
  cutPathsToPonokoSVG,
};
