function Cartman(scene, posX, posY) {
    var self = this;
    this.name = 'cartman';

    this.posY = 152;
    this.scale = 40;
    this.events = [];
    this.cartman = false;

    this.coords = getPosInGrid(posX, posY);

    this.events = [];

    this.done = false;

    var loader = new THREE.JSONLoader();
    loader.load("blender/convert/cartman.js", cartmanLoaded);

    function cartmanLoaded(geometry) {
        var faceMaterial = new THREE.MeshFaceMaterial();
        faceMaterial.morphTargets = true;
        var morph = new THREE.MorphAnimMesh(geometry, faceMaterial);
        morph.position.x = self.coords[0];
        morph.position.z = self.coords[1];
        morph.position.y = self.posY;
        morph.rotation.y = 50;
        morph.scale.x = morph.scale.y = morph.scale.z = self.scale;
        self.cartman = morph;

        self.done = true;
    }

    this.events.push({
        name: 'start',
        start: 0,
        action: function() { scene.add(self.cartman); }
    });

    allEvents.push(this);

    return this;
}

