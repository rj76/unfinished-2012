define(function() {
    var Wobj = function() {
        this.world = undefined;
        this.scene = undefined;
        this.name = undefined;
        this.loader = undefined;
    };

    Wobj.prototype.getWorld = function(w) {
        return this.world;
    };

    Wobj.prototype.loadModel = function(location, callback) {
        if (!this.loader) {
            this.loader = new THREE.JSONLoader();
        }
        this.loader.load(location, callback);
    };

    return Wobj;
});
