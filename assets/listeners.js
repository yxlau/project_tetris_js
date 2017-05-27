"use strict";
console.log('listeners loaded');
var TETRIS = TETRIS || {};

TETRIS.ListenerMod = (function($) {

  var _reservedKeys = {
    37: 'left',
    39: 'right',
    40: 'down',
    68: -90,
    70: 90,
  }

  var _isNoRepeats = {
    68: true,
    70: true,
  }

  var _repeatAttempt = false;

  var init = function(callback) {
    console.log('ListenerMod', 'init');
    $('#start').on('click', callback)
  }

  var listenForKeyPress = function(registerKeyPress) {
    $(document).on('keydown', function(e) {
      var key = e.keyCode
      if (_repeatAttempt && _isNoRepeats[key]) {
        return;
      }
      if (_reservedKeys[key]) {
        e.preventDefault();
        registerKeyPress(_reservedKeys[e.keyCode]);
        _repeatAttempt = _isNoRepeats[key] ? true : false;
      }
    });
    $(document).on('keyup', function(e) {
      _repeatAttempt = false;
    });
  }


  return {
    init: init,
    listenForKeyPress: listenForKeyPress
  }
})($);