define(['generic/Wobj', 'mixins/MoveableMixin'], function (Wobj, MoveableMixin) {
    function Cloud(opts) {
        var cloud = this;
        this.setOpts = function(opts) {
            cloud.posXrange = opts.posXrange;
            cloud.posYrange = opts.posYrange;
            cloud.posZrange = opts.posZrange;
            cloud.scale = opts.scale;
            cloud.geometry = opts.geometry;
        };

        this.create = function() {
            cloud.object = new THREE.MorphAnimMesh(
                cloud.geometry,
                new THREE.MeshLambertMaterial({ color: 0xffffff, ambient: 0xffffff, vertexColors: THREE.VertexColors })
            );
            cloud.object.position.x = randomRange(cloud.posXrange[0], cloud.posXrange[1]);
            cloud.object.position.y = randomRange(cloud.posYrange[0], cloud.posYrange[1]);
            cloud.object.position.z = randomRange(cloud.posZrange[0], cloud.posZrange[1]);
            cloud.object.rotation.y = randomRange(10, 100);
            cloud.object.scale.x = cloud.object.scale.y = cloud.object.scale.z = randomRange(cloud.scale[0], cloud.scale[1]);
            cloud.object.castShadow = true;
        };

        return this;
    }

    // Make cloud moveable
    extend(Cloud, Wobj);
    MoveableMixin.call(Cloud.prototype);

    return Cloud;
});
