"use strict";

var TETRIS = TETRIS || {};

TETRIS.BoardModule = (function($, Helpers) {
  var _colCount = 10;
  var _rowCount = 20;
  var _grid;
  var _score;
  var _direction = {
    left: {
      x: -1,
      y: 0,
    },
    right: {
      x: 1,
      y: 0,
    },
    down: {
      x: 0,
      y: 1
    }
  };
  var _tetris = [];

  var init = function() {
    _score = 0;
    _setUpGrid();
  }

  var _setUpGrid = function() {
    _grid = new Array(_rowCount);
    for (var i = 0; i < _grid.length; i++) {
      _grid[i] = new Array(_colCount);
    }
  }

  var dropBlock = function(block) {
    for (var i = 0; i < block.coords.length; i++) {
      var row = block.coords[i].y;
      var col = block.coords[i].x;
      _grid[row][col] = block.shape;
    }
  }

  var canMove = function(block, direction) {
    var coords = block.coords;
    var movement = _direction[direction];
    // iterate through each square of block
    for (var i = 0; i < coords.length; i++) {
      var self = false;
      var row = coords[i].y;
      var col = coords[i].x;
      var newRow = row + movement.y;
      var newCol = col + movement.x;
      // check if out of grid
      if (newRow > 19 || newCol < 0 || newCol > 9) {
        return false;
      }
      // check if space is taken
      if (_grid[newRow][newCol] !== undefined) {
        if (_grid[newRow][newCol] !== block.shape) {
          // different type of block. definitely can't move
          return false;
        }
        for (var j = 0; j < coords.length; j++) {
          if (j === i) {
            continue;
          }
          if (newRow === coords[j].y && newCol === coords[j].x) {
            self = true;
            continue;
          }
        }
        if (!self) {
          return false;
        }

      }
    }
    return true;
  }


  var gameOver = function(block) {
    for (var i = 0; i < block.coords.length; i++) {
      if (block.coords[i].y === 0) {
        return true;
      }
    }
    return false;
  }

  var getGrid = function() {
    return _grid;
  }

  var updateGrid = function(block) {
    console.log('updateGrid');
    for (var i = 0; i < block.coords.length; i++) {
      var square = block.coords[i];
      _grid[square.y][square.x] = block.shape;
    }
  }

  var clearCurrentBlockPosition = function(block) {
    console.log('clearCurrentBlockPosition');
    for (var i = 0; i < block.coords.length; i++) {
      var col = block.coords[i].x;
      var row = block.coords[i].y;
      console.log(col, row);
      _grid[row][col] = undefined;
    }
  }

  var moveToStartPosition = function(block) {
    var translation = Math.floor((_colCount - 4) / 2);
    block.translate(translation, 0);
  }

  var isTetris = function() {
    var counter;
    for (var row = _grid.length - 1; row > 0; row--) {
      counter = 0;
      for (var col = 0; col < _colCount; col++) {
        if (_grid[row][col] !== undefined) {
          counter++;
        }
        if (counter === 10) {
          _tetris.push(row);
        }
      }
    }
    return (_tetris.length > 0);
  }

  var tetris = function() {
    _updateScore(_tetris.length);
    _clearRows();
  }

  var _updateScore = function(rows) {
    _score += rows * 10;
  }

  var _clearRows = function() {
    _tetris.reverse();
    for (var i = 0; i < _tetris.length; i++) {
      var row = _tetris[i];
      // clear the row
      for (var col = 0; col < _colCount; col++) {
        _grid[row][col] = undefined;
      }
      // move everything above the row
      for (var above = row - 1; above > 0; above--) {
        for (var col = 0; col < _colCount; col++) {
          _grid[above + 1][col] = _grid[above][col];
        }
      }
    }
    _tetris = [];
  }

  var getScore = function() {
    return _score;
  }

  return {
    init: init,
    dropBlock: dropBlock,
    getGrid: getGrid,
    updateGrid: updateGrid,
    clearCurrentBlockPosition: clearCurrentBlockPosition,
    gameOver: gameOver,
    canMove: canMove,
    isTetris: isTetris,
    tetris: tetris,
    getScore: getScore,
    moveToStartPosition: moveToStartPosition
  }


})($, TETRIS.Helpers);