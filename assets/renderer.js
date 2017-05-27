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
    s: '#22a2c9',
    i: '#3d8fd1',
    j: '#6679cc',
    l: '#ac9739',
    o: '#9c637a',
    z: '#c94922',
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
          _ctx.strokeStyle = 'white';
          _ctx.fillStyle = _colours[grid[row][col]];
          _ctx.strokeRect(x, y, _pixel, _pixel);
          _ctx.fillRect(_pixel * col, _pixel * row, _pixel, _pixel);
        }
      }
    }
  }


  var updateScore = function(score) {
    _$score.text(score);
  }

  var _pixelate = function(unit) {
    return unit * _pixel;
  }

  var updateNextBlock = function(block) {
    var coords = block.coords;
    var unit = 100 / 4;
    _nextCtx.clearRect(0, 0, _nextWidth, _nextHeight);
    for (var i = 0; i < coords.length; i++) {
      var x = (coords[i].x) * unit;
      var y = (coords[i].y) * unit;
      _nextCtx.beginPath();
      _nextCtx.strokeStyle = 'white';
      _nextCtx.fillStyle = _colours[block.shape];
      _nextCtx.fillRect(x, y, unit, unit);
      _nextCtx.strokeRect(x + 0.5, y + 0.5, unit, unit);
    }
  }

  var gameOver = function() {
    _nextCtx.clearRect(0, 0, _nextWidth, _nextHeight);
    _ctx.clearRect(0, 0, _width, _height);
    _ctx.font = "20px Georgia";
    _ctx.fillStyle = 'white';
    _ctx.fillText("Hello World!", 10, 50);

  }

  var getPixelsPerSquare = function() {
    return _pixel;
  }

  return {
    init: init,
    render: render,
    updateScore: updateScore,
    updateNextBlock: updateNextBlock,
    getPixelsPerSquare: getPixelsPerSquare,
    gameOver: gameOver
  }


})();