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
    // FIX THIS
    _interval = 1000 / _fps;
  }

  var _runGame = function() {
    _animator = window.requestAnimationFrame(_runGame);
    _now = Date.now();
    _delta = (_now - _then) / 100;

    if (!Board.canMove(_currentBlock, 'down')) {
      if (Board.gameOver(_currentBlock)) {
        return _gameOver();
      }
      _checkTetris();
      _setUpNewBlock();
    } else {
      if (_delta > _interval) {
        _moveBlock('down');
        _then = _now - (_delta % _interval);
      }
    }
    Renderer.render(Board.getGrid());
  }

  var _setUpNewBlock = function() {
    _currentBlock = Block.getCurrentBlock();
    _nextBlock = Block.getNextBlock();
    Block.lineUpBlocks();
    Board.moveToStartPosition(_currentBlock);
    Board.updateGrid(_currentBlock);
    Renderer.updateNextBlock(_nextBlock);
  }

  var _checkGameOver = function() {
    if (Board.gameOver(_currentBlock)) {
      console.log('gameOver');
      _gameOver();
      return;
    }
  }

  var _checkTetris = function() {
    if (Board.isTetris()) {
      Board.tetris();
      Renderer.updateScore(Board.getScore());
    }
  }

  var _gameOver = function() {
    console.warn('Game Over');
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
    if (!isNaN(direction)) {
      _rotateBlock(direction);
    } else if (Board.canMove(_currentBlock, direction)) {
      _moveBlock(direction);
    }
    if (!Board.canMove(_currentBlock, 'down')) {

    }

    Renderer.render(Board.getGrid());
  }

  var _rotateBlock = function(direction) {
    Board.clearCurrentBlockPosition(_currentBlock);
    _currentBlock.rotate(direction);
    Board.updateGrid(_currentBlock);
  }

  var _listenForKeyPress = function() {
    Listener.listenForKeyPress(registerKeyPress);
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