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

module.exports = {
  vec2Create,
  VEC3_ZERO,
  vec3Create,
  vec3Min,
  vec3Max,
};
