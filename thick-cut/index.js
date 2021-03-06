const fs = require('fs');

const {cutPathsToPonokoSVG} = require('isovoxel-ponoko-export');
const {orderPathsForMinimumTravel, simplifyPath} = require('./opt');
const {vec2Add, vec2Sub, vec2Rot90AntiHand, vec2Avg, vec2Scale, vec2Norm, vec2Dot, vec2SignedArea, vec2InPoly} = require('./vec');

const EXPAND_RADIUS = 0.22;

function segmentsToCutPaths(segments) {
  const vertexMap = new Map(); // map string of coords to object
  const allEdges = [];

  function vec2key(v) {
    return v.x + ',' + v.y;
  }

  function getOrCreateVertex(v) {
    const k = vec2key(v);

    if (vertexMap.has(k)) {
      return vertexMap.get(k);
    }

    const vertex = {
      position: v,
      outgoingEdges: [],
    };
    vertexMap.set(k, vertex);
    return vertex;
  }

  function addEdge(a, b) {
    const vertA = getOrCreateVertex(a);
    const vertB = getOrCreateVertex(b);
    const edge = {
      end: vertB,
      vec: {x: vertB.position.x - vertA.position.x, y: vertB.position.y - vertA.position.y},
      visited: false,
    }
    vertA.outgoingEdges.push(edge);
    allEdges.push(edge);
    return edge;
  }

  for (const segment of segments) {
    const e1 = addEdge(segment[0], segment[1]);
    const e2 = addEdge(segment[1], segment[0]);
    e1.dual = e2;
    e2.dual = e1;
  }

  function walkFromEdge(startEdge) {
    // Walk with our left hand on edge, conceptually
    const pathVecs = [];
    let edge = startEdge;
    while (true) {
      if (edge.visited) {
        throw new Error('edge should not have already been visited');
      }
      edge.visited = true;

      const endVert = edge.end;
      pathVecs.push(endVert.position);

      const scoredEdges = [];
      for (const e of endVert.outgoingEdges) {
        if (e !== edge.dual) {
          let angle = Math.atan2(edge.vec.y, edge.vec.x) - Math.atan2(e.vec.y, e.vec.x);
          if (angle > Math.PI) {
            angle -= 2*Math.PI;
          } else if (angle <= -Math.PI) {
            angle += 2*Math.PI;
          }
          scoredEdges.push({
            score: angle,
            edge: e,
          });
        }
      }
      scoredEdges.sort((a, b) => (a.score - b.score));
      edge = scoredEdges[0].edge;

      if (edge === startEdge) {
        break;
      }
    }

    return pathVecs;
  }

  function expandPathAntiHand(path, dist) {
    const newPath = [];

    for (let i = 0; i < path.length; i++) {
      const vPrev = path[(i-1+path.length)%path.length];
      const vThis = path[i];
      const vNext = path[(i+1)%path.length];

      const normAvgVec = vec2Norm(vec2Avg(vec2Sub(vThis, vPrev), vec2Sub(vNext, vThis)));
      const normFirstVec = vec2Norm(vec2Sub(vThis, vPrev));
      // NOTE: This will blow up as angle approaches +/- 180 deg, need miter limit
      const secantOfHalfAngle = 1.0 / vec2Dot(normAvgVec, normFirstVec);

      const offset = vec2Scale(vec2Rot90AntiHand(normAvgVec), dist*secantOfHalfAngle);

      newPath.push(vec2Add(vThis, offset));
    }

    return newPath;
  }

  const expandedPaths = [];
  for (const edge of allEdges) {
    if (!edge.visited) {
      const path = walkFromEdge(edge);
      expandedPaths.push(expandPathAntiHand(path, EXPAND_RADIUS));
    }
  }

  return expandedPaths;
}

function cullPaths(paths) {
  // Area will be negative for CCW (outer) paths.
  const pathsExtra = paths.map(path => ({
    path,
    area: vec2SignedArea(path),
    children: [],
  }));

  // Sort from larest absolute area to smallest
  pathsExtra.sort((a, b) => (Math.abs(b.area) - Math.abs(a.area)));

  if (pathsExtra[0].area >= 0) {
    throw new Error('sign of biggest path area is wrong');
  }

  const rootPaths = [];

  // Scope is array of paths. If path is inside any paths in scope, place it as child in that tree,
  // otherwise place in scope array.
  function placePath(path, scope) {
    // TODO: implement recursively
    for (const pp of scope) {
      if (vec2InPoly(path.path[0], pp.path)) {
        placePath(path, pp.children);
        return;
      }
    }
    scope.push(path);
  }

  for (const path of pathsExtra) {
    placePath(path, rootPaths);
  }

  // We only care about rootPaths[0] and first level inside it
  const innerPaths = rootPaths[0].children.map(c => c.path);
  const optimizedInnerPaths = orderPathsForMinimumTravel(innerPaths);
  const outerPath = rootPaths[0].path;

  const culledPaths = [];
  culledPaths.push(...optimizedInnerPaths);
  culledPaths.push(outerPath);

  return culledPaths;
}

function pathsToSVG(paths) {
  const pieces = [];

  pieces.push('<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">');

  const pathPieces = [];
  pathPieces.push('<path fill-rule="even-odd" d="');
  for (const path of paths) {
    for (let i = 0; i < path.length; i++) {
      const p = path[i];
      pathPieces.push(`${i ? 'L' : 'M'} ${p.x} ${p.y} `);
    }
    pathPieces.push('Z ');
  }
  pathPieces.push('" />');
  pieces.push(pathPieces.join(''));

  pieces.push('</svg>');

  return pieces.join('');
}

const stdinData = fs.readFileSync(0, 'utf8');

const segments = JSON.parse(stdinData);

console.log(`${segments.length} input segments`);

const paths = segmentsToCutPaths(segments);

// "Outer" paths will be CCW, "inner" ones will be CW. But keep in mind we are in left-handed coords.

console.log(`${paths.length} paths before culling`);
fs.writeFileSync('unculled.svg', pathsToSVG(paths));

const simplifiedPaths = paths.map(p => simplifyPath(p));

const culledPaths = cullPaths(simplifiedPaths);

console.log(`${culledPaths.length} paths after culling`);

fs.writeFileSync('culled.svg', pathsToSVG(culledPaths));

const {svg, mmPerInputUnit} = cutPathsToPonokoSVG(culledPaths, 'P3', true);
console.log(`Ponoko strip width ${(2*EXPAND_RADIUS*mmPerInputUnit).toFixed(3)} mm`);
fs.writeFileSync('ponoko.svg', svg);
