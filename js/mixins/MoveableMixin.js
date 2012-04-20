define(function() {
    var MoveableMixin = function() {
        var curvesInOut = [
            'Quadratic',
            'Quartic',
            'Sinusoidal',
            'Circular',
            'Back'
        ];

        // moving
        this.generalMove = function(xPositions, yPositions, zPositions, length, o, onComplete, inOut) {
            var startPositions = {};
            var endPositions = {};

            if (xPositions) {
                startPositions.x = xPositions[0];
                endPositions.x = xPositions[1];
            }

            if (yPositions) {
                startPositions.y = yPositions[0];
                endPositions.y = yPositions[1];
            }

            if (zPositions) {
                startPositions.z = zPositions[0];
                endPositions.z = zPositions[1];
            }

//        var position = { y: thisIn.movement > 0 ?  thisIn.posY: thisIn.maxY, x: thisIn.oldPosX, z: thisIn.oldPosZ };
//        var target = { y: thisIn.movement > 0 ? thisIn.maxY : thisIn.posY, x: thisIn.posX, z: thisIn.posZ };

            var tween = new TWEEN.Tween(startPositions).to(endPositions, (length-.1)*1000).easing(giveEase(inOut));

            tween.onUpdate(function() {
                if (xPositions) {
                    o.position.x = startPositions.x;
                }
                if (yPositions) {
                    o.position.y = startPositions.y;
                }
                if (zPositions) {
                    o.position.z = startPositions.z;
                }
            });

            tween.onComplete(onComplete);
            tween.start();
        };

        function giveEase(inOrOut) {
            return eval('TWEEN.Easing.' + curvesInOut[parseInt(randomRange(0, curvesInOut.length-1))] + '.Ease' + inOrOut);
        };

    };

    return MoveableMixin;
});
