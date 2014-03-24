define('Vec2',
    [],
    function () {
        function Vec2 (x, y) {
            this.x = x || null;
            this.y = y || null;
        };

        Vec2.prototype.isNull = function () {
            return !(Number.isFinite(this.x) && Number.isFinite(this.y));
        };
        
        return Vec2;
    }
);