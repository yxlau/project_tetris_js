"use strict";
console.log('listeners loaded');
var TETRIS = TETRIS || {};

TETRIS.ListenerMod = (function($) {

  var _reservedKeys = {
    37: 'left',
    39: 'right',
    40: 'down'
  }

  var init = function(callback) {
    console.log('ListenerMod', 'init');
    $('#start').on('click', callback)
  }

  var listenForKeyPress = function(registerKeyPress) {
    console.log('ListenerMod listenForKeyPress')
    $(document).on('keydown', function(e) {
      if (_reservedKeys[e.keyCode]) {
        console.log('reservedKey');
        e.preventDefault();
        registerKeyPress(_reservedKeys[e.keyCode]);
      }
    })
  }

  return {
    init: init,
    listenForKeyPress: listenForKeyPress
  }
})($);