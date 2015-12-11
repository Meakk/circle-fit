/*
The MIT License (MIT)

Copyright (c) 2015 Michael MIGLIORE

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var CIRCLEFIT = (function () {
  var my = {},
      points = [];

  function linearSolve2x2(matrix, vector) {
    var det = matrix[0]*matrix[3] - matrix[1]*matrix[2];
    if (det < 1e-8) return false; //no solution
    var y = (matrix[0]*vector[1] - matrix[2]*vector[0])/det;
    var x = (vector[0] - matrix[1]*y)/matrix[0];
    return [x,y];
  }

  my.addPoint = function (x, y) {
    points.push({x: x, y: y});
  }

  my.resetPoints = function () {
    points = [];
  }

  my.compute = function () {
    var result = {
      points: points,
      projections: [],
      distances: [],
      success: false,
      center: {x:0, y:0},
      radius: 0,
      residue: 0,
      computationTime: performance.now()
    };

    //means
    var m = points.reduce(function(p, c) {
      return {x: p.x + c.x/points.length,
              y: p.y + c.y/points.length};
    },{x:0, y:0});
    
    //centered points
    var u = points.map(function(e){
      return {x: e.x - m.x,
              y: e.y - m.y};
    });

    //solve linear equation
    var Sxx = u.reduce(function(p,c) {
      return p + c.x*c.x;
    },0);

    var Sxy = u.reduce(function(p,c) {
      return p + c.x*c.y;
    },0);

    var Syy = u.reduce(function(p,c) {
      return p + c.y*c.y;
    },0);

    var v1 = u.reduce(function(p,c) {
      return p + 0.5*(c.x*c.x*c.x + c.x*c.y*c.y);
    },0);

    var v2 = u.reduce(function(p,c) {
      return p + 0.5*(c.y*c.y*c.y + c.x*c.x*c.y);
    },0);

    var sol = linearSolve2x2([Sxx, Sxy, Sxy, Syy], [v1, v2]);

    if (sol === false) {
      //not enough points or points are colinears
      return result;
    }

    result.success = true;

    //compute radius from circle equation
    var radius2 = sol[0]*sol[0] + sol[1]*sol[1] + (Sxx+Syy)/points.length;
    result.radius = Math.sqrt(radius2);

    result.center.x = sol[0] + m.x;
    result.center.y = sol[1] + m.y;

    points.forEach(function(p) {
      var v = {x: p.x - result.center.x, y: p.y - result.center.y};
      var len2 = v.x*v.x + v.y*v.y;
      result.residue += radius2 - len2;
      var len = Math.sqrt(len2);
      result.distances.push(len - result.radius);
      result.projections.push({
        x: result.center.x + v.x*result.radius/len,
        y: result.center.y + v.y*result.radius/len
      });     
    });

    result.computationTime = performance.now() - result.computationTime;

    return result;
  }

  return my;
}());