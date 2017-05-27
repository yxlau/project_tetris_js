"use strict";

var TETRIS = TETRIS || {}

TETRIS.Main = (function(modules, $) {

  // this is so we don't have to worry about the order in which we inject our modules
  var Listener = modules.listener;
  var Helpers = modules.helpers;
  var Block = modules.blocks;
  var Board = modules.board;
  var Renderer = modules.renderer;

  var _delta, _now, _then;

  var _interval, _currentBlock, _nextBlock, _animator;
  var _fps = 100;

  var init = function() {
    Listener.init(_startGame);
    Board.init();
    Renderer.init();
    Block.init();
    _interval = 1000 / _fps;
  }

  var _runGame = function() {
    _animator = window.requestAnimationFrame(_runGame);
    _now = Date.now();
    // Renderer.render(Board.getGrid());

    _delta = (_now - _then) / 100;
    if (_delta > _interval) {
      if (Board.canMove(_currentBlock, 'down')) {
        _moveBlock('down');
      } else {
        if (Board.gameOver(_currentBlock)) {
          return _gameOver();
        }
        _checkTetris();
        _setUpNewBlock();
        _updateSpeed();
      }
      _then = _now - (_delta % _interval);
      Renderer.render(Board.getGrid());
    }
  }

  var _updateSpeed = function() {
    var score = Board.getScore();
    if (score >= 500) {
      _interval = 5;
    }
    if (score >= 400) {
      _interval = 5.5;
    }
    if (score >= 300) {
      _interval = 6;
    }
    if (score >= 200) {
      _interval = 7;
    }
    if (score >= 100) {
      _interval = 8;
    }
    if (score >= 50) {
      _interval = 9;
    }
  }

  var _setUpNewBlock = function() {
    _currentBlock = Block.getCurrentBlock();
    _nextBlock = Block.getNextBlock();
    Block.lineUpBlocks();
    Board.moveToStartPosition(_currentBlock);
    Board.updateGrid(_currentBlock);
    Renderer.updateNextBlock(_nextBlock);
  }

  var _checkTetris = function() {
    if (Board.isTetris()) {
      Board.tetris();
      Renderer.updateScore(Board.getScore());
    }
  }

  var _gameOver = function() {
    Renderer.gameOver();
    window.cancelAnimationFrame(_animator);
  }

  var _moveBlock = function(direction) {
    Board.clearCurrentBlockPosition(_currentBlock);
    _currentBlock.moveBlock(direction);
    Board.updateGrid(_currentBlock);
  }

  var _registerMove = function(direction) {
    if (Board.canMove(_currentBlock, direction)) {
      _moveBlock(direction);
    }
    Renderer.render(Board.getGrid());
  }

  var _registerRotation = function(direction) {
    if (!_currentBlock.rotatable()) {
      return false;
    }
    if (Board.canRotate(_currentBlock, direction)) {
      _rotateBlock(direction);
    }
    Renderer.render(Board.getGrid());
  }

  var _rotateBlock = function(direction) {
    Board.clearCurrentBlockPosition(_currentBlock);
    _currentBlock.rotate(direction);
    Board.updateGrid(_currentBlock);
  }

  var _listenForKeyPress = function() {
    Listener.listenForKeyPress({
      registerMove: _registerMove,
      registerRotation: _registerRotation
    });
    Listener.disableStart();
  }



  var _startGame = function() {
    _then = Date.now()
    _listenForKeyPress();
    _setUpNewBlock();
    Renderer.render(Board.getGrid());
    _animator = window.requestAnimationFrame(_runGame);
  }

  return {
    init: init,
  }

})({
  listener: TETRIS.ListenerMod,
  helpers: TETRIS.Helpers,
  blocks: TETRIS.BlockModule,
  board: TETRIS.BoardModule,
  renderer: TETRIS.RendererModule
}, $);