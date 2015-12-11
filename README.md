# circle-fit
A JavaScript library for fast circle fitting of a set of 2D points.

The implementation is based on a Least-Squares method to find the 3 unknowns : x and y coordinates and the radius.

# Speed and stability
The algorithm do not contain any iterative solvers and will find a solution in linear time, meaning that you will have the result instantly.
This library handles degenerate cases when you do not have enough non-colinear points to determine a correct circle by returning an error flag.

# Getting started
The library is simple to use. Include it to define a global object `CIRCLEFIT`.
This object have 3 methods :
* `addPoint(x, y)` : add a point to the set
* `clearPoints()` : remove all points
* `compute()` : execute the solver and return an object containing the result.

# Result object
The result object contains more than the circle informations, here are all the parameters :
* `success (Boolean)` : status of the computation
* `points (Array)` : all points given by the user
* `projections (Array)` : projections of each points onto the circle
* `distances (Array)` : distance of each points to the circle
* `center (Object)` :  center of the circle
* `radius (Number)` : radius of the circle
* `residue (Number)` : residue of the least squares method, can be use to define the quality of the circle
* `computationTime (Number)` : time spent in computation (in milliseconds)

# Example
```javascript
  var myPoints = [ ... ];
  myPoints.forEach(function(point) {
    CIRCLEFIT.addPoint(point.x, point.y);
  });
  var result = CIRCLEFIT.compute();
  if (result.success) {
    console.log("Center = {" + result.center.x + "," + result.center.y + "}, Radius = " + result.radius);
  }
```
