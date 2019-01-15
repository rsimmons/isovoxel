function sqrDistToClosestPointOnPath(v, path) {
  let bestSqrDist = Infinity;
  for (const p of path) {
    const dx = p.x - v.x;
    const dy = p.y - v.y;
    const sqrDist = dx*dx + dy*dy;
    if (sqrDist < bestSqrDist) {
      bestSqrDist = sqrDist;
    }
  }
  return bestSqrDist;
}

// Reorder path to start/end closest to v
function reorderPathStart(path, v) {
  let bestSqrDist = Infinity;
  let bestIdx;
  for (let i = 0; i < path.length; i++) {
    const p = path[i];
    const dx = p.x - v.x;
    const dy = p.y - v.y;
    const sqrDist = dx*dx + dy*dy;
    if (sqrDist < bestSqrDist) {
      bestSqrDist = sqrDist;
      bestIdx = i;
    }
  }

  const newPath = [];
  for (let i = 0; i < path.length; i++) {
    newPath.push(path[(i+bestIdx) % path.length]);
  }

  return newPath;
}

// We assume all paths are closed
function orderPathsForMinimumTravel(paths) {
  let curPosition = {x: 0, y: 0};

  const remainingPaths = [...paths];
  const resultPaths = [];

  while (remainingPaths.length) {
    let bestSqrDist = Infinity;
    let bestPath;

    for (path of remainingPaths) {
      const sqrDist = sqrDistToClosestPointOnPath(curPosition, path);
      if (sqrDist < bestSqrDist) {
        bestSqrDist = sqrDist;
        bestPath = path;
      }
    }

    // Remove from remaining
    remainingPaths.splice(remainingPaths.indexOf(bestPath), 1);

    // Reorder
    const reorderedPath = reorderPathStart(bestPath, curPosition);

    curPosition = reorderedPath[0];
    resultPaths.push(reorderedPath);
  }

  return resultPaths;
}

module.exports = {
  orderPathsForMinimumTravel,
};
