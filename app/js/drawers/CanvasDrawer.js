define('drawers/CanvasDrawer',
    [],
    function () {
        function CanvasDrawer () {
            this.canvas = document.querySelector('canvas');
            this.ctx = this.canvas.getContext('2d');
        }
        
        CanvasDrawer.prototype.drawObject = function (obj, position) {
            position = position || obj.position;
            var x = position.x;
            var y = position.y;
            
            var inGameSize = obj.resource.getInGameSize();
            
            var image = obj.resource.getImage();
            
            if (image) {
                this.ctx.drawImage(image, x, y, inGameSize.x, inGameSize.y);
            } else {
                this.ctx.fillStyle = '#ff0000';
                this.ctx.fillRect(x, y, inGameSize.x, inGameSize.y);
            }
        };
        
        return CanvasDrawer;
    }
);