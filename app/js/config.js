define('config',
    function () {
        var config = {
            'DRAWER': 'canvas',
            'MS_PER_UPDATE': 1000/60,
            'DEBUG': true,
            'GRAVITY': 300
        };
        
        Object.freeze(config);
        return config;
    }
);