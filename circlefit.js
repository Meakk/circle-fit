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

  function sqr(a) {
    return a*a;
  }

  my.addPoint = function (x, y) {
    points.push({x: x, y: y});
  }

  my.resetPoints = function () {
    points = [];
  }

  my.compute = function () {
    var result = {
      success: false,
      center: {x:0, y:0},
      radius: 0,
      residue: 0
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

    //precompute sums
    var a1 = u.reduce(function(p,c) {
      return p + c.x*c.x;
    },0);

    var b1 = u.reduce(function(p,c) {
      return p + c.x*c.y;
    },0);

    var c1 = u.reduce(function(p,c) {
      return p + 0.5*(c.x*c.x*c.x + c.x*c.y*c.y);
    },0);

    var a2 = u.reduce(function(p,c) {
      return p + c.x*c.y;
    },0);

    var b2 = u.reduce(function(p,c) {
      return p + c.y*c.y;
    },0);

    var c2 = u.reduce(function(p,c) {
      return p + 0.5*(c.y*c.y*c.y + c.x*c.x*c.y);
    },0);

    if (a1 === 0 || b2 === 0) {
      //not enough points or points are colinears
      return result;
    }

    var q = a2/a1;

    var cy = (c2-q*c1)/(b2-q*b1);
    var cx = (c1-b1*cy)/a1;

    result.radius = Math.sqrt(cx*cx + cy*cy + (a1+b2)/points.length);

    result.center.x = cx + m.x;
    result.center.y = cy + m.y;

    result.residue = points.reduce(function(p,c) {
       var t = sqr(result.radius) - sqr(c.x - result.center.x) - sqr(c.y - result.center.y);
       return p + t*t;
     });

    return result;
  }

  return my;
}());
