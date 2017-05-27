"use strict";
console.log('listeners loaded');
var TETRIS = TETRIS || {};

TETRIS.ListenerMod = (function($) {

  var _directionKey = {
    37: 'left',
    39: 'right',
    40: 'down',

  }

  var _rotationKey = {
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

  var listenForKeyPress = function(callbacks) {
    $(document).on('keydown', function(e) {
      var key = e.keyCode
      if (_directionKey[key]) {
        e.preventDefault();
        callbacks.registerMove(_directionKey[key]);
      } else if (_rotationKey[key]) {
        e.preventDefault();
        if (!_repeatAttempt) {
          callbacks.registerRotation(_rotationKey[key]);
          _repeatAttempt = true;
        }
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