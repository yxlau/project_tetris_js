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

  // the block module is responsible for blocks
  // it can return a block Constructor? (Block)
  // and it can perform blockCollection-related actions, 
  // like generating a new bag of blocks
  var _blockBag = ['j', 'i', 'o', 's', 'z', 'l'];
  // var _blockBag = ['o'];

  // replaces currentBlock
  var getNewBlock = function() {
    if (_blockBag.length < 1) {
      _blockBag = ['j', 'i', 'o', 's', 'z', 'l'];
      // _blockBag = ['o', 'o'];
    }
    var index = Helpers.getRandomNumber(0, _blockBag.length - 1);

    console.log(_blockBag);
    return _currentBlock = new Block(_blockBag.splice(index, 1)[0]);
  }

  var moveBlock = function(direction) {
    console.log('Block.moveBlock');
    _currentBlock.moveBlock(direction);
  }


  var Block = function Block(shape) {
    this.shape = shape || this.getRandomShape();
    this.getStartCoords();
    this.rotation = 0;
  }

  Block.prototype.rotate = function(direction) {
    // first coord is always the pivot
    // ignore attempts to rotate a square. yes, A SQUARE!
    if (this.shape === 'o') {
      return;
    }
    this.coords = Helpers.rotateCoordinates(direction, this.coords);
  }

  Block.prototype.translate = function(x, y) {
    for (var i = 0; i < this.coords.length; i++) {
      this.coords[i].x += x;
      this.coords[i].y += y;
    }
  }

  Block.prototype.moveBlock = function(direction) {
    var movement = _direction[direction]
    for (var i = 0; i < this.coords.length; i++) {
      this.coords[i].x += movement.x;
      this.coords[i].y += movement.y;
    }
  }


  Block.prototype.getRandomShape = function() {
    // this really shouldn't be used
    var shapes = ['j', 'i', 'o', 's', 'z', 'l'];
    return shapes[Helpers.getRandomNumber(0, 5)];
  }


  Block.prototype.getStartCoords = function() {
    // switch to array of objects
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
          y: 1
        }, {
          x: 0,
          y: 1
        }, {
          x: 2,
          y: 1
        }, {
          x: 3,
          y: 1
        }]
        break;
    }
  }

  return {
    getNewBlock: getNewBlock,
    moveBlock: moveBlock,
  }

})({
  helpers: TETRIS.Helpers
});