"use strict";

var TETRIS = TETRIS || {}

TETRIS.BlockModule = (function(modules) {

  var Helpers = modules.helpers
  var _counter;

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
  var _blocks = [];
  var _blockBag = ['j', 'i', 'o', 's', 'z', 'l', 't'];


  var _getNewBlock = function() {
    if (_blocks.length < 1) {
      for (var i = 0; i < 2; i++) {
        _blocks = _blocks.concat(_blockBag);
      }
    }
    var index = Helpers.getRandomNumber(0, _blocks.length - 1);
    var newBlock = new Block(_blocks.splice(index, 1)[0], _counter);
    _counter += 1;
    return newBlock;
  }

  var lineUpBlocks = function() {
    _currentBlock = _nextBlock || _getNewBlock();
    if (_nextBlock === _currentBlock) {
      _nextBlock = _getNewBlock();
    }
  }
  var init = function() {
    _currentBlock = undefined;
    _counter = 0;
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

  var Block = function Block(shape, id) {
    this.id = id || 0;
    this.shape = shape || this.getRandomShape();
    this.rotation = 0;
    this.setUpCoordsArray();
    this.generateCoordsForShape();
    this.y = 0;
    this.x = this.coords[this.rotation][0].x;
  }

  Block.prototype.rotate = function(rotation) {
    this.rotation += rotation;
    if (this.rotation < 0) {
      this.rotation = 3;
    }
    if (this.rotation > 3) {
      this.rotation = 0;
    }
  }

  Block.prototype.getCurrentCoords = function() {
    var coords = [];
    var current = this.coords[this.rotation];
    for (var i = 0; i < this.coords[this.rotation].length; i++) {
      coords.push({
        x: current[i].x + this.x,
        y: current[i].y + this.y
      })
    }
    return coords;
  }

  Block.prototype.moveToStart = function(posX, posY) {
    this.translate(posX, posY);
  }

  Block.prototype.translate = function(x, y) {
    this.x += x;
    this.y += y;
  }

  Block.prototype.moveBlock = function(direction) {
    var movement = _direction[direction]
    this.translate(movement.x, movement.y);
  }

  Block.prototype.getRandomShape = function() {
    // this is here as back up, but it really shouldn't be used
    var shapes = ['j', 'i', 'o', 's', 'z', 'l', 't'];
    return shapes[Helpers.getRandomNumber(0, 5)];
  }

  Block.prototype.rotationSpace = function(direction) {
    // should return coords needed to rotate in given direction
    var current = this.coords[this.rotation]
  }

  Block.prototype.setUpCoordsArray = function() {
    this.coords = new Array(4);
    for (var i = 0; i < 4; i++) {
      this.coords[i] = new Array();
    }
  }

  Block.prototype.generateCoordsForShape = function() {

    var startCoords = this.getStartCoords();
    if (this.shape == 'o') {
      this.coords[0] = startCoords;
      return;
    }
    var transformations = [
      [0, -1, 1, 0],
      [-1, 0, 0, -1],
      [0, 1, -1, 0]
    ];
    var oX = startCoords[0].x
    var oY = startCoords[0].y;
    for (var t = 0; t < transformations.length; t++) {
      for (var j = 0; j < startCoords.length; j++) {
        this.coords[t + 1].push({
          x: (transformations[t][0] * (startCoords[j].x - oX)) + (transformations[t][1] * (startCoords[j].y - oY)) + oX,
          y: (transformations[t][2] * (startCoords[j].x - oX)) + (transformations[t][3] * (startCoords[j].y - oY)) + oX
        })
      }
    }
    this.coords[0] = startCoords;
  }

  Block.prototype.rotatable = function() {
    return (this.shape !== 'o');
  }

  Block.prototype.getStartCoords = function() {
    // rename this to master coords
    // first coord is rotation pivot
    var coords;
    switch (this.shape) {
      case 's':
        coords = [{
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
        coords = [{
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
        coords = [{
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
        coords = [{
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
        coords = [{
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
        coords = [{
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
      case 't':
        coords = [{
          x: 1,
          y: 1
        }, {
          x: 1,
          y: 0
        }, {
          x: 0,
          y: 1
        }, {
          x: 2,
          y: 1
        }]
        break;
    }
    return coords;
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