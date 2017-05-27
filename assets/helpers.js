"use strict";

var TETRIS = TETRIS || {};

TETRIS.Helpers = (function() {
  return {
    getRandomNumber: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
  }
})();