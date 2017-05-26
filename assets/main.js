"use strict";

var TETRIS = TETRIS || {}

TETRIS.Main = (function(modules, $) {

  // this is so we don't have to worry about the order in which we inject our modules
  var Listener = modules.listener;
  var Helpers = modules.helpers;
  var Block = modules.blocks;
  var Board = modules.board;
  var Renderer = modules.renderer;

  var _interval, _currentBlock, _nextBlock;

  var init = function() {
    console.log('Main.init');
    Listener.init(_startGame);
    Board.init();
    Renderer.init();
  }

  var _runGame = function() {
    console.log('_runGame');
    if (Board.canMove(_currentBlock, 'down')) {
      _moveBlock('down');
    } else {
      _checkGameOver();
      _relinquishBlock();
      _checkTetris();
      _setUpNewBlock();
    }
    Renderer.render(Board.getGrid());
  }

  var _setUpNewBlock = function() {
    _currentBlock = _nextBlock || Block.getNewBlock();
    if (_nextBlock === _currentBlock) {
      _nextBlock = Block.getNewBlock();
    }
    Board.moveToStartPosition(_currentBlock);
    Board.updateGrid(_currentBlock);
    console.log('_nextBlock', _nextBlock.coords);
    Renderer.updateNextBlock(_nextBlock);
  }

  var _checkGameOver = function() {
    if (Board.gameOver(_currentBlock)) {
      console.log('gameOver');
      _gameOver();
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
    clearInterval(_interval);
    _currentBlock = _nextBlock = undefined;
    return;
  }

  var _moveBlock = function(direction) {
    console.log('main._moveBlock');
    Board.clearCurrentBlockPosition(_currentBlock);
    // Block.moveBlock(direction);
    _currentBlock.moveBlock(direction);
    Board.updateGrid(_currentBlock);
  }

  var _relinquishBlock = function() {
    console.log('main.relinquishBlock');
    Board.clearCurrentBlockPosition(_currentBlock);
    Board.dropBlock(_currentBlock);
  }

  // KeyPress registered. Move block
  var registerKeyPress = function(direction) {
    if (Board.canMove(_currentBlock, direction)) {
      _moveBlock(direction);
      Renderer.render(Board.getGrid());
    }
  }

  var _listenForKeyPress = function() {
    Listener.listenForKeyPress(registerKeyPress);
  }

  var _startGame = function() {
    console.log('_startGame');
    _listenForKeyPress();
    _nextBlock = Block.getNewBlock();
    _setUpNewBlock();
    Renderer.render(Board.getGrid());
    _interval = window.setInterval(
      _runGame, 500);
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