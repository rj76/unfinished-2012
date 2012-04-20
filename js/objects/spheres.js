function Sphere() {
//        console.log('creating sphere');
    var self = this;
    this.name = 'sphere';

    this.movement = -1; // -1 = down, 1 = up
    this.maxY = 300;

    this.posY = 50;

    var positions = getPosInGrid(1, 3);
    this.posX = positions[0];
    this.posZ = positions[1];

    this.events = [];

    this.sphere = new THREE.Mesh(
        new THREE.SphereGeometry(
            50,
            16,
            16),

        new THREE.MeshLambertMaterial({
            color: 0xCC0000
        })
    );

    this.sphere.doubleSided = true;
    this.sphere.position.x = this.posX;
    this.sphere.position.y = this.posY;
    this.sphere.position.z = this.posZ;

    this.done = true;

    this.moveDone = function() {
        var newPos = getRandPos();
        self.posX = newPos[0];
        self.posZ = newPos[1];

        self.movement *= -1;
    };

    this.move = function() {
        self.oldPosX = self.sphere.position.x;
        self.oldPosZ = self.sphere.position.z;
        setTimer(self.name+'.move');
        generalMove(self, barLength*4, self.sphere, self.moveDone);
    };

    this.events.push({
        name: 'start.scene',
        start: barLength,
        action: function() { scene.add(self.sphere); self.canMove = true; console.log('start, add scene'); }
    });

    this.events.push({
        name: 'start.invisible',
        start: 40*barLength,
        action: function() { self.sphere.visible = false; console.log('start, invisible'); }
    });

    this.events.push({
        name: 'start.visible',
        start: 57*barLength,
        action: function() { self.sphere.visible = true; console.log('start, visible'); }
    });

    this.events.push({
        name: 'move',
        start: barLength,
        step: barLength*4,
        action: self.move
    });

    allEvents.push(this);
    return this;
}

