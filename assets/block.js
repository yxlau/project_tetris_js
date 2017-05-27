"use strict";

var TETRIS = TETRIS || {}

TETRIS.BlockModule = (function(modules) {

  var Helpers = modules.helpers

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

  var _currentBlock, _nextBlock;

  var _blockBag = ['j', 'i', 'o', 's', 'z', 'l'];

  var _getNewBlock = function() {
    var blocks = []
    if (_blockBag.length < 1) {
      for (var i = 0; i < 4; i++) {
        blocks.concat(_blockBag);
      }
    }
    var index = Helpers.getRandomNumber(0, blocks.length - 1);
    return new Block(blocks.splice(index, 1)[0]);
  }

  var lineUpBlocks = function() {
    _currentBlock = _nextBlock || _getNewBlock();
    if (_nextBlock === _currentBlock) {
      _nextBlock = _getNewBlock();
    }
  }
  var init = function() {
    _nextBlock = _getNewBlock();
    lineUpBlocks();
  }

  var getCurrentBlock = function() {
    return _currentBlock;
  }

  var getNextBlock = function() {
    return _nextBlock;
  }


  // ==========================================
  // BLOCK CONSTRUCTOR 
  // ==========================================

  var Block = function Block(shape) {
    this.shape = shape || this.getRandomShape();
    this.getStartCoords();
  }

  Block.prototype.rotate = function(radians) {
    // first coord is always the pivot
    // ignore attempts to rotate a square. yes, A SQUARE!
    if (this.shape === 'o') {
      return;
    }
    var oX = this.coords[0].x;
    var oY = this.coords[0].y;
    var r = radians > 0 ? [0, -1, 1, 0] : [0, 1, -1, 0];
    for (var i = 1; i < this.coords.length; i++) {
      var x = this.coords[i].x - oX;
      var y = this.coords[i].y - oY;
      this.coords[i].x = (r[0] * x) + (r[1] * y) + oX;
      this.coords[i].y = (r[2] * x) + (r[3] * y) + oY;
    }
  }

  Block.prototype.moveToStart = function(posX, posY) {
    this.translate(posX, posY);
  }

  Block.prototype.translate = function(x, y) {
    for (var i = 0; i < this.coords.length; i++) {
      this.coords[i].x += x;
      this.coords[i].y += y;
    }
  }

  Block.prototype.moveBlock = function(direction) {
    var movement = _direction[direction]
    this.translate(movement.x, movement.y);
  }

  Block.prototype.getRandomShape = function() {
    // this is here as back up, but it really shouldn't be used
    var shapes = ['j', 'i', 'o', 's', 'z', 'l'];
    return shapes[Helpers.getRandomNumber(0, 5)];
  }

  Block.prototype.rotationSpace = function(direction) {
    // should return coords needed to rotate in given direction
    var oCoords = this.coords;
    this.rotate(direction);
    var rotated = $.extend(true, {}, this.coords);
    this.coords = oCoords;
    return rotated;
  }


  Block.prototype.getStartCoords = function() {
    // first coord is rotation pivot
    switch (this.shape) {
      case 's':
        this.coords = [{
          x: 1,
          y: 1
        }, {
          x: 1,
          y: 0,
        }, {
          x: 2,
          y: 0
        }, {
          x: 0,
          y: 1
        }]
        break;
      case 'o':
        this.coords = [{
          x: 1,
          y: 0
        }, {
          x: 2,
          y: 0
        }, {
          x: 2,
          y: 1
        }, {
          x: 1,
          y: 1
        }]
        break;
      case 'l':
        this.coords = [{
          x: 1,
          y: 1
        }, {
          x: 2,
          y: 0
        }, {
          x: 0,
          y: 1
        }, {
          x: 2,
          y: 1
        }]
        break;
      case 'j':
        this.coords = [{
          x: 1,
          y: 1
        }, {
          x: 0,
          y: 0
        }, {
          x: 0,
          y: 1
        }, {
          x: 2,
          y: 1
        }]
        break;
      case 'z':
        this.coords = [{
          x: 1,
          y: 1
        }, {
          x: 0,
          y: 0
        }, {
          x: 1,
          y: 0
        }, {
          x: 2,
          y: 1
        }]
        break;
      case 'i':
        this.coords = [{
          x: 1,
          y: 0
        }, {
          x: 0,
          y: 0
        }, {
          x: 2,
          y: 0
        }, {
          x: 3,
          y: 0
        }]
        break;
    }
  }

  return {
    getCurrentBlock: getCurrentBlock,
    getNextBlock: getNextBlock,
    lineUpBlocks: lineUpBlocks,
    init: init,
  }

})({
  helpers: TETRIS.Helpers
});