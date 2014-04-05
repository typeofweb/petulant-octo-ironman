define('GameManager',
    ['config', 'keys', 'Entity', 'PhysicsEngine', 'debug'],
    function (config, keys, Entity, PhysicsEngine, debug) {
        'use strict';
        var physicsEngine = new PhysicsEngine();
        function GameManager () {
            this.objects = [];
            this.keys = {};
        }
        
        GameManager.prototype.tick = window.requestAnimationFrame.bind(window);
        
        // GameManager.prototype.tick = (function () {
        //     return function (cb) {
        //         var img = new Image();
        //         img.onerror = function() { 
        //             img.onerror = null; 
        //             cb(); 
        //         };
        //         img.src = 'data:image/png,' + Math.random();
        //     };
        // }());

        GameManager.prototype.init = function () {
            var bg = new Entity({id: 'background', image: 'img/bg.png', collidable: false, size: {x: 640, y: 480}});
            bg.position.x = bg.wx.x;
            bg.position.y = bg.wy.y;
            this.objects.push(bg);
            
            var bottom = new Entity({id: 'bottom', size: {x: 640, y: 50}});
            bottom.position.x = 320;
            bottom.position.y = 505;
            this.objects.push(bottom);
            
            bottom = new Entity({id: 'top', size: {x: 640, y: 50}});
            bottom.position.x = 320;
            bottom.position.y = -25;
            this.objects.push(bottom);
            
            
            bottom = new Entity({id: 'block', size: {x: 50, y: 50}});
            bottom.position.x = 25;
            bottom.position.y = 125;
            this.objects.push(bottom);
            
            bottom = new Entity({id: 'block', size: {x: 85, y: 50}});
            bottom.position.x = 92;
            bottom.position.y = 175;
            this.objects.push(bottom);
            
            bottom = new Entity({id: 'block', size: {x: 50, y: 50}});
            bottom.position.x = 175;
            bottom.position.y = 150;
            this.objects.push(bottom);
            
            bottom = new Entity({id: 'block', size: {x: 50, y: 50}});
            bottom.position.x = 245;
            bottom.position.y = 225;
            this.objects.push(bottom);
            
            
            
            var player = new Entity({id: 'player', image: 'img/player2.png', scale: 1, movable: true, speed: 200, size: {x: 20, y: 35}});
            player.resource.frames = 9;
            player.position.x = player.wx.x;
            player.position.y = player.wy.y;
            player.acceleration.y = 300;
            player.gravity = true;
            player.canJump = true;
            player.canShoot = true;
            player.collideWith = function (obj, projectionVector) {
                var side = physicsEngine.getCollisionSideFromProjection(projectionVector);
                switch (side) {
                case 'top':
                    this.velocity.y = 0;
                    this.acceleration.y = 0;
                    this.canJump = true;
                    break;
                case 'right':
                    this.velocity.x = 0;
                    this.acceleration.x = 0;
                    break;
                case 'bottom':
                    if (this.velocity.y < 0) {
                        this.velocity.y = 0;
                    }
                    if (this.acceleration.y < 0) {
                        this.acceleration.y = 0;
                    }
                    break;
                case 'left':
                    this.velocity.x = 0;
                    this.acceleration.x = 0;
                    break;
                }
                this.position.add(projectionVector.mul(-1));
            };
            player.update = function () {
                Object.getPrototypeOf(this).update.call(this);
                if (this.velocity.y >= config.DELTA) {
                    this.canJump = false;
                }
            };
            player.jump = function () {
                if (this.canJump) {
                    this.velocity.y -= 300;
                    this.canJump = false;
                }
            };
            var _gm = this;
            player.shoot = function () {
                if (!this.canShoot) {
                    return;
                }
                var rocket = new Entity({id: 'rocket', movable: true, speed: 800, size: {x: 20, y: 10}});
                rocket.collideWith = function (obj) {
                    rocket.offGame = true;
                    --obj.life;
                };
                var facing = (player.facing > 0) ? 1 : -1;
                rocket.position.add(player.position).add({x: facing * 20, y: 0});
                rocket.velocity.x = facing * rocket.speed;
                _gm.objects.push(rocket);
                this.canShoot = false;
                setTimeout(function () {
                    player.canShoot = true;
                }, 100);
            };
            this.objects.push(player);
            this.player = player;
            
            this.previous = Date.now();
            this.lag = 0;
            this.tick(this.loop.bind(this));
        };

        GameManager.prototype.loop = function () {
            var current = Date.now();
            var elapsed = current - this.previous;
            this.previous = current;
            this.lag += elapsed;
            
            debug.fpsCounter(elapsed);

            this.handleInput();
            
            var failSafe = 0;
            while (this.lag >= config.MS_PER_UPDATE && failSafe++ < 10) {
                this.updateAll();
                this.lag -= config.MS_PER_UPDATE;
            }
            if (failSafe >= 10) {
                console.error ('failSafe!', this.lag);
                this.lag = 0;
            }
            
            var interpolation = this.lag / config.MS_PER_UPDATE;
            if (interpolation < 0) {
                interpolation = 0;
            }
            if (interpolation > 1) {
                interpolation = 1;
            }
            this.renderAll(interpolation);
            
            this.tick(this.loop.bind(this));
        };

        GameManager.prototype.updateAll = function () {
            this.objects.forEach(function (o) {
                if (o.movable) {
                    physicsEngine.newtonEuler(o);
                }
                o.update();
            }.bind(this));
            
            var collidableObjects = this.objects.filter(function (obj) {
                return obj.collidable;
            });
            
            for (var i = 0; i < collidableObjects.length; ++i) {
                for (var j = i+1; j < collidableObjects.length; ++j) {
                    var projectionVector = physicsEngine.aabb(collidableObjects[i], collidableObjects[j]);
                    if (projectionVector) {
                        collidableObjects[i].collideWith(collidableObjects[j], projectionVector);
                        collidableObjects[j].collideWith(collidableObjects[i], projectionVector);
                    }
                }
            }

            // remove off game objects
            this.objects.forEach(function (o, index) {
                if (o.movable && (o.position.x > 640 || o.position.x < 0 || o.position.y > 480 || o.position.y < 0)) {
                    o.offGame = true;
                }
                if (o.life <= 0) {
                    o.offGame = true;
                }
                if (o.offGame) {
                    this.objects.splice(index,1);
                }
            }.bind(this));
        };

        GameManager.prototype.renderAll = function (nextFrame) {
            this.objects.forEach(function (o) {
                o.render(nextFrame);
            });
        };
        
        GameManager.prototype.onKeyDown = function (e) {
            switch (e.keyCode) {
            case keys.UP:
            case keys.RIGHT:
            case keys.DOWN:
            case keys.LEFT:
            case keys.SPACE:
            case keys.c:
                this.keys[e.keyCode] = true;
                break;
            default:
                return false;
            }

            return true;
        };
        
        GameManager.prototype.onKeyUp = function (e) {
            switch (e.keyCode) {
                case keys.UP:
                case keys.RIGHT:
                case keys.DOWN:
                case keys.LEFT:
                case keys.SPACE:
                case keys.c:
                    this.keys[e.keyCode] = false;
                    break;
                default:
                    return false;
            }

            return true;
        };

        GameManager.prototype.onMouseDown = function (e) {
            console.log(e.offsetX, e.offsetY);
            return true;
        };
        
        GameManager.prototype.queryObjects = function (q) {
            return this.objects.filter(function (obj) {
                return obj.id === q;
            });
        };

        GameManager.prototype.handleInput = function () {
            for (var key in this.keys) {
                if (!this.keys.hasOwnProperty(key)) {
                    continue;
                }

                if (this.keys[key] === true) {
                    switch(+key) {
                        case keys.LEFT:
                            this.player.velocity.x = -this.player.speed;
                            break;
                        case keys.RIGHT:
                            this.player.velocity.x = +this.player.speed;
                            break;
                        case keys.SPACE:
                            this.player.jump();
                            break;
                        case keys.c:
                            this.player.shoot();
                            break;
                    }
                } else {
                    switch(+key) {
                        case keys.LEFT:
                        case keys.RIGHT:
                            this.player.velocity.x = 0;
                            break;
                    }
                    delete this.keys[key];
                }
            }
        };
        
        return GameManager;
    }
);