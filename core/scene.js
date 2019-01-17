const {vec3Create, vec3Copy, vec3Add, vec3AddScalar, vec3Min, vec3Max, vec3Scale, VEC3_ZERO} = require('./vec');

function createScene(size) {
  return {
    size: vec3Copy(size),
    voxel: new Uint8Array(size.x*size.y*size.z),
  };
}

// The maximum is exclusive and the minimum is inclusive
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function setVoxel(scene, x, y, z, val) {
  scene.voxel[x + scene.size.x*y + scene.size.x*scene.size.y*z] = val;
}

function toggleVoxel(scene, x, y, z) {
  scene.voxel[x + scene.size.x*y + scene.size.x*scene.size.y*z] ^= 1;
}

// Excludes "max", so if a=b nothing is drawn
function fillBox(scene, a, b, val) {
  const minV = vec3Max(VEC3_ZERO, vec3Min(a, b));
  const maxV = vec3Min(scene.size, vec3Max(a, b));

  for (let x = minV.x; x < maxV.x; x++) {
    for (let y = minV.y; y < maxV.y; y++) {
      for (let z = minV.z; z < maxV.z; z++) {
        setVoxel(scene, x, y, z, val);
      }
    }
  }
}

// Excludes "max", so if a=b nothing is changed
function toggleBox(scene, a, b, val) {
  const minV = vec3Max(VEC3_ZERO, vec3Min(a, b));
  const maxV = vec3Min(scene.size, vec3Max(a, b));

  for (let x = minV.x; x < maxV.x; x++) {
    for (let y = minV.y; y < maxV.y; y++) {
      for (let z = minV.z; z < maxV.z; z++) {
        toggleVoxel(scene, x, y, z, val);
      }
    }
  }
}

// Excludes "max". Inside is cleared
function makeHollowShell(scene, a, b, thickness) {
  fillBox(scene, a, b, 1);

  const minV = vec3Min(a, b);
  const maxV = vec3Max(a, b);
  const innerA = vec3AddScalar(minV, thickness);
  const innerB = vec3AddScalar(maxV, -thickness);
  if ((innerA.x < innerB.x) && (innerA.y < innerB.y) && (innerA.z < innerB.z)) {
    fillBox(scene, innerA, innerB, 0);
  }
}

// Includes x/y/z from 0 up to and _including_ size
function randVec(scene) {
  return vec3Create(getRandomInt(0, scene.size.x+1), getRandomInt(0, scene.size.y+1), getRandomInt(0, scene.size.z+1));
}

function randAxisUnitVec() {
  switch (Math.floor(6*Math.random())) {
    case 0:
      return {x: -1, y: 0, z: 0};

    case 1:
      return {x: 1, y: 0, z: 0};

    case 2:
      return {x: 0, y: -1, z: 0};

    case 3:
      return {x: 0, y: 1, z: 0};

    case 4:
      return {x: 0, y: 0, z: -1};

    case 5:
      return {x: 0, y: 0, z: 1};
  }

  throw new Error('unpossible');
}

function vecInsideScene(scene, vec) {
  return (vec.x >= 0) && (vec.y >= 0) && (vec.z >= 0) && (vec.x < scene.size.x) && (vec.y < scene.size.y) && (vec.z < scene.size.z);
}

function worm(scene, startVec, size, moveRepeat, kind) {
  let pos = startVec;
  let moves = 0;
  let move;
  while (vecInsideScene(scene, pos)) {
    const minCorner = {x: Math.floor(pos.x-0.5*size), y: Math.floor(pos.y-0.5*size), z: Math.floor(pos.z-0.5*size)};
    const maxCorner = vec3AddScalar(minCorner, size);

    fillBox(scene, minCorner, maxCorner, 1);

    if ((moves % moveRepeat) === 0) {
      move = vec3Scale(randAxisUnitVec(), size);
    }

    pos = vec3Add(pos, move);

    moves += 1;
  }
}

const ops = {
  fillScene: (scene) => {
    for (let i = 0; i < scene.size.x*scene.size.y*scene.size.z; i++) {
      scene.voxel[i] = 1;
    }
  },

  randomBox: (scene, val) => {
    fillBox(scene, randVec(scene), randVec(scene), val);
  },

  toggleRandomBox: (scene) => {
    toggleBox(scene, randVec(scene), randVec(scene));
  },

  randomShell: (scene, thickness) => {
    makeHollowShell(scene, randVec(scene), randVec(scene), thickness);
  },

  frontCutaway: (scene, frac) => {
    const cells = Math.floor(frac*Math.max(scene.size.x, scene.size.y));
    const b = vec3Create(cells, cells, scene.size.z);
    fillBox(scene, VEC3_ZERO, b, 0);
  },

  topFrontCutaway: (scene, frac) => {
    const cells = Math.floor(frac*Math.max(scene.size.x, scene.size.y));
    const a = vec3Create(0, 0, scene.size.z);
    const b = vec3Create(cells, cells, scene.size.z-cells);
    fillBox(scene, a, b, 0);
  },

  predicateFill: (scene, val, predicate) => {
    let i = 0;
    for (let z = 0; z < scene.size.z; z++) {
      for (let y = 0; y < scene.size.y; y++) {
        for (let x = 0; x < scene.size.x; x++) {
          if (predicate(x, y, z)) {
            scene.voxel[i] = val;
          }
          i++;
        }
      }
    }
  },

  worm: (scene, startVec, size, moveRepeat, kind) => {
    worm(scene, startVec, size, moveRepeat, kind);
  }
};

module.exports = {
  createScene,
  ops,
};
