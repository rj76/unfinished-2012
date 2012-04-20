define(function() {
    function Light3() {
        var self = this;
        this.name = 'light3';
        this.light = new THREE.SpotLight();
        this.light.position.set(170, 330, -160);
        this.light.castShadow = true;
        this.done = true;

        this.world.events.add({
            name: self.name+'.start',
            start: 0,
            action: function() { self.world.addToScene(self.light); }
        });

        return this;
    }

    return Light3;
});
