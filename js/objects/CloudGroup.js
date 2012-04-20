define(['objects/Cloud', 'mixins/GroupMixin', 'generic/Wobj'], function(Cloud, GroupMixin, Wobj) {
    function CloudGroup(opts) {
        Cloud.prototype.world = this.world;
        var self = this;
        this.name = 'cloudgroup';
        this.numItems = opts.c;
        this.done = false;
        this.speed = 1;

        // make sure the mixin knows our name
        this.setGroupName(this.name);
//        this.setSelf(this);

        this.loadModel("blender/convert/Cloud.js", function(geometry) {
            for (var i=0;i<self.numItems;i++) {
                var cloud = new Cloud();
                cloud.setOpts({
                    posXrange: [-1000, 1000],
                    posYrange: [240, 400],
                    posZrange: [self.world.getMinPosZ(), self.world.getMaxPosZ()],
                    geometry: geometry,
                    scale: [.4, .8]
                });
                cloud.create();
                self.addItem(cloud);
            }

            self.done = true;
        });

        // addItemsToSceneEvent from GroupMixin
        this.world.events.add(this.addItemsToSceneEvent());
        this.world.events.add({
            name: self.name+'.rotate',
            start: 0,
            step: .1,
            log: false,
            action: function() {
                for (var i=0;i<self.items.length;i++) {
                    self.items[i].object.rotation.y += randomRange(.1, .2);
                    self.items[i].object.position.x += self.speed;
                    if (self.items[i].object.position.x > self.items[i].posXrange[1]) {
                        self.items[i].object.position.x = self.items[i].posXrange[0];
                    }
                }
                self.world.events.setTimer(self.name+'.rotate');
            }
        });

        return this;
    }

    extend(CloudGroup, Wobj);
    GroupMixin.call(CloudGroup.prototype);

    return CloudGroup;
});
