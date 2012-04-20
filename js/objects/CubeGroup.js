define(['objects/Cube', 'mixins/GroupMixin', 'generic/Wobj'], function(Cube, GroupMixin, Wobj) {
    function CubeGroup(positions, color, duration, isMoving) {
        var self = this;
        var d = new Date();

        this.name = 'cubegroup'+d.getTime();
        this.positions = positions;
        this.color = color;
        this.duration = duration;
        this.itemsDone = 0;

        this.offsetX = 100;
        this.offsetZ = 200;

        for (var i=0;i<this.positions.length;i++) {
            this.addItem(new Cube(self.positions[i][0], self.positions[i][1], self.duration, self.color, this, isMoving));
        }
        this.done = true;

        this.moveDone = function() {
            self.itemsDone = 0;
            self.world.events.setTimer(self.name + '.move');
        };

        // addItemsToSceneEvent from GroupMixin
        this.world.events.add(this.addItemsToSceneEvent());
        this.world.events.add({
            name: self.name+'.rotate',
            step: randomRange(.1, .05),
            start: 0,
            action: function() {
                for (var i=0;i<self.items.length;i++) {
                    self.items[i].object.rotation.y += 0.1;
                    self.items[i].object.rotation.x += 0.0225;
                    self.items[i].object.rotation.z += 0.0175;
                }

                self.world.events.setTimer(self.name+'.rotate');
            }
        });

        this.world.events.add({
            name: self.name+'.move',
            start: 0,
            step: self.duration,
            action: function() {
                for (var i=0;i<self.items.length;self.items[i++].move()) ;
            }
        });

        return this;

    }

    extend(CubeGroup, Wobj);
    GroupMixin.call(CubeGroup.prototype);

    return CubeGroup;
});
