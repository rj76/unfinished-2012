define(function() {
    var GroupMixin = function() {
        var self = this;
        var groupName = "";

        this.numItems = 0;
        this.items = [];

        this.getGroupName = function() {
            return groupName;
        };

        this.setGroupName = function(name) {
            groupName = name;
        };

        this.setSelf = function(thisIn) {
            self = thisIn;
        };

        this.addItemsToSceneEvent = function() {
            return {
                name: this.getGroupName() + '.start',
                start: 0,
                action: function() { for (var i=0;i<self.items.length;self.world.addToScene(self.items[i++].object)) ; }
            }
        };

        this.addItem = function(item) {
            self.items.push(item);
        };
    };

    return GroupMixin;
});
