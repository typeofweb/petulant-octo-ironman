define('Vec2',
    [],
    function () {
        'use strict';
        function Vec2 (x, y) {
            this.x = Number.isFinite(x) ? x : 0;
            this.y = Number.isFinite(y) ? y : 0;
        }

        Vec2.prototype.isZero = function () {
            return (this.x || this.y) ? false : true;
        };
        
        Vec2.prototype.len = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };
        
        Vec2.prototype.sum = function (vec) {
            return new Vec2(this.x + vec.x, this.y + vec.y);
        };
        
        Vec2.prototype.diff = function (vec) {
            return new Vec2(this.x - vec.x, this.y - vec.y);
        };
        
        Vec2.prototype.product = function (c) {
            return new Vec2(this.x * c, this.y * c);
        };
        
        Vec2.prototype.add = function (vec) {
            this.x += vec.x;
            this.y += vec.y;
            return this;
        };
        
        Vec2.prototype.sub = function (vec) {
            this.x -= vec.x;
            this.y -= vec.y;
            return this;
        };
        
        Vec2.prototype.mul = function (c) {
            this.x *= c;
            this.y *= c;
            return this;
        };
        
        return Vec2;
    }
);