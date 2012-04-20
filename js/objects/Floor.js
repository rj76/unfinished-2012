define(function() {
    function Floor() {
        var self = this;
        this.name = 'floor';

        this.events = [];

        var grass = THREE.ImageUtils.loadTexture( "images/grass.png" );
        grass.wrapT = grass.wrapS = THREE.RepeatWrapping;

        var plane = new THREE.PlaneGeometry(
            10, 10,  // width and height
            10, 10   // resolution
        );
        plane.receiveShadow = true;

        for (var i=0;i<plane.faceVertexUvs[0].length;i ++ ) {
            var uvs = plane.faceVertexUvs[ 0 ][ i ];

            for (j=0;j<uvs.length;j ++) {
                uvs[ j ].u *= 8;
                uvs[ j ].v *= 8;
            }
        }

        this.meshCanvas = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ map: grass, wireframe: false }));
        this.meshCanvas.position.x = this.meshCanvas.position.y = 0;
        this.meshCanvas.rotation.x = -90 * Math.PI / 180;
        this.meshCanvas.scale.x = this.meshCanvas.scale.y = this.meshCanvas.scale.z = 120;
        this.meshCanvas.receiveShadow = true;
        this.done = true;

        this.world.events.add({
            name: self.name+'.start',
            start: 0,
            action: function() { self.world.addToScene(self.meshCanvas); }
        });

        return this;
    }

    return Floor;
});
