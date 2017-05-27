"use strict";

var TETRIS = TETRIS || {};

TETRIS.BoardModule = (function($, Helpers) {
  var _colCount = 10;
  var _rowCount = 20;
  var grid;
  var permaGrid;
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
    grid = new Array(_rowCount);
    for (var i = 0; i < grid.length; i++) {
      grid[i] = new Array(_colCount);
    }
  }

  var canMove = function(block, direction) {
    var coords = block.getCurrentCoords();
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
      if (grid[newRow][newCol] !== undefined) {
        if (grid[newRow][newCol] !== block.shape) {
          // different type of block. definitely can't move
          return false;
        }
        for (var j = 0; j < coords.length; j++) {
          if (j === i) {
            continue;
          }
          if (newRow === coords[j].y && newCol === coords[j].x) {
            self = true;
          }
        }
        if (!self) {
          return false;
        }

      }
    }
    return true;
  }

  var canRotate = function(block, direction) {
    console.log('canroate');
    var direction = direction + block.rotation;
    if (direction < 0) {
      direction = 3
    }
    if (direction = 4) {
      direction = 0;
    }
    var spaceNeeded = block.coords[direction];
    for (var i = 0; i < spaceNeeded.length; i++) {
      var self = false;
      var row = spaceNeeded[i].y + block.y;
      var col = spaceNeeded[i].x + block.x;
      if (row > 19 || row < 0 || col < 0 || col > 9) {
        return false;
      }
      if (grid[row][col] !== undefined) {
        if (grid[row][col] !== block.shape) {
          return false;
        }
        for (var j = 0; j < spaceNeeded.length; j++) {
          if (row === spaceNeeded[j].y + block.y && col === spaceNeeded[j].x + block.x) {
            self = true;
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
    return grid;
  }


  var updateGrid = function(block) {
    console.log('updateGrid');
    var coords = block.getCurrentCoords();
    for (var i = 0; i < coords.length; i++) {
      var row = coords[i].y;
      var col = coords[i].x;
      grid[row][col] = block.shape;
    }
  }

  var clearCurrentBlockPosition = function(block) {
    console.log('clearCurrentBlockPosition');
    var coords = block.getCurrentCoords();
    for (var i = 0; i < coords.length; i++) {
      var col = coords[i].x;
      var row = coords[i].y;
      grid[row][col] = undefined;
    }
  }

  var moveToStartPosition = function(block) {
    var translation = Math.floor((_colCount - 4) / 2);
    block.translate(translation, 0);
  }

  var isTetris = function() {
    var counter;
    for (var row = grid.length - 1; row > 0; row--) {
      counter = 0;
      if (grid[row][0] === undefined) {
        continue;
      }
      for (var col = 0; col < _colCount; col++) {
        if (grid[row][col] !== undefined) {
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
    // we reverse to make sure we're clearing from the bottom up
    _tetris.reverse();
    for (var i = 0; i < _tetris.length; i++) {
      var row = _tetris[i];
      // clear the row
      for (var col = 0; col < _colCount; col++) {
        grid[row][col] = undefined;
      }
      // move everything above the row
      for (var above = row - 1; above > 0; above--) {
        for (var col = 0; col < _colCount; col++) {
          grid[above + 1][col] = grid[above][col];
        }
      }
    }
    _tetris = [];
  }

  var getScore = function() {
    return _score;
  }

  var getStartOffsetX = function() {
    return Math.floor((_colCount - 4) / 2);
  }


  return {
    init: init,
    getGrid: getGrid,
    updateGrid: updateGrid,
    clearCurrentBlockPosition: clearCurrentBlockPosition,
    gameOver: gameOver,
    canMove: canMove,
    isTetris: isTetris,
    tetris: tetris,
    getScore: getScore,
    moveToStartPosition: moveToStartPosition,
    getStartOffsetX: getStartOffsetX,
    canRotate: canRotate
  }


})($, TETRIS.Helpers);