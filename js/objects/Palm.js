define(['generic/Wobj'], function(Wobj) {
    function Palm(geometry, posX, posY, num) {
        var self = this;
        this.name = 'palm'+num;
        this.geometry = geometry;
        this.posY = 3;
        this.scale = [.3, .5];
        this.coords = this.world.getPosInGrid(posX, posY);

        var faceMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, ambient: 0xffffff, vertexColors: THREE.VertexColors });
        var morph = new THREE.MorphAnimMesh(self.geometry, faceMaterial);
        morph.position.x = self.coords[0];
        morph.position.z = self.coords[1];
        morph.position.y = self.posY;
        morph.rotation.y = randomRange(0, 100);
        morph.scale.x = morph.scale.y = morph.scale.z = randomRange(self.scale[0], self.scale[1]);
        morph.receiveShadow = true;
        morph.castShadow = true;
        self.object = morph;

        return this;
    }

    extend(Palm, Wobj);

    return Palm;
});
