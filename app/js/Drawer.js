define('Drawer',
    ['config', 'drawers/CanvasDrawer'],
    function (config, CanvasDrawer) {
        switch (config.DRAWER) {
            case 'canvas':
                return CanvasDrawer;
            default:
                return CanvasDrawer;
        }
    }
);