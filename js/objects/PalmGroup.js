define(['objects/Palm', 'mixins/GroupMixin', 'generic/Wobj'], function(Palm, GroupMixin, Wobj) {
    function PalmGroup(numItems) {
        Palm.prototype.world = this.world;
        var self = this;
        this.name = 'palmgroup';
        this.done = false;
        this.positions = [
            [8, 1],
            [8, 2],
            [9, 1],
            [9, 2]
        ];

        this.numItems = this.positions.length;

        // make sure the mixin knows our name
        this.setGroupName(this.name);

        this.loadModel("blender/convert/Palm.js", function(geometry) {
            for (var i=0;i<self.numItems;i++) {
                self.addItem(new Palm(geometry, self.positions[i][0], self.positions[i][1], i));
            }

            self.done = true;
        });

        this.world.events.add(this.addItemsToSceneEvent());

        return this;
    }

    extend(PalmGroup, Wobj);
    GroupMixin.call(PalmGroup.prototype);

    return PalmGroup;
});
