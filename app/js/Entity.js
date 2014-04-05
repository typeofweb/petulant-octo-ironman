define('Entity',
    ['Vec2', 'Drawer', 'Resource', 'config'],
    function (Vec2, Drawer, Resource, config) {
        'use strict';
        var drawer = new Drawer();
        var dt = config.MS_PER_UPDATE/1000;
        
        function Entity (config) {
            this.id = config.id || Math.random().toString(30).substr(2);
            this.position = new Vec2();
            this.wx = new Vec2(config.size.x/2, 0)
            this.wy = new Vec2(0, config.size.y/2);
            
            this.facing = 1;
            
            this.velocity = new Vec2();
            this.acceleration = new Vec2();
            this.speed = config.speed;
            this.collidable = config.collidable !== false;
            this.movable = config.movable === true;

            this.life = 1;
            
            this.resource = new Resource({
                image: config.image,
                scale:  config.scale,
                size: new Vec2(config.size.x, config.size.y)
            });
        }
        
        Entity.prototype.getDimensions = function () {
            return {
                topLeft: new Vec2(this.position.x - this.wx.x, this.position.y - this.wy.y),
                bottomRight: new Vec2(this.position.x + this.wx.x, this.position.y + this.wy.y)
            };
        };
        
        Entity.prototype.collideWith = function () {
            if (this.movable) {
                throw 'Error: Not implemented';
            }
        };

        Entity.prototype.render = function (inter) {
            var cPos = new Vec2();
            cPos.x = this.position.x + this.velocity.x * dt * inter + this.acceleration.x * dt * dt / 2 * inter;
            cPos.y = this.position.y + this.velocity.y * dt * inter + this.acceleration.y * dt * dt / 2 * inter;
            
            drawer.drawObject(this, cPos);
        };

        Entity.prototype.update = function () {
            if (this.movable) {
                if (this.velocity.x) {
                    this.facing = this.velocity.x;
                }
                
                if (this.velocity.len() > 5) {
                    this.resource.nextFrame(this.facing);
                } else {
                    this.resource.resetFrame(this.facing);
                }
            }
        };
        
        Entity.prototype.stopMoving = function () {
            this.acceleration.x = 0;
            this.acceleration.y = 0;
            this.velocity.x = 0;
            this.velocity.y = 0;
        };
        
        return Entity;
    }
);