define('Resource',
    ['Vec2', 'config'],
    function (Vec2, config) {
        var dt = config.MS_PER_UPDATE;
        
        function Resource (config) {
            if (config.image) {
                this.image = new Image();
                this.image.src = config.image;
                this.image.onload = function () {
                    this.imgSize = new Vec2(this.image.width, this.image.height);
                }.bind(this);
            }
            this.size = config.size;
            this.scale = config.scale || 1.0;
            this.frame = 0;
            this.count = 0;
            this.animationDir = 1;
        };
        
        Resource.prototype.getImage = function () {
            return this.image;
        };
        
        Resource.prototype.nextFrame = function (direction) {
            this.direction = direction;
            if ( (this.count += dt) > 100) {
                if (this.animationDir > 0) {
                    this.frame++;
                } else {
                    this.frame--;
                }
                this.count = 0;
                if (this.frame <= 0) {
                    this.frame = 0;
                    this.animationDir = 1;
                } else if (this.frame >= this.frames-1) {
                    this.frame = this.frames-1;
                    this.animationDir = -1;
                }
            }
            return this.frame;
        };
        
        Resource.prototype.resetFrame = function (direction) {
            this.count = 0;
            this.direction = direction;
            return this.frame = 0;  
        };
        
        Resource.prototype.getRenderingInfo = function () {
            var ret = {
                sx: this.size.x * this.frame,
                sy: (this.direction < 0) ? this.size.y : 0,
                sw: this.size.x / this.scale,
                sh: this.size.y / this.scale
            };
            
            return ret;
        };
        
        return Resource;
    }
);