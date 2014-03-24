define('Entity',
    ['Vec2', 'Drawer', 'Resource', 'config'],
    function (Vec2, Drawer, Resource, config) {
        var drawer = new Drawer();
        var dt = config.MS_PER_UPDATE/1000;
        
        function Entity (config) {
            this.id = config.id || Math.random().toString(30).substr(2);
            this.position = new Vec2();
            this.velocity = new Vec2();
            this.acceleration = new Vec2();
            this.speed = config.speed;
            this.collidable = config.collidable === false ? false : true;
            this.movable = config.movable === true ? true : false;
            
            this.resource = new Resource({
                image: config.image,
                size: config.size
            });
        };
        
        Entity.prototype.collideWith = function () {
            if (this.movable) {
                throw "Error: Abstract method collideWith";
            }
        };

        Entity.prototype.render = function (inter) {
            var cPos = new Vec2();
            cPos.x = this.position.x + this.velocity.x * dt * inter + this.acceleration.x * dt * dt / 2 * inter;
            cPos.y = this.position.y + this.velocity.y * dt * inter + this.acceleration.y * dt * dt / 2 * inter;
            
            drawer.drawObject(this, cPos);
        };

        Entity.prototype.update = function () {            
            this.velocity.x += this.acceleration.x * dt;
            this.velocity.y += this.acceleration.y * dt;
            
            this.position.x  += this.velocity.x * dt + this.acceleration.x * dt * dt / 2;
            this.position.y  += this.velocity.y * dt + this.acceleration.y * dt * dt / 2;
        };
        
        Entity.prototype.stopMoving = function () {
            this.acceleration.x = 0;
            this.acceleration.y = 0;
            this.velocity.x = 0;
            this.velocity.y = 0;
        };
        
        Entity.prototype.checkCollisionWith = function (obj) {
            if (!this.collidable) {
                return false;
            }
            
            if (this.AABB(obj)) {
                obj.collideWith(this);
                this.collideWith(obj);
            }
        };
        
        Entity.prototype.AABB = function (obj) {
            var size1 = this.resource.getInGameSize();
            var size2 = obj.resource.getInGameSize();
            
            var o1 = {topLeft: new Vec2(this.position.x, this.position.y), bottomRight: new Vec2(this.position.x + size1.x, this.position.y + size1.y)};
            var o2 = {topLeft: new Vec2(obj.position.x, obj.position.y), bottomRight: new Vec2(obj.position.x + size2.x, obj.position.y + size2.y)};
            
            if(o1.bottomRight.x < o2.topLeft.x || o1.topLeft.x > o2.bottomRight.x) return false;
            if(o1.bottomRight.y < o2.topLeft.y || o1.topLeft.y > o2.bottomRight.y) return false;
            return true;
        };
        
        return Entity;
    }
);