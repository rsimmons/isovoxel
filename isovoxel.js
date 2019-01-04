const fs = require('fs');

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function vec2Create(x, y) {
  return {x, y};
}

function vec3Create(x, y, z) {
  return {x, y, z};
}

const VEC3_ZERO = vec3Create(0, 0, 0);

function vec3Min(a, b) {
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    z: Math.min(a.z, b.z),
  };
}

function vec3Max(a, b) {
  return {
    x: Math.max(a.x, b.x),
    y: Math.max(a.y, b.y),
    z: Math.max(a.z, b.z),
  };
}

function setVoxel(scene, x, y, z, val) {
  scene.voxel[x + scene.size.x*y + scene.size.x*scene.size.y*z] = val;
}

function fillBox(scene, a, b, val) {
  const minV = vec3Max(VEC3_ZERO, vec3Min(a, b));
  const maxV = vec3Min(scene.size, vec3Max(a, b));

  for (let x = minV.x; x <= maxV.x; x++) {
    for (let y = minV.y; y <= maxV.y; y++) {
      for (let z = minV.z; z <= maxV.z; z++) {
        setVoxel(scene, x, y, z, val);
      }
    }
  }
}

function randVoxelVec(scene) {
  return vec3Create(getRandomInt(0, scene.size.x), getRandomInt(0, scene.size.y), getRandomInt(0, scene.size.z));
}

function createScene() {
  const scene = {
    size: vec3Create(32, 32, 64),
    voxel: null,
  };

  scene.voxel = new Uint8Array(scene.size.x*scene.size.y*scene.size.z);

  fillBox(scene, vec3Create(0, 0, 0), vec3Create(1000, 1000, 1000), 1);
  for (let i = 0; i < 200; i++) {
    fillBox(scene, randVoxelVec(scene), randVoxelVec(scene), (Math.random() < 1) ? 0 : 1);
  }

  return scene;
}

function voxelCoordToNWTriCoord(v) {
  return vec2Create(v.x - v.y, -v.x - v.y - 2*v.z);
}

const BACKGROUND_DEPTH = +Infinity;

// "round" integer down to the nearest even number. works with negatives.
function evenFloor(v) {
  return v & ~1;
}

// "round" integer up to the nearest even number. works with negatives.
function evenCeil(v) {
  return (v+1) & ~1;
}

const FACING_NONE = 0;
const FACING_UP = 1;
const FACING_LEFT = 2;
const FACING_RIGHT = 3;

function createTriGridForScene(scene) {
  // min inclusive, max exclusive
  const minX = evenFloor(voxelCoordToNWTriCoord(vec3Create(0, scene.size.y-1, 0)).x);
  const maxX = evenCeil(voxelCoordToNWTriCoord(vec3Create(scene.size.x-1, 0, 0)).x + 2);
  const minY = evenFloor(voxelCoordToNWTriCoord(vec3Create(scene.size.x-1, scene.size.y-1, scene.size.z-1)).y);
  const maxY = evenCeil(voxelCoordToNWTriCoord(VEC3_ZERO).y + 3);

  const size = vec2Create(maxX-minX, maxY-minY); // size of necessary tri grid
  const offset = vec2Create(-minX, -minY); // offset we should use to make tri coords >= 0

  const len = size.x * size.y;
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push({
      depth: BACKGROUND_DEPTH,
      facing: FACING_NONE,
    });
  }

  return {
    triGrid: {
      size,
      arr,
    },
    offset,
  };
}


function setTriGridPixel(triGrid, x, y, depth, facing) {
  const p = triGrid.arr[x + triGrid.size.x*y];
  if (p.depth > depth) {
    p.depth = depth;
    p.facing = facing;
  }
}

function renderSceneToTriGrid(scene, triGrid, offset) {
  let i = 0;
  for (let z = 0; z < scene.size.z; z++) {
    for (let y = 0; y < scene.size.y; y++) {
      for (let x = 0; x < scene.size.x; x++) {
        const val = scene.voxel[i];
        if (val) {
          const tc = voxelCoordToNWTriCoord(vec3Create(x, y, z));
          const depth = x + y - z;

          setTriGridPixel(triGrid, tc.x+offset.x+0, tc.y+offset.y+0, depth, FACING_UP);
          setTriGridPixel(triGrid, tc.x+offset.x+1, tc.y+offset.y+0, depth, FACING_UP);
          setTriGridPixel(triGrid, tc.x+offset.x+0, tc.y+offset.y+1, depth, FACING_LEFT);
          setTriGridPixel(triGrid, tc.x+offset.x+1, tc.y+offset.y+1, depth, FACING_RIGHT);
          setTriGridPixel(triGrid, tc.x+offset.x+0, tc.y+offset.y+2, depth, FACING_LEFT);
          setTriGridPixel(triGrid, tc.x+offset.x+1, tc.y+offset.y+2, depth, FACING_RIGHT);
        }
        i++;
      }
    }
  }
}

