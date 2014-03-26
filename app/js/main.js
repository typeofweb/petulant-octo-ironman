require.config({
    baseUrl: 'js'
});

require(['GameManager'], function(GameManager) {
    'use strict';
    var game = new GameManager();
    game.init();
    
    document.addEventListener('keydown', function (e) {
        if (game.onKeyDown(e)) {
            e.preventDefault();
        }
    });
    document.addEventListener('keyup', function (e) {
        if (game.onKeyUp(e)) {
            e.preventDefault();
        }
    });
    
    window.game = game;
});