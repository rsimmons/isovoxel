function vec2Add(a, b) {
  return {x: a.x + b.x, y: a.y + b.y};
}

function vec2Sub(a, b) {
  return {x: a.x - b.x, y: a.y - b.y};
}

// Opposite of handedness of coordinate system
function vec2Rot90AntiHand(v) {
  return {x: -v.y, y: v.x};
}

function vec2Avg(a, b) {
  return {x: 0.5*(a.x+b.x), y: 0.5*(a.y+b.y)};
}

function vec2Scale(v, k) {
  return {x: k*v.x, y: k*v.y};
}

function vec2Norm(v) {
  const len = Math.sqrt(v.x*v.x + v.y*v.y);
  return vec2Scale(v, 1.0/len);
}

function vec2Dot(a, b) {
  return a.x*b.x + a.y*b.y;
}

// If vecs are in anti-handed turning loop, area will be positive.
// So CCW loop in right-handed coordinates, area will be positive.
function vec2SignedArea(vs) {
  let sum = 0;
  for (let i = 0; i < vs.length; i++) {
    const a = vs[i];
    const b = vs[(i+1)%vs.length];
    sum += a.x*b.y - b.x*a.y;
  }
  return 0.5*sum;
}

// NOTE: This is not robust at all
function vec2InPoly(v, vs) {
  var x = v.x, y = v.y;
  
  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i].x, yi = vs[i].y;
    var xj = vs[j].x, yj = vs[j].y;
    
    var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) {
      inside = !inside;
    }
  }
  
  return inside;
}

module.exports = {
  vec2Add,
  vec2Sub,
  vec2Rot90AntiHand,
  vec2Avg,
  vec2Scale,
  vec2Norm,
  vec2Dot,
  vec2SignedArea,
  vec2InPoly,
};