function printTriGrid(triGrid) {
  i = 0;
  for (let y = 0; y < triGrid.size.y; y++) {
    const line = triGrid.arr.slice(i, i+triGrid.size.x).map(p => ((p.depth === BACKGROUND_DEPTH) ? 'X' : p.depth)).join(' ');
    console.log(line);
    i += triGrid.size.x;
  }
}

function* generateEdgesNESW(triGrid) {
  // Conceptually we iterate over the triangles below the target edges
  for (let y = 0; y <= triGrid.size.y; y++) { // intentionally go one row past
    for (let x = (y&1); x < triGrid.size.x; x += 2) {
      const tBelow = (y === triGrid.size.y) ? null : triGrid.arr[x + triGrid.size.x*y];
      const tAbove = (y === 0) ? null : triGrid.arr[x + triGrid.size.x*(y-1)];
      const leftV = vec2Create(x, y+1);
      const rightV = vec2Create(x+1, y);

      yield {tAbove, tBelow, leftV, rightV};
    }
  }
}

function* generateEdgesNWSE(triGrid) {
  // Conceptually we iterate over the triangles below the target edges
  for (let y = 0; y <= triGrid.size.y; y++) { // intentionally go one row past
    for (let x = ((y&1) ? 0 : 1); x < triGrid.size.x; x += 2) {
      const tBelow = (y === triGrid.size.y) ? null : triGrid.arr[x + triGrid.size.x*y];
      const tAbove = (y === 0) ? null : triGrid.arr[x + triGrid.size.x*(y-1)];
      const leftV = vec2Create(x, y);
      const rightV = vec2Create(x+1, y+1);

      yield {tAbove, tBelow, leftV, rightV};
    }
  }
}

function* generateEdgesVertical(triGrid) {
  // Conceptually we iterate over the triangles to the right of the edges
  for (let y = 0; y < triGrid.size.y; y++) {
    for (let x = ((y&1) ? 0 : 1); x <= triGrid.size.x; x += 2) { // intentionally go one col past
      const tRight = (x === triGrid.size.x) ? null : triGrid.arr[x + triGrid.size.x*y];
      const tLeft = (x === 0) ? null : triGrid.arr[x-1 + triGrid.size.x*y];
      const topV = vec2Create(x, y);
      const botV = vec2Create(x, y+2);

      yield {tLeft, tRight, topV, botV};
    }
  }
}

function combineSegments(segments) {
  const result = [];

  // Segment we are building but have not yet "emittted"
  let openSeg;

  function emitAnySeg() {
    if (openSeg) {
      result.push(openSeg);
      openSeg = undefined;
    }
  }

  for (const seg of segments) {
    if (!openSeg || (seg[0].x !== openSeg[1].x) || (seg[0].y !== openSeg[1].y)) {
      emitAnySeg();
      openSeg = [{x: seg[0].x, y: seg[0].y}, {x: seg[1].x, y: seg[1].y}]; // clone seg
    } else {
      openSeg[1].x = seg[1].x;
      openSeg[1].y = seg[1].y;
    }
  }
  emitAnySeg();

  return result;
}

