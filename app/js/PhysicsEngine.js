define('PhysicsEngine',
    ['Vec2', 'config'],
    function (Vec2, config) {
        'use strict';
        var dt = config.MS_PER_UPDATE/1000;
        
        function PhysicsEngine () {
        }
        
        PhysicsEngine.prototype.aabb = function (obj1, obj2) {
            var ox = (obj1.wx.len() + obj2.wx.len()) - Math.abs(obj1.position.diff(obj2.position).x);
            if (ox <= 0) {
                return null;
            }
            
            var oy = (obj1.wy.len() + obj2.wy.len()) - Math.abs(obj1.position.diff(obj2.position).y);
            if (oy <= 0) {
                return null;
            }
            
            var projectionVector;

            if (ox < oy) {
                projectionVector = new Vec2((obj1.position.x > obj2.position.x) ? ox : -ox, 0);
            } else {
                projectionVector = new Vec2(0, (obj1.position.y > obj2.position.y) ? oy : -oy);
            }
            return projectionVector;
        };
        
        PhysicsEngine.prototype.getCollisionSideFromProjection = function (projectionVector) {
            if (projectionVector.y !== 0) {
                if (projectionVector.y > 0) {
                    return 'top';
                } else {
                    return 'bottom';
                }
            }
            if (projectionVector.x !== 0) {
                if (projectionVector.x > 0) {
                    return 'left';
                } else {
                    return 'right';
                }
            }
            return null;
        };
        
        PhysicsEngine.prototype.getHalfAccDt = function (obj) {
            var tempAccDt = new Vec2().add(obj.acceleration);
            if (obj.gravity) {
                tempAccDt.add(new Vec2(0, config.GRAVITY));
            }
            return tempAccDt.mul(dt / 2);
        };
        
        PhysicsEngine.prototype.newtonEuler = function (obj) {
            if (!obj.gravity && obj.velocity.isZero() && obj.acceleration.isZero()) {
                return;
            }
            
            var tempAccDt = this.getHalfAccDt(obj);
            
            obj.velocity.add(tempAccDt);
            
            obj.position
                .add(obj.velocity.product(dt))
                .add(tempAccDt.mul(dt));
            
            obj.velocity.add(tempAccDt);
        };
        
        return PhysicsEngine;
    }
);