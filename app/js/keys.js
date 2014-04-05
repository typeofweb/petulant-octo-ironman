define('keys',
    function () {
        'use strict';
        var keys = {
            'UP': 38,
            'RIGHT': 39,
            'DOWN': 40,
            'LEFT': 37,
            'SPACE': 32,
            'c': 67
        };
        
        Object.freeze(keys);
        return keys;
    }
);