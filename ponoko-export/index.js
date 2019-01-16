const fs = require('fs');
const path = require('path');

// The min/max bounds is rounded inward to be safe
const sizeSpecs = {
  '24x12': {
    bounds: {
      min: {x: -272, y: 5},
      max: {x: 268, y: 268},
    },
    mmPerUnit: 1.1024794,
  },
  P2: {
    bounds: {
      min: {x: 15, y: 15},
      max: {x: 1102, y: 1102},
    },
    mmPerUnit: 0.3527778,
  },
  P3: {
    bounds: {
      min: {x: 15, y: 15},
      max: {x: 2253, y: 1102},
    },
    mmPerUnit: 0.356,
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

function getTransformToFit(fromBounds, toBounds) {
  const xScale = (toBounds.max.x - toBounds.min.x)/(fromBounds.max.x - fromBounds.min.x);
  const yScale = (toBounds.max.y - toBounds.min.y)/(fromBounds.max.y - fromBounds.min.y);
  const scale = Math.min(xScale, yScale);

  const scaledFromCenter = {
    x: scale*0.5*(fromBounds.min.x + fromBounds.max.x),
    y: scale*0.5*(fromBounds.min.y + fromBounds.max.y),
  };

  const toCenter = {
    x: 0.5*(toBounds.min.x + toBounds.max.x),
    y: 0.5*(toBounds.min.y + toBounds.max.y),
  };

  const offset = {
    x: toCenter.x - scaledFromCenter.x,
    y: toCenter.y - scaledFromCenter.y,
  };

  return {scale, offset};
}

function cutPathsToPonokoSVG(paths, sizeStr, rotate) {
  let rotPaths;
  if (rotate) {
    rotPaths = [];
    for (const path of paths) {
      const rotPath = [];
      for (const v of path) {
        rotPath.push({x: -v.y, y: v.x});
      }
      rotPaths.push(rotPath);
    }
  } else {
    rotPaths = paths;
  }

  // Size to fit
  const designBounds = getPathsBounds(rotPaths);
  const templateBounds = sizeSpecs[sizeStr].bounds;
  const {scale, offset} = getTransformToFit(designBounds, templateBounds);

  const sizedPaths = [];
  for (const path of rotPaths) {
    const sizedPath = [];
    for (const v of path) {
      sizedPath.push({x: scale*v.x + offset.x, y: scale*v.y + offset.y});
    }
    sizedPaths.push(sizedPath);
  }

  const pieces = [];
  pieces.push('<g id="isovoxel" fill="none" stroke="rgb(0,0,255)" stroke-width="0.01mm">\n');
  for (const path of sizedPaths) {
    pieces.push('<path d="');
    for (let i = 0; i < path.length; i++) {
      const p = path[i];
      pieces.push(`${i ? 'L' : 'M'} ${p.x} ${p.y} `);
    }
    pieces.push('Z" />\n');
  }
  pieces.push('</g>\n');

  const PLACEHOLDER = '<g id="REPLACEME" />';
  const templateFileStr = fs.readFileSync(path.resolve(__dirname, 'templates/' + sizeStr + '.svg'), 'utf8');
  return {
    svg: templateFileStr.replace(PLACEHOLDER, pieces.join('')),
    mmPerInputUnit: sizeSpecs[sizeStr].mmPerUnit*scale,
  };
}

module.exports = {
  cutPathsToPonokoSVG,
};
