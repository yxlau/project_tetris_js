"use strict";

var TETRIS = TETRIS || {};

TETRIS.RendererModule = (function() {
  var _height = 600;
  var _width = 300;
  var _colCount = 10;
  var _rowCount = 20;
  var _$score;
  var _pixel = _width / _colCount; // pixels / square (30 px)
  var _$board;
  var _ctx;
  var _nextCtx;
  var _nextWidth = 150;
  var _nextHeight = 150;

  var _colours = {
    s: 'green',
    i: 'turquoise',
    j: 'blue',
    l: 'orange',
    o: 'yellow',
    z: 'red',
  };

  var init = function() {
    _$board = $('#board');
    _$score = $('#points');
    _ctx = _$board[0].getContext('2d');
    _nextCtx = $('#next-block')[0].getContext('2d');
  }

  var render = function(grid, block, delta) {
    _ctx.clearRect(0, 0, _width, _height);
    for (var row = 0; row < grid.length; row++) {
      for (var col = 0; col < _colCount; col++) {
        if (grid[row][col] !== undefined) {
          // just draw a square and you're set!
          var x = _pixelate(col);
          var y = _pixelate(row);
          _ctx.beginPath();
          _ctx.fillStyle = _colours[grid[row][col]];
          _ctx.fillRect(x, y, _pixel, _pixel);
        }
      }
    }
    _ctx.fill();
    _ctx.stroke();
  }

  var updateScore = function(score) {
    _$score.text(score);
  }

  var _pixelate = function(unit) {
    return unit * _pixel + 0.5;
  }

  var updateNextBlock = function(block) {
    var coords = block.coords;
    var unit = 100 / 4;
    _nextCtx.clearRect(0, 0, _nextWidth, _nextHeight);
    for (var i = 0; i < coords.length; i++) {
      var x = (coords[i].x) * unit;
      var y = (coords[i].y) * unit;
      console.log('next', x, y);
      _nextCtx.beginPath();
      _nextCtx.fillStyle = _colours[block.shape];
      _nextCtx.fillRect(x + 0.5, y + 0.5, unit, unit);
      _nextCtx.strokeStyle = 'black';
    }
    _nextCtx.fill();
    _nextCtx.stroke();
  }

  var gameOver = function() {
    _nextCtx.clearRect(0, 0, _nextWidth, _nextHeight);
    _ctx.clearRext(0, 0, _width, _height);
  }

  var getPixelsPerSquare = function() {
    return _pixel;
  }

  return {
    init: init,
    render: render,
    updateScore: updateScore,
    updateNextBlock: updateNextBlock,
    getPixelsPerSquare: getPixelsPerSquare
  }


})();