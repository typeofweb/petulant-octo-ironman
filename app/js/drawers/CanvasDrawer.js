define('drawers/CanvasDrawer',
    [],
    function () {
        function CanvasDrawer () {
            this.canvas = document.querySelector('canvas');
            this.ctx = this.canvas.getContext('2d');
        }
        
        CanvasDrawer.prototype.drawObject = function (obj, position) {
            position = position || obj.position;
            var dx = position.x - obj.wx.x;
            var dy = position.y - obj.wy.y;
            
            var dw = obj.wx.x*2;
            var dh = obj.wy.y*2
            
            var image = obj.resource.getImage();
            
            
            if (image) {
                if (obj.resource.frames) {
                    var f = obj.resource.getRenderingInfo();
                    this.ctx.drawImage(image, f.sx, f.sy, f.sw, f.sh, dx, dy, dw, dh);
                } else {
                    this.ctx.drawImage(image, dx, dy, dw, dh);
                }
            } else {
                this.ctx.fillStyle = '#ff0000';
                this.ctx.fillRect(dx, dy, dw, dh);
            }
        };
        
        return CanvasDrawer;
    }
);