const {vec3Create, vec3Min, vec3Max, VEC3_ZERO} = require('./vec');

function createScene(sizeX, sizeY, sizeZ) {
  return {
    size: vec3Create(sizeX, sizeY, sizeZ),
    voxel: new Uint8Array(sizeX*sizeY*sizeZ),
  };
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
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

module.exports = {
  createScene,
  randVoxelVec,
  fillBox,
};
