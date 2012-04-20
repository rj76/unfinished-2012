define(function() {
    var World = function(opts) {
        var world = this;

        // generic
        var gridStartPosX = opts.gridStartPosX;
        var gridStartPosZ = opts.gridStartPosZ;
        var gridOffsetX = opts.gridOffsetX;
        var gridOffsetZ = opts.gridOffsetZ;
        var scene = opts.scene;

        this.scene = scene;
        this.music = opts.music;
        this.numFlowersX = opts.numX;
        this.numFlowersZ = opts.numZ;
        this.mainCamera = undefined;

        this.events = opts.events;

        this.objects = [];

        this.loadObjects = function(doneCallback) {
            var done = 0;
            for (var i=0;i<this.objects.length;this.objects[i++].done ? done++ : setTimeout(function() { world.loadObjects(doneCallback); }, 1000)) ;
            if (done == this.objects.length) {
                doneCallback();
            }
        };

        this.getScenePosition = function() {
            return scene.position;
        };

        this.addToScene = function(obj) {
            scene.add(obj);
        };

        this.addEvent = function(event) {
            this.events.add(event);
        };

        this.runEvents = function() {
            this.events.run();
        };

        this.stop = function() {
            this.events.clear();
        };

        this.addObject = function(o) {
            this.objects.push(o);
        };

        this.getPosInGrid = function(X, Z) {
            return [this.getPosInGridX(X), this.getPosInGridZ(Z)];
        };

        this.getPosInGridX = function(n) {
            return gridStartPosX+gridOffsetX*n;
        };

        this.getPosInGridZ = function(n) {
            return gridStartPosZ+gridOffsetZ*n;
        };

        this.getMaxPosZ = function() {
            return gridStartPosZ+gridOffsetZ*this.numFlowersZ;
        };

        this.getMaxPosX = function() {
            return gridStartPosX+gridOffsetX*this.numFlowersX;
        };

        this.getMinPosZ = function() {
            return gridStartPosZ;
        };

        this.getMinPosX = function() {
            return gridStartPosX;
        };

        this.getRandPosX = function() {
            return this.getPosInGridX(Math.ceil(randomRange(0,this.numFlowersX-1)));
        };

        this.getRandPosZ = function() {
            return this.getPosInGridZ(Math.ceil(randomRange(0,this.numFlowersZ-1)));
        };

        this.getRandPos = function() {
            return this.getPosInGrid(Math.ceil(randomRange(0,this.numFlowersX-1)), Math.ceil(randomRange(0,this.numFlowersZ-1)));
        };
    };

    return World;
});
