define('Vec2',
    [],
    function () {
        function Vec2 (x, y) {
            this.x = Number.isFinite(x) ? x : null;
            this.y = Number.isFinite(y) ? y : null;
        };

        Vec2.prototype.isNull = function () {
            return !(Number.isFinite(this.x) && Number.isFinite(this.y));
        };
        
        Vec2.prototype.len = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);  
        };
        
        Vec2.prototype.sum = function (vec) {
            return new Vec2(this.x + vec.x, this.y + vec.y);
        };
        
        Vec2.prototype.add = function (vec) {
            this.x += vec.x;
            this.y += vec.y;
        };
        
        Vec2.prototype.diff = function (vec) {
            return new Vec2(this.x - vec.x, this.y - vec.y);
        };
        
        Vec2.prototype.mul = function (c) {
            return new Vec2(this.x * c, this.y * c);
        };
        
        return Vec2;
    }
);