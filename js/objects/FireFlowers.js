define(['generic/Wobj'], function (Wobj) {
    function FireFlowers() {
        var self = this;
        this.name = 'fireflowers';

        this.flowers = [];
        this.posY = 43;
        this.events = [];
        this.material = false;
        this.geometry = false;
        var clock = new THREE.Clock(1);

        this.done = false;

        this.loadModel("blender/convert/probeersel.js", flowerLoaded);

        function flowerLoaded(geometry) {
            parseAnimations( geometry );
            var faceMaterial = new THREE.MeshFaceMaterial();
            faceMaterial.morphTargets = true;
            for (var i=0;i<self.world.numFlowersZ; i++) {
                for (var j=0; j<self.world.numFlowersX;j++) {
                    morphColorsToFaceColors(geometry);

                    var morph = new THREE.MorphAnimMesh(geometry, faceMaterial);
                    var positions = self.world.getPosInGrid(j, i);
                    morph.position.x = positions[0];
                    morph.position.z = positions[1];
                    morph.position.y = self.posY;
                    morph.rotation.y = 100;
                    morph.scale.x = morph.scale.y = morph.scale.z = 20;
//                    morph.visible = false;
                    morph.receiveShadow = true;

                    var animation = geometry.animations[geometry.firstAnimation];
                    morph.firstAnimation = animation;
//                    morph.animations = geometry.animations;
                    morph.rotation.y = 0;
//                    morph.speed = randomRange(.5, 1);
                    morph.duration = 1000 * ( ( animation.max - animation.min ) / 6 );
                    morph.baseDuration = morph.duration;

//                    morph.setFrameRange( animation.min, animation.max );

                    self.flowers.push(morph);
                }
            }

            self.done = true;
        }

        function morphColorsToFaceColors(geometry) {
            if (geometry.morphColors && geometry.morphColors.length) {
                var colorMap = geometry.morphColors[0];
                for (var i=0; i<colorMap.colors.length; i++) {
                    geometry.faces[i].color = colorMap.colors[i];
                }
            }
        }

        this.world.events.add({
            name: self.name+'.start',
            start: 0,
            action: function() {
                for (var i=0;i<self.flowers.length;i++) {
                    self.world.addToScene(self.flowers[i]);
                }
//
                for (var i=0;i<self.flowers.length;i++) {
//                    self.flowers[i].visible = true;
                    playAnimation(self.flowers[i], 6);
                }
            }
        });

        this.world.events.add({
            name: self.name+'.animate',
            start: 0,
            step: 0.1,
            action: function() {
                var delta = clock.getDelta();
                for (var i=0;i<self.flowers.length;i++) {
                    self.flowers[i].updateAnimation(1000 * delta);
                }
                self.world.events.setTimer(self.name+'.animate');
            }
        });

        function playAnimation(mesh, fps) {
            var animation = mesh.firstAnimation;

//            mesh.setFrameRange( animation.min, animation.max );
            mesh.duration = 1000 * ( ( animation.max - animation.min ) / fps );
            mesh.baseDuration = mesh.duration;
            mesh.time = 0;

        }

        //

        function parseAnimations( geometry ) {

            var firstAnimation, animations = {};

            var pattern = /([a-z]+)_(\d+)/;

            for ( var i = 0, il = geometry.morphTargets.length; i < il; i ++ ) {

                var morph = geometry.morphTargets[ i ];
                var parts = morph.name.match( pattern );

                if ( parts && parts.length > 1 ) {
                    var label = parts[ 1 ];
                    var num = parts[ 2 ];

                    if ( ! animations[ label ] ) {

                        animations[ label ] = { frames: [], min: Infinity, max: -Infinity };

                    }

                    animations[ label ].frames.push( i );

                    if ( i < animations[ label ].min ) animations[ label ].min = i;
                    if ( i > animations[ label ].max ) animations[ label ].max = i;

                    if ( ! firstAnimation ) firstAnimation = label;

                }

            }

            geometry.animations = animations;
            geometry.firstAnimation = firstAnimation;

        }


//        this.duration = 50;//5000;
//        this.keyframes = 45;
//        this.interpolation = this.duration / this.keyframes;
//        this.lastKeyframe = 0;
//        this.currentKeyframe = 0;

//        this.events.push({
//            start: 0,
//            name: 'move',
//            step: 1,
//            action: function() {
//                var delta = self.clock.getDelta();
//                if (self.flowers.length) {
//                    for (var i=0;i<self.flowers.length;i++) {
//                        self.flowers[i].updateAnimation(1000 * delta);
//                    }
//                }
//                return;
//                if (self.frameCounter > 30)
//                    self.frameCounter = 0;
//
//                for (var i=0;i<self.flowers.length;i++) {
//                    var flower = self.flowers[i];
//                    for (var j=0;i<flower.morphTargetInfluences.length;j++) {
//                        flower.morphTargetInfluences[i] = 0;
//                    }
//
//                    flower.morphTargetInfluences[Math.floor(self.frameCounter)] = 1;
//                    self.frameCounter += 0.5;
//                }
//
//                // Alternate morph targets
//                var delta = self.clock.getDelta();
//                var time = Date.now() % self.duration;
//
//                self.keyframe = Math.floor( time / self.interpolation );
//
//                if (self.keyframe != self.currentKeyframe) {
//                    for (var i=0;i<self.flowers.length;i++) {
//                        var flower = self.flowers[i];
//                        flower.morphTargetInfluences[self.lastKeyframe] = 0;
//                        flower.morphTargetInfluences[self.currentKeyframe] = 1;
//                        flower.morphTargetInfluences[self.keyframe] = 0;
//                        console.log(self.keyframe);
//                    }
//
//                    self.lastKeyframe = self.currentKeyframe;
//                    self.currentKeyframe = self.keyframe;
//                    flower.updateAnimation( 1000 * delta );
//                }
//
//                for (var i=0;i<self.flowers.length;i++) {
//                    var mesh = self.flowers[i];
//                    mesh.updateAnimation( 1000 * delta );
//                    mesh.morphTargetInfluences[self.keyframe] = (time % self.interpolation) / self.interpolation;
//                    mesh.morphTargetInfluences[self.lastKeyframe] = 1 - mesh.morphTargetInfluences[self.keyframe];
//                }
//                setTimer(self.name+'.move');
//            }
//        });

        return this;
    }

    extend(FireFlowers, Wobj);

    return FireFlowers;
});

