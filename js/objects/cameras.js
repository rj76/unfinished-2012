function CameraOrtho() {
    var self = this;
    this.name = 'cameraortho';

    this.rotationBck = false;
    this.rotationAmount = 100;

    this.events = [];

    // Instantiate an Orthographic camera this time.
    // The Left/Right/Top/Bottom values seem to be relative to the scene's 0, 0, 0 origin.
    // The best result seems to come if the overall viewable area is divided in 2 and
    // the Left & Bottom values set to negative
    this.camera = new THREE.OrthographicCamera(
        window.innerWidth / -2,   // Left
        window.innerWidth / 2,    // Right
        window.innerHeight / 2,   // Top
        window.innerHeight / -2,  // Bottom
        -2000,            // Near clipping plane
        1000              // Far clipping plane
    );

    // Set the camera position so that it's not on top of our object in the scene:
    this.camera.position.x = 0;
    this.camera.position.y = 100;
    this.camera.position.z = 0;
    this.done = true;


    this.moveCamera = function(direction) {
        if (direction == 'move') {
            self.rotationBck = mainCamera.rotation;
        }

        var x_pos = direction == 'move' ? self.rotationBck.x : self.rotationBck.x + self.rotationAmount;
        var x_target = direction == 'move' ? self.rotationBck.x + self.rotationAmount : self.rotationBck.x;
        var z_pos = direction == 'move' ? self.rotationBck.z : self.rotationBck.z + self.rotationAmount;
        var z_target = direction == 'move' ? self.rotationBck.z + self.rotationAmount : self.rotationBck.z;

        var position = { x: x_pos, z: z_pos };
        var target = { x: x_target, z: z_target };
        var tween = new TWEEN.Tween(position).to(target, (barLength*4-.1)*1000).easing(TWEEN.Easing.Linear.EaseNone);

        tween.onUpdate(function(){
            // Move the camera in a circle with the pivot point in the centre of this circle...
            // ...so that the pivot point, and focus of the camera is on the centre of our scene.
            var timer = new Date().getTime() * 0.0005;
            self.camera.position.x = Math.floor(Math.cos( timer ) * 200);
            self.camera.position.z = Math.floor(Math.sin( timer ) * 200);
        });

        tween.onComplete(function() {
            if (direction == 'back') {
                self.camera.visible = false;
            } else {
            }
        });

        tween.start();
    };

    this.events.push({
        name: 'start',
        start: 0,
        action: function() { scene.add(self.camera) }
    });

    allEvents.push(this);

    return this;
}
