define('GameManager',
    ['config', 'keys', 'Entity', 'debug'],
    function (config, keys, Entity, debug) {
        function GameManager () {
            this.objects = [];
            this.player;
        }

        GameManager.prototype.init = function () {
            this.previous = Date.now();
            this.lag = 0;
            
            var bg = new Entity({id: 'background', image: 'img/bg.png', collidable: false, size: {x: 640, y: 480}});
            this.objects.push(bg);
            
            var bottom = new Entity({id: 'bottom', size: {x: 640, y: 50}});
            bottom.position.x = 0;
            bottom.position.y = 430;
            this.objects.push(bottom);
            
            bottom = new Entity({id: 'bottom', size: {x: 50, y: 50}});
            bottom.position.x = 0;
            bottom.position.y = 100;
            this.objects.push(bottom);
            
            var player = new Entity({id: 'player', image: 'img/player.png', movable: true, speed: 200, size: {x: 44, y: 64.333333333}});
            player.acceleration.y = 300;
            player.collideWith = function (obj) {
                this.velocity.y = 0;
                this.acceleration.y = 0;
            };
            this.objects.push(player);
            this.player = player;
            
            window.requestAnimationFrame(this.loop.bind(this));
        };

        GameManager.prototype.loop = function () {
            var current = Date.now();
            var elapsed = current - this.previous;
            this.previous = current;
            this.lag += elapsed;
            
            debug.fpsCounter(elapsed);
            
            var failSafe = 0;
            
            while (this.lag >= config.MS_PER_UPDATE && failSafe++ < 10) {
                this.updateAll();
                this.lag -= config.MS_PER_UPDATE;
            }
            if (failSafe >= 10) {
                console.error ('failSafe!', this.lag);
            }
            
            var interpolation = this.lag / config.MS_PER_UPDATE;
            if (interpolation < 0) {
                interpolation = 0;
            }
            if (interpolation > 1) {
                interpolation = 1;
            }
            this.renderAll(interpolation);
            
            window.requestAnimationFrame(this.loop.bind(this));
        };
        
        GameManager.prototype.applyGravity = function (obj) {
            // var dt = config.MS_PER_UPDATE/1000;
            // obj.velocity.y += config.GRAVITY * dt;
        };

        GameManager.prototype.updateAll = function () {
            this.objects.forEach(function (o) {
                o.update();
            });
            
            var movableObjects = this.objects.filter(function (obj) {
                return obj.movable;
            });
            
            movableObjects.forEach(function (o) {
                this.applyGravity(o);
            }.bind(this));
            
            var collidableObjects = this.objects.filter(function (obj) {
                return obj.collidable;
            });
            
            for (var i = 0; i < collidableObjects.length; ++i) {
                for (var j = i+1; j < collidableObjects.length; ++j) {
                    collidableObjects[i].checkCollisionWith(collidableObjects[j]);
                }
            }
        };

        GameManager.prototype.renderAll = function (nextFrame) {
            this.objects.forEach(function (o) {
                o.render(nextFrame);
            });
        };
        
        GameManager.prototype.onKeyDown = function (e) {
            switch (e.keyCode) {
                case keys.TOP:
                    return true;
                break;
                case keys.RIGHT:
                    this.player.velocity.x = this.player.speed;
                    return true;
                break;
                case keys.DOWN:
                    return true;
                break;
                case keys.LEFT:
                    this.player.velocity.x = -this.player.speed;
                    return true;
                break;
            }
        };
        
        GameManager.prototype.onKeyUp = function (e) {
            switch (e.keyCode) {
                case keys.TOP:
                break;
                case keys.RIGHT:
                    this.player.velocity.x = 0;
                    return true;
                break;
                case keys.DOWN:
                break;
                case keys.LEFT:
                    this.player.velocity.x = 0;
                    return true;
                break;
            }
        };
        
        GameManager.prototype.queryObjects = function (q) {
            return this.objects.find(function (obj) {
                return obj.id === q;
            });
        };
        
        return GameManager;
    }
);