define('Resource',
    [],
    function () {
        function Resource (config) {
            if (config.image) {
                this.image = new Image();
                this.image.src = config.image;
            }            
            this.config = config;
        }
        
        Resource.prototype.getInGameSize = function () {
            return {
                x: this.config.size.x,
                y: this.config.size.y  
            };
        };
        
        Resource.prototype.getImage = function () {
            return this.image;
        };
        
        return Resource;
    }
);