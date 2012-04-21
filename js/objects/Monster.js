define(['generic/Wobj'], function(Wobj) {
    function Monster() {
        this.name = 'monster';
        var self = this;
        var monster = false;
        var clock = new THREE.Clock(0);

        this.loadModel( "blender/convert/monster.js", function(geometry) {
            // adjust color a bit
            var material = geometry.materials[0];
            material.morphTargets = true;
            material.color.setHex( 0xffaaaa );
            material.ambient.setHex( 0x222222 );

            var faceMaterial = new THREE.MeshFaceMaterial();

            var x = self.world.getPosInGridX(8);
            var z = self.world.getPosInGridZ(4);

            monster = new THREE.MorphAnimMesh(geometry, faceMaterial);

            // one second duration
            monster.duration = 1000;

            // random animation offset
            monster.time = 1000 * Math.random();

            var s = THREE.Math.randFloat(.1, .01);
            monster.scale.set(s, s, s);

            monster.position.set(x, 0, z);
            monster.rotation.y = THREE.Math.randFloat(-0.25, 0.25);

            monster.matrixAutoUpdate = false;
            monster.updateMatrix();

            self.done = true;

        });

        this.world.events.add({
            name: self.name+'.start',
            start: 0,
            action: function() { self.world.addToScene(monster); }
        });

        this.world.events.add({
            name: self.name+'.animate',
            start: 0,
            step: .1,
            action: function() {
                var delta = clock.getDelta();
                monster.updateAnimation(1000 * delta);
                self.world.events.setTimer(self.name+'.animate');
            }
        });

        return this;
    }

    extend(Monster, Wobj);

    return Monster;
});
