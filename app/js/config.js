define('config',
    function () {
        'use strict';
        var config = {
            'DRAWER': 'canvas',
            'MS_PER_UPDATE': 1000/60,
            'DEBUG': true,
            'GRAVITY': 300,
            'DELTA': 5
        };
        
        Object.freeze(config);
        return config;
    }
);