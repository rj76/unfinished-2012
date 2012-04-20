define(function() {
    function MainCamera() {
        var self = this;
        this.name = 'maincamera';

        this.posX = 0;

//        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 6500);
//        this.camera = new THREE.OrthographicCamera(
//            window.innerWidth / -2,   // Left
//            window.innerWidth / 2,    // Right
//            window.innerHeight / 2,   // Top
//            window.innerHeight / -2,  // Bottom
//            0,            // Near clipping plane
//            0              // Far clipping plane
//        );

        this.camera = new THREE.PerspectiveCamera(3, window.innerWidth / window.innerHeight, -2000, 10000);
        this.camera.projectionMatrix = THREE.Matrix4.makeOrtho(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 2000, 10000);
        this.camera.position.x = -10;
        this.camera.position.y = 10; // 30 degree angle from the xz plane
        this.camera.position.z = 150;
        this.world.mainCamera = this.camera;
        this.world.addToScene(this.camera);
        this.world.mainCamera.lookAt(this.world.getScenePosition());
        this.done = true;

        this.t = new Date().getTime();

        this.world.events.add({
            name: self.name+'.start',
            start: 0,
            step: 0,
            action: function() {
                self.world.mainCamera = self.camera;
                self.world.addToScene(self.camera);
            }
        });

//        this.world.events.add({
//            name: self.name+'.rotate',
//            start: 0,
//            step: .001,
//            log: true,
//            action: function() {
//                self.world.mainCamera.position.x = Math.sin(self.t/10000)*300;
//                self.world.mainCamera.position.z = Math.cos(self.t/10000)*300;
//                self.world.mainCamera.lookAt(self.world.getScenePosition());
//                self.world.events.setTimer(self.name+'.rotate');
//            }
//        });

        return this;
    }

    return MainCamera;
});
