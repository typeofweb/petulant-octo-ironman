define('debug',
    ['config'],
    function (config) {
        'use strict';
        var fpsContainer = document.querySelector('.fps');
        var fpses = [];
        
        function arrayRotate (arr, el, len) {
            if (arr.length < len) {
                arr.push(el);
                return arr;
            } else {
                arr.shift();
                arr.push(el);
                return arr;
            }
        }
        function avg () {
            var sum = 0;
            Array.prototype.forEach.call(arguments, function (el) {
                sum += el;
            });
            return sum / arguments.length;
        }
        
        return {
            fpsCounter: function (dt) {
                if (!config.DEBUG) {
                    return;
                }
                if (dt > 10) {
                    arrayRotate(fpses, 1000 / dt, 50);
                }
                fpsContainer.textContent = avg.apply(null, fpses).toFixed(0);
            }
        };
    }
);