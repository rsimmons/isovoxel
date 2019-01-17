function vec2Create(x, y) {
  return {x, y};
}

function vec3Create(x, y, z) {
  return {x, y, z};
}

function vec3Copy(v) {
  return {x: v.x, y: v.y, z: v.z};
}

const VEC3_ZERO = vec3Create(0, 0, 0);

function vec3Add(a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z,
  };
}

function vec3AddScalar(v, s) {
  return {
    x: v.x + s,
    y: v.y + s,
    z: v.z + s,
  };
}

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

function vec3Scale(v, k) {
  return {
    x: k*v.x,
    y: k*v.y,
    z: k*v.z,
  };
}

module.exports = {
  vec2Create,
  VEC3_ZERO,
  vec3Create,
  vec3Copy,
  vec3Add,
  vec3AddScalar,
  vec3Min,
  vec3Max,
  vec3Scale,
};
