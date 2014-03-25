define('drawers/CanvasDrawer',
    [],
    function () {
        function CanvasDrawer () {
            this.canvas = document.querySelector('canvas');
            this.ctx = this.canvas.getContext('2d');
        }
        
        CanvasDrawer.prototype.drawObject = function (obj, position) {
            position = position || obj.position;
            var x = position.x - obj.wx.x;
            var y = position.y - obj.wy.y;
            
            var sizeX = obj.wx.x*2;
            var sizeY = obj.wy.y*2
            
            var image = obj.resource.getImage();
            
            if (image) {
                this.ctx.drawImage(image, x, y, sizeX, sizeY);
            } else {
                this.ctx.fillStyle = '#ff0000';
                this.ctx.fillRect(x, y, sizeX, sizeY);
            }
        };
        
        return CanvasDrawer;
    }
);