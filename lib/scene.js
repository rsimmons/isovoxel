const {vec3Create, vec3Copy, vec3AddScalar, vec3Min, vec3Max, VEC3_ZERO} = require('./vec');

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

const ops = {
  fillScene: (scene) => {
    for (let i = 0; i < scene.size.x*scene.size.y*scene.size.z; i++) {
      scene.voxel[i] = 1;
    }
  },

  randomBox: (scene, val) => {
    fillBox(scene, randVec(scene), randVec(scene), val);
  },

  randomShell: (scene, thickness) => {
    makeHollowShell(scene, randVec(scene), randVec(scene), thickness);
  },

  frontCutaway: (scene, frac) => {
    const cells = Math.floor(frac*Math.max(scene.size.x, scene.size.y));
    const b = vec3Create(cells, cells, scene.size.z);
    fillBox(scene, VEC3_ZERO, b, 0);
  },
};

module.exports = {
  createScene,
  ops,
};
