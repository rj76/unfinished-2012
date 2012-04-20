define(function() {
    function Light1() {
        var self = this;
        this.name = 'light1';
        this.light = new THREE.PointLight(0xffeeaa, 1);
        this.light.position = new THREE.Vector3(-1000, 1000, -1000);
        this.done = true;

        this.world.events.add({
            name: self.name+'.start',
            start: 0,
            action: function() { self.world.addToScene(self.light); }
        });

        return this;
    }

    return Light1;
});