function triGridToDumbSegments(triGrid) {
  const segmentsNESW = [];
  for (const {tAbove, tBelow, leftV, rightV} of generateEdgesNESW(triGrid)) {
    let draw = false;
    const tAboveFacing = tAbove ? tAbove.facing : FACING_NONE;
    const tBelowFacing = tBelow ? tBelow.facing : FACING_NONE;
    if (tAboveFacing !== tBelowFacing) {
      draw = true;
    } else if (tAboveFacing && (tAboveFacing === tBelowFacing)) {
      // facings are same and not NONE. neither tri will be null
      draw = !(
        ((tAboveFacing === FACING_UP) && (tAbove.depth === (tBelow.depth+1))) ||
        ((tAboveFacing === FACING_LEFT) && (tAbove.depth === tBelow.depth)) ||
        ((tAboveFacing === FACING_RIGHT) && (tAbove.depth === (tBelow.depth-1)))
      );
    }

    if (draw) {
      segmentsNESW.push([leftV, rightV]);
    }
  }
  for (const seg of segmentsNESW) {
    if ((seg[0].x + seg[0].y) & 1) {
      [seg[0], seg[1]] = [seg[1], seg[0]];
    }
  }
  segmentsNESW.sort((a, b) => {
    const aPri = a[0].x+a[0].y;
    const aSec = a[0].y;

    const bPri = b[0].x+b[0].y;
    const bSec = b[0].y;

    if (aPri === bPri) {
      return ((aPri & 1) ? 1 : -1)*(aSec - bSec);
    } else {
      return aPri - bPri;
    }
  });

  const segmentsNWSE = [];
  for (const {tAbove, tBelow, leftV, rightV} of generateEdgesNWSE(triGrid)) {
    let draw = false;
    const tAboveFacing = tAbove ? tAbove.facing : FACING_NONE;
    const tBelowFacing = tBelow ? tBelow.facing : FACING_NONE;
    if (tAboveFacing !== tBelowFacing) {
      draw = true;
    } else if (tAboveFacing && (tAboveFacing === tBelowFacing)) {
      // facings are same and not NONE. neither tri will be null
      draw = !(
        ((tAboveFacing === FACING_UP) && (tAbove.depth === (tBelow.depth+1))) ||
        ((tAboveFacing === FACING_LEFT) && (tAbove.depth === (tBelow.depth-1))) ||
        ((tAboveFacing === FACING_RIGHT) && (tAbove.depth === tBelow.depth))
      );
    }

    if (draw) {
      segmentsNWSE.push([leftV, rightV]);
    }
  }
  for (const seg of segmentsNWSE) {
    if ((seg[0].y - seg[0].x) & 1) {
      [seg[0], seg[1]] = [seg[1], seg[0]];
    }
  }
  segmentsNWSE.sort((a, b) => {
    const aPri = a[0].y-a[0].x;
    const aSec = a[0].y;

    const bPri = b[0].y-b[0].x;
    const bSec = b[0].y;

    if (aPri === bPri) {
      return ((aPri & 1) ? -1 : 1)*(aSec - bSec);
    } else {
      return aPri - bPri;
    }
  });

  const segmentsVertical = [];
  for (const {tLeft, tRight, topV, botV} of generateEdgesVertical(triGrid)) {
    let draw = false;
    const tLeftFacing = tLeft ? tLeft.facing : FACING_NONE;
    const tBelowFacing = tRight ? tRight.facing : FACING_NONE;
    if (tLeftFacing !== tBelowFacing) {
      draw = true;
    } else if (tLeftFacing && (tLeftFacing === tBelowFacing)) {
      // facings are same and not NONE. neither tri will be null
      draw = !(
        ((tLeftFacing === FACING_UP) && (tLeft.depth === tRight.depth)) ||
        ((tLeftFacing === FACING_LEFT) && (tLeft.depth === (tRight.depth+1))) ||
        ((tLeftFacing === FACING_RIGHT) && (tLeft.depth === (tRight.depth-1)))
      );
    }

    if (draw) {
      segmentsVertical.push([topV, botV]);
    }
  }
  for (const seg of segmentsVertical) {
    if (seg[0].x & 1) {
      [seg[0], seg[1]] = [seg[1], seg[0]];
    }
  }
  segmentsVertical.sort((a, b) => {
    const aPri = a[0].x;
    const aSec = a[0].y;

    const bPri = b[0].x;
    const bSec = b[0].y;

    if (aPri === bPri) {
      return ((aPri & 1) ? -1 : 1)*(aSec - bSec);
    } else {
      return aPri - bPri;
    }
  });

  return [].concat(combineSegments(segmentsNESW), combineSegments(segmentsNWSE), combineSegments(segmentsVertical));
}

function segmentsToSVG(triGrid, segments, padFrac) {
  const pathPieces = [];
  for (const seg of segments) {
    pathPieces.push(`M ${seg[0].x} ${seg[0].y} L ${seg[1].x} ${seg[1].y}`);
  }

  const pathStr = pathPieces.join(' ');

  // Makes all triangles equilateral with side length 1
  const scaleX = 0.5*Math.sqrt(3);
  const scaleY = 0.5;

  const unframedWidth = scaleX*triGrid.size.x;
  const unframedHeight = scaleY*triGrid.size.y;
  const frameDim = padFrac*Math.max(unframedWidth, unframedHeight);
  const viewBoxOrigX = -frameDim;
  const viewBoxOrigY = -frameDim;
  const viewBoxWidth = unframedWidth + 2*frameDim;
  const viewBoxHeight = unframedHeight + 2*frameDim;

  return `<svg viewBox="${viewBoxOrigX} ${viewBoxOrigY} ${viewBoxWidth} ${viewBoxHeight}" xmlns="http://www.w3.org/2000/svg"><path transform="scale(${scaleX} ${scaleY})" stroke="black" stroke-width="0.3" stroke-linecap="round" d="${pathStr}" /></svg>`;
}

const scene = createScene();
const {triGrid, offset} = createTriGridForScene(scene);
renderSceneToTriGrid(scene, triGrid, offset);
// printTriGrid(triGrid);
const segments = triGridToDumbSegments(triGrid);
const svg = segmentsToSVG(triGrid, segments, 0.1);
fs.writeFileSync('out.svg', svg);
