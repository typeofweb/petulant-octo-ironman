define('Drawer',
    ['config', 'drawers/CanvasDrawer'],
    function (config, CanvasDrawer) {
        'use strict';
        switch (config.DRAWER) {
            case 'canvas':
                return CanvasDrawer;
            default:
                return CanvasDrawer;
        }
    }
);