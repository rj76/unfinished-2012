define(['generic/Wobj', 'mixins/MoveableMixin'], function(Wobj, MoveableMixin) {
    function Cube(posX, posZ, length, color, group, isMoving) {
        var self = this;
        this.group = group;
        this.movement = 1; // -1 = down, 1 = up
        this.maxY = 300;
        this.length = length ? length : this.group.world.music.getBarLength();
        this.isMoving = isMoving;
        this.posX = posX;
        this.posY = 43;
        this.posZ = posZ;
        this.oldPosX = this.posX;
        this.oldPosZ = this.posZ;
        this.color = color ? color : 0xFF0000; // default black

        this.object = new THREE.Mesh(
            new THREE.CubeGeometry(50, 50, 50),
            new THREE.MeshLambertMaterial({ color: self.color })
        );

        this.object.position.x = this.posX;
        this.object.position.y = this.posY;
        this.object.position.z = this.posZ;

        this.done = true;

        this.moveDone = function() {
            if (self.isMoving) {
                var newPos = self.group.world.getRandPos();
                self.posX = newPos[0];
                self.posZ = newPos[1];
            }

            self.movement *= -1;

            if (++self.group.itemsDone == self.group.items.length) {
                self.group.moveDone();
            }
        };

        this.move = function() {
            self.oldPosX = self.object.position.x;
            self.oldPosZ = self.object.position.z;
            self.generalMove(
                [self.oldPosX, self.posX],
                [self.movement > 1 ? self.posY : self.maxY, self.movement > 1 ? self.maxY : self.posY],
                [self.oldPosZ, self.posZ],
                self.length,
                self.object,
                self.moveDone,
                self.movement < 1 ? 'Out' : 'In'
            );
        };

        return this;
    }

    extend(Cube, Wobj);
    MoveableMixin.call(Cube.prototype);

    return Cube;
});
