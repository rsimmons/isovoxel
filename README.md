# Isometric Voxel Generative Art

The concept for this is blatantly stolen from the amazing pen plotter works of Frederik Vanhoutte
 ([Twitter](https://mobile.twitter.com/wblut/), [example work](https://mobile.twitter.com/wblut/status/1033365066391998464)). I coded it up so I could play with it myself.

Animation done with [Vivus Instant](https://maxwellito.github.io/vivus-instant/).

<p align="center">
  <img width="256" src="docs/sample1.svg">
  <img width="256" src="docs/sample3_animated.svg">
  <img width="256" src="docs/sample2.svg">
</p>

## Math/Tech Notes

[Isometric projection](https://en.wikipedia.org/wiki/Isometric_projection) of a voxel scene results in a 2d grid of equilateral triangles. To number triangles, I choose the convention of having integer x increase from left to right and integer y increase from top to bottom. Triangles can be either left-pointing or right-pointing, and I use the convention that a triangle is left pointing iff x+y is even.

Voxels are addressed with integers x,y,z >= 0. By convention, I render the scene oriented so that the origin is the "bottommost" corner, x increases to the up-right, y increases to the up-left, and z increases vertically. To render the scene, each "on" voxel is projected to a set of 6 triangles (given our conventions, the projection is simply `tx = x - y, ty = -x - y - 2*z`, then add x {0,1} and y {0,1,2} to get all 6). For each triangle cell we store two values: depth and facing. Depth is the distance from the camera (computed as simply `x + y - z`). Facing is the apparent orientation of the face, either up, left or right. We fill the depth and facing values iff the depth is less than any depth currently stored in that triangle cell (typical depth buffering).

After all voxels are projected, we iterate over all the edges of the triangle grid to decide if each one gets drawn or not. We decide this based on the depth and facing values of the two triangles adjacent to that edge. After the set of all drawn edges is determined, we sort and combine them to form contiguous segments wherever possible, and with alternating directionns for each "row" to be efficient for pen plotting.
