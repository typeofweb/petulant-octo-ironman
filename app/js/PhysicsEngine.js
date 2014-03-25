define('PhysicsEngine',
    ['Vec2'],
    function (Vec2) {
        function PhysicsEngine () {
        }
        
        PhysicsEngine.prototype.AABB = function (obj1, obj2) {
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
            if (projectionVector.y != 0) {
                if (projectionVector.y > 0) {
                    return 'top';
                } else {
                    return 'bottom';
                }
            }
            if (projectionVector.x != 0) {
                if (projectionVector.x > 0) {
                    return 'left';
                } else {
                    return 'right';
                }
            }
            return null;
        };
        
        return PhysicsEngine;
    }
);