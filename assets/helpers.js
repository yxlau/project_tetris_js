"use strict";

var TETRIS = TETRIS || {};

TETRIS.Helpers = (function() {

  return {
    getRandomNumber: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    rotateCoordinates: function(radians, coords) {
      // assuming coords[0] is the pivot
      // and coords[?] = {x: ?, y: ?}
      var oX = coords[0].x;
      var oY = coords[0].y;
      var r = radians > 0 ? [0, -1, 1, 0] : [0, 1, -1, 0];
      for (var i = 1; i < coords.length; i++) {
        var x = coords[i].x;
        var y = coords[i].y;
        x -= oX;
        y -= oY;
        var tmpX = (r[0] * x) + (r[1] * y);
        var tmpY = (r[2] * x) + (r[3] * y);
        coords[i].x = tmpX + oX;
        coords[i].y = tmpY + oY;
      }
      return coords;
    }
  }

})();