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

    console.log('Main.init');
    Listener.init(_startGame);
    Board.init();
    Renderer.init();
    Block.init();
    _interval = 1000 / _fps;
  }

  var _runGame = function() {
    _animator = window.requestAnimationFrame(_runGame);
    _now = Date.now();

    _delta = (_now - _then) / 100;
    // if (!Board.canMove(_currentBlock, 'down')) {
    //   if (Board.gameOver(_currentBlock)) {
    //     return _gameOver();
    //   }
    //   _checkTetris();
    //   if (_delta > 5) {

    //     _setUpNewBlock();
    //   }
    // } else {
    //   if (_delta > _interval) {
    //     if (Board.canMove(_currentBlock, 'down')) {
    //       _moveBlock('down');
    //     }
    //     _then = _now - (_delta % _interval);
    //   }
    // }
    if (_delta > _interval) {
      if (Board.canMove(_currentBlock, 'down')) {
        _moveBlock('down');
      } else {
        if (Board.gameOver(_currentBlock)) {
          return _gameOver();
        }
        _checkTetris();
        _setUpNewBlock();
      }
      _then = _now - (_delta % _interval);
      Renderer.render(Board.getGrid());
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
    console.warn('Game Over');
    Renderer.gameOver();
    window.cancelAnimationFrame(_animator);
  }

  var _moveBlock = function(direction) {
    console.log('main._moveBlock');
    Board.clearCurrentBlockPosition(_currentBlock);
    _currentBlock.moveBlock(direction);
    Board.updateGrid(_currentBlock);
  }

  var registerKeyPress = function(direction) {
    console.log('keyPress');
    _register
    Renderer.render(Board.getGrid());
  }

  var _registerMove = function(direction) {
    console.log('registerMove');
    if (Board.canMove(_currentBlock, direction)) {
      console.warn('canmove');
      _moveBlock(direction);
    }
    Renderer.render(Board.getGrid());
  }

  var _registerRotation = function(direction) {
    if (!_currentBlock.rotatable()) {
      return false;
    }
    console.warn('rotation attempt', direction);
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
  }

  var _relinquishControl = function() {
    Listener.relinquishControl();

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