# Isometric Voxel Generative Art

The concept for this is blatantly stolen from the amazing pen plotter works of Frederik Vanhoutte
 ([Twitter](https://mobile.twitter.com/wblut/), [example work](https://mobile.twitter.com/wblut/status/1033365066391998464)). I coded it up so I could play with it myself. More sample output can be found in [this gallery](docs/gallery.md).

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

## Running the code

*(The code is rather a mess currently, but here are some notes for the adventurous about running it.)*

Assuming NodeJS and Yarn are installed:

```
$ git clone git@github.com:rsimmons/isovoxel.git
$ cd isovoxel
$ yarn
[there are no external dependencies, but the code uses workspaces, so this makes the symlinks in node_modules/]
$ cd sketches
$ node sketch001.js
[output written to out.svg, which you can open directly in a browser]
```

There are a number of demo "sketches", found in `sketches/sketchNNN.js`. The format should be relatively obvious, but a sketch is implemented as a call to `makeSketch` that provides a callback function to fill/define the voxels of the scene. The `padFrac` argument is the (fractional) padding around the edges of the render. The `ops` argument to the callback is an object with a handful of useful voxel operations (defined in `core/scene.js`, `const ops = {...`). Note that many of the ops have a random element; re-run the sketch to get a new variation.

To understand the available ops, it's useful to look at the demo sketches, but here is some brief documentation. Voxel coordinates arguments are given as plain old JS objects, like `{x: 1, y: 2, z: 3}`, with axes defined per the Math/Tech Notes section above. The `fill` argument of ops is to be 0 or 1, corresponding to empty or solid.

* `fillBox(scene, corner_a, corner_b, fill)` - fills the 3d box defined by the two corners. it exclusive WRT to the "max" coordinates, so if corner_a==corner_b, no filling is done
* `fillScene(scene)` - helper to fill the entire scene solid, so that you may then subtract away from it
* `makeHollowShell(scene, cornerA, cornerB, thickness)` - makes a hollow shell of a box. as with `fillBox`, this excludes the "max" of coordinates. the thickness goes "inward", so the corners define the exterior
* `randomBox(scene, fill)` - fills a box defined by random corners (uniform random in each dimension)
* `toggleRandomBox(scene)` - like `randomBox`, but instead of filling, toggles voxels between empty and solid
* `randomShell(scene, thickness)` - like `makeHollowShell` but with random corners like `randomBox`
* `frontCutaway(scene, frac)` - "cut away" (fill with empty) the vertical front edge of the scene. `frac` is 0 to 1 of proportion to cut away
* `topFrontCutaway(scene, frac)` - like `frontCutaway`, but cuts away the top-front corner
* `predicateFill(scene, fill, predFunc)` - calls `predFunc` for every position in the scene, and iff it returns true, fills with the given fill value
* `worm(scene, startPos, size, moveRepeat)` - fills a solid, square, random "worm" path, that starts from the given `startPos` and keeps going until it hits any side of the scene. `size` is basically the "diameter" of the worm. `moveRepeat` is how many steps it moves in a random (axis-aligned) direction before picking a new direction.


