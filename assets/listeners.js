"use strict";
var TETRIS = TETRIS || {};

TETRIS.ListenerMod = (function($) {

  var _directionKey = {
    37: 'left',
    39: 'right',
    40: 'down',
  }

  var _rotationKey = {
    68: -1,
    70: 1
  }

  var _repeatAttempt = false;

  var init = function(startGame) {
    $('#start').on('click', startGame);
  }



  var _keyPressHandler = function(e) {
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
  }

  var disableStart = function() {
    $('#start').off('click');
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
    listenForKeyPress: listenForKeyPress,
    disableStart: disableStart
  }
})($);