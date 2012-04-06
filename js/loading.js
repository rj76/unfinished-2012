window.onload = function() {
    var startTime	= Date.now();

    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    var container, stats;

    var mainCamera, cameraBck, scene, renderer, sceneHolder, top, loadingObj;

    var geometry;
    var objects = [new MainCamera()];

    var haveStats = true;

    var FLOOR = -250;

    var music = ['music/music.mp3', 'music/music.ogg'];
    var songLength = 4*60 + 24.90;
    var barLength = (songLength/24)/4;
    var miniBarLength = (songLength/24)/4/4; // \o/
    var maxBars = 24*4;
    var barCounter = 1;
    var miniBarCounter = 1;
    var loading = true;

    var numFlowersZ = 4;// 4;
    var numFlowersX = 8;// 8;

    var allEvents = [];

    var curvesInOut = [
        'Quadratic',
        'Quartic',
        'Sinusoidal',
        'Circular',
        'Back'
    ];

    var tid;

    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();

    sceneHolder = new THREE.Object3D();
    scene.add(sceneHolder);

    renderer = new THREE.WebGLRenderer({
        antialias: false,
        clearColor: 0x222222,clearAlpha: 1
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.sortObjects = false;
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    if (haveStats) {
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        stats.domElement.style.left = '10px';
        container.appendChild( stats.domElement );
    }

    // Init camera first
    objects[0].init();
//    loadingObj = new setLoading();
    animate();
    initDemo(0);

    function initDemo(c) {
        if (objects.length == 1) {
            for (var a = [
                new Floor(),
                new CameraOrtho(),
                new Light1(), new Light2(),
                new CubeGroup(),
                new Sphere(),
                new FireFlowers(),
                new Palm(-1, 0), new Palm(-1.5, 0), new Palm(-2, 0)
//                new CloudGroup(4)
            ], i=0; i<a.length;objects.push(a[i++])) ;
        }

        var done = 0;
        for (var i=0;i<objects.length;objects[i++].done ? done++ : setTimeout(function() { initDemo(c); }, 1000)) ;
        if (done == objects.length) {
            if (loading && loadingObj) {
                loadingObj.top.position.z = -10000;
                loading = false;
            }

            playMusic();
            runDemo();
        }
    }

    function runDemo() {
        console.log(barCounter+'/'+(miniBarCounter-(barCounter*4)+4)+' (' +miniBarCounter+') - '+mainCamera.position.x, mainCamera.position.y, mainCamera.position.z+' - '+mainCamera.rotation.x, mainCamera.rotation.y, mainCamera.rotation.z);
        if (barCounter >= maxBars) {
            console.log('aborting');
            clearTimeout(tid);
            return;
        }

        for (var i=0;i<allEvents.length;i++) {
            var obj = allEvents[i];
            for (var j=0;j<obj.events.length;j++) {
                if (eval(obj.events[j].equation)) {
                    console.log(obj.events[j].equation+' is true for: '+obj.events[j].class);
                    obj.events[j].action();
                } else {
//                    console.log(barCounter+', '+miniBarCounter+' - '+obj.events[j].equation+' is false for: '+obj.events[j].class);
                }
            }
        }

        tid = setTimeout(runDemo, 1000*miniBarLength);

        if (miniBarCounter++ % 4 == 0) {
            barCounter++;
        }
    }

    /**
     * Start objects
     * ---------------
     */

    function setLoading() {
        var self = this;

        this.events = [];
        this.renderMethods = [];
        this.animateMethods = [];

//        console.log('creating text');
        this.textGeo = new THREE.TextGeometry( "Loading...", {
            size: 200,
            height: 50,
            curveSegments: 12,

            font: "helvetiker",
            weight: "regular",
            style: "normal",

            bevelThickness: 2,
            bevelSize: 5,
            bevelEnabled: true

        });

        this.textGeo.computeBoundingBox();
        var centerOffset = -0.5 * ( this.textGeo.boundingBox.max.x - this.textGeo.boundingBox.min.x );

        this.textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff, ambient: 0xaa0000 } );

        this.mesh = new THREE.Mesh( this.textGeo, this.textMaterial );
        this.mesh.position.x = centerOffset;
        this.mesh.position.y = FLOOR + 67;

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.done = true;

        this.events.push({
            class: 'floor',
            equation: 'barCounter == 1 && miniBarCounter == 1',
            action: function() {
                scene.add(self.mesh);
            }
        });

        allEvents.push(this);

        return this;
    }

    function Floor() {
        var self = this;

        this.events = [];
        this.renderMethods = [];
        this.animateMethods = [];

//        console.log('creating floor');
        this.grass = THREE.ImageUtils.loadTexture( "images/grass.png" );
        this.grass.wrapT = this.grass.wrapS = THREE.RepeatWrapping;

        this.plane = new THREE.PlaneGeometry(24, 24, 8, 8);

        for (var i=0;i<this.plane.faceVertexUvs[0].length;i ++ ) {
            var uvs = this.plane.faceVertexUvs[ 0 ][ i ];

            for (j=0;j<uvs.length;j ++) {
                uvs[ j ].u *= 8;
                uvs[ j ].v *= 8;
            }
        }

        this.meshCanvas = new THREE.Mesh(this.plane, new THREE.MeshBasicMaterial({ map: this.grass, wireframe: false }));
        this.meshCanvas.rotation.x = -90 * Math.PI / 180;
        this.meshCanvas.scale.x = this.meshCanvas.scale.y = this.meshCanvas.scale.z = 120;
//        console.log('creating floor complete');
        this.done = true;

        this.events.push({
            class: 'floor',
            equation: 'barCounter == 1 && miniBarCounter == 1',
            action: function() {
                scene.add(self.meshCanvas);
            }
        });

        allEvents.push(this);

        return this;
    }

    function getPosInGrid(n_x, n_z) {
        var startPosX = -350;
        var startPosZ = -250;
        var offsetX = 100;
        var offsetZ = 200;

        return [startPosX+offsetX*n_x, startPosZ+offsetZ*n_z]
    }

    function getRandPos() {
        return getPosInGrid(Math.ceil(randomRange(0,numFlowersX-1)), Math.ceil(randomRange(0,numFlowersZ-1)));
    }

    function Palm(posX, posY) {
        var self = this;

        this.posY = 45;
        this.scale = [.3, .5];
        this.events = [];
        this.palm = false;

        this.coords = getPosInGrid(posX, posY);

        this.renderMethods = [];
        this.animateMethods = [];

        this.done = false;

        var loader = new THREE.JSONLoader();
//        console.log('start loading palm model');
        loader.load("blender/convert/Palm.js", palmLoaded);
//        console.log('end loading palm model');

        function palmLoaded(geometry) {
//            console.log('creating palm');
            var faceMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff, ambient: 0xffffff, vertexColors: THREE.VertexColors } );
//            faceMaterial.morphTargets = true;

            var morph = new THREE.MorphAnimMesh(geometry, faceMaterial);
            morph.position.x = self.coords[0];
            morph.position.z = self.coords[1];
            morph.position.y = self.posY;
            morph.rotation.y = randomRange(0, 100);
            morph.scale.x = morph.scale.y = morph.scale.z = randomRange(self.scale[0], self.scale[1]);
            self.palm = morph;

            self.done = true;
//            console.log('creating palm complete');
        }

        this.events.push({
            class: 'palm',
            equation: 'barCounter == 1 && miniBarCounter == 1',
            action: function() { scene.add(self.palm); }
        });


        allEvents.push(this);

        return this;
    }

    var windSpeed = 0;
    function CloudGroup(numClouds) {
        var self = this;

        this.events = [];
        this.renderMethods = [];
        this.animateMethods = [];
        this.done = false;

        this.clouds = [];

        var loader = new THREE.JSONLoader();
//        console.log('start loading cloud model');
        loader.load("blender/convert/Cloud.js", cloudLoaded);
//        console.log('end loading cloud model');

        function cloudLoaded(geometry) {
            for (var i=0;i<numClouds;i++, self.clouds.push(new Cloud(geometry))) ;
        }

        this.done = true;

        this.events.push({
            class: 'cloudgroup',
            equation: 'barCounter == 1 && miniBarCounter == 1',
            action: function() {
                for (var i=0;i<self.clouds.length;scene.add(self.clouds[i++].cloud)) ;
                for (var i=0;i<self.clouds.length;self.clouds[i++].move()) ;
            }
        });

        this.renderMethods.push({
            equation: 'barCounter <= maxBars',
            action: function() {
                for (var i=0;i<self.clouds.length;i++) {
                    self.clouds[i].cloud.rotation.y += randomRange(.1, .2);
                }
            }
        });

        allEvents.push(this);
        return this;

    }

    function Cloud(geometry) {
        var self = this;

        this.posXrange = [-1000, 1000];
        this.posYrange = [240, 400];
        this.posZrange = [-20, 20];

        this.posX = randomRange(this.posXrange[0], this.posXrange[1]);
        this.posY = randomRange(this.posYrange[0], this.posYrange[1]);
        this.posZ = randomRange(this.posZrange[0], this.posZrange[1]);
        this.maxY = this.posY;

        this.oldPosX = this.posXrange[0];
        this.movement = 1;

        this.scale = [.5, .9];
        this.step = [90, 100];

        this.barLength = [3, 4];
        this.cloud = false;

//        console.log('creating cloud');
        var faceMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, ambient: 0xffffff, vertexColors: THREE.VertexColors });

        var morph = new THREE.MorphAnimMesh(geometry, faceMaterial);
        morph.position.x = this.posX;
        morph.position.y = this.posY;
        morph.position.z = this.posZ;

        morph.rotation.y = randomRange(10, 100);

        morph.scale.x = morph.scale.y = morph.scale.z = randomRange(this.scale[0], this.scale[1]);

        self.cloud = morph;
//        console.log('creating cloud complete');

        this.moveDone = function() {
            self.posX += randomRange(self.step[0], self.step[1]);
//            console.log('cloud move done: '+self.posX+', '+self.posY+', '+self.posZ);
            if (self.posX > self.posXrange[1]){
                self.posX = self.posXrange[0];
                self.cloud.position.x = self.posXrange[0];
            }
            self.move();
        };

        this.move = function() {
            self.oldPosX = self.cloud.position.x;
            self.oldPosY = self.cloud.position.y;
            self.oldPosZ = self.cloud.position.z;
            generalMove(self, 4, self.cloud, self.moveDone);
        }

        return this;
    }

    function FireFlowers() {
        var self = this;

        this.flowers = [];
        this.posY = 45;
        this.events = [];
        this.material = false;
        this.geometry = false;
        this.clock = new THREE.Clock();

        this.renderMethods = [];
        this.animateMethods = [];

        this.done = false;

        var loader = new THREE.JSONLoader();
//        console.log('start loading flower model');
        loader.load("blender/convert/probeersel.js", flowerLoaded);
//        console.log('end loading flower model');

        function flowerLoaded(geometry) {
//            console.log('creating flowers');
            var faceMaterial = new THREE.MeshFaceMaterial();
            faceMaterial.morphTargets = true;
            for (var i=0;i<numFlowersZ; i++) {
                for (var j=0; j<numFlowersX;j++) {
                    morphColorsToFaceColors( geometry );

                    var morph = new THREE.MorphAnimMesh(geometry, faceMaterial);
                    var positions = getPosInGrid(j, i);
                    morph.position.x = positions[0];
                    morph.position.z = positions[1];
                    morph.position.y = self.posY;
//                    morph.rotation.x = morph.rotation.z = 0;
                    morph.scale.x = morph.scale.y = morph.scale.z = 20;
                    morph.visible = false;

                    self.flowers.push(morph);
                }
            }

            self.done = true;
//            console.log('creating flowers complete');
        }

        function morphColorsToFaceColors( geometry ) {
            if ( geometry.morphColors && geometry.morphColors.length ) {
                var colorMap = geometry.morphColors[ 0 ];
                for ( var i = 0; i < colorMap.colors.length; i ++ ) {
                    geometry.faces[ i ].color = colorMap.colors[ i ];
                }
            }
        }

        this.events.push({
            class: 'flowers',
            equation: 'barCounter == 1 && miniBarCounter == 1',
            action: function() {
                for (var i=0;i<self.flowers.length;i++) {
                    scene.add(self.flowers[i]);
                }
//                console.log('added '+self.flowers.length+' flowers');

                for (var i=0;i<self.flowers.length;i++) {
                    self.flowers[i].visible = true;
                }
            }
        });

        this.duration = 5000;
        this.keyframes = 45;
        this.interpolation = this.duration / this.keyframes;
        this.lastKeyframe = 0;
        this.currentKeyframe = 0;

        this.animateMethods.push({
            equation: 'miniBarCounter > 1',
            action: function() {
                return;
                var delta = self.clock.getDelta();
                if (self.flowers.length) {
                    for (var i=0;i<self.flowers.length;i++) {
                        self.flowers[i].updateAnimation(1000 * delta);
                    }
                return;
//                if (self.frameCounter > 30)
//                    self.frameCounter = 0;
//
//                for (var i=0;i<self.flowers.length;i++) {
//                    var flower = self.flowers[i];
//                    for (var j=0;i<flower.morphTargetInfluences.length;j++) {
//                        flower.morphTargetInfluences[i] = 0;
//                    }
//
//                    flower.morphTargetInfluences[Math.floor(self.frameCounter)] = 1;
//                    self.frameCounter += 0.5;
//                }

                // Alternate morph targets
//                var delta = self.clock.getDelta();
//                var time = Date.now() % self.duration;

//                self.keyframe = Math.floor( time / self.interpolation );

//                if (self.keyframe != self.currentKeyframe) {
//                    for (var i=0;i<self.flowers.length;i++) {
//                        var flower = self.flowers[i];
//                        flower.morphTargetInfluences[self.lastKeyframe] = 0;
//                        flower.morphTargetInfluences[self.currentKeyframe] = 1;
//                        flower.morphTargetInfluences[self.keyframe] = 0;
//                        console.log(self.keyframe);
//                    }

//                    self.lastKeyframe = self.currentKeyframe;
//                    self.currentKeyframe = self.keyframe;
//                }

//                for (var i=0;i<self.flowers.length;i++) {
//                    var mesh = self.flowers[i];
//                    mesh.updateAnimation( 1000 * delta );
//                    mesh.morphTargetInfluences[self.keyframe] = (time % self.interpolation) / self.interpolation;
//                    mesh.morphTargetInfluences[self.lastKeyframe] = 1 - mesh.morphTargetInfluences[self.keyframe];
                }
            }
        });

        allEvents.push(this);

        return this;
    }

    function Light1() {
        var self = this;

        this.events = [];
        this.renderMethods = [];
        this.animateMethods = [];

//        console.log('creating light');
        this.light = new THREE.PointLight(0xffeeaa, 1);
        this.light.position = new THREE.Vector3(-1000, 1000, -1000);
        this.done = true;
//        console.log('creating light complete');

        this.events.push({
            class: 'light1',
            equation: 'barCounter == 1 && miniBarCounter == 1',
            action: function() { scene.add(self.light); }
        });

        allEvents.push(this);

        return this;
    }

    function Light2() {
        var self = this;

        this.events = [];
        this.renderMethods = [];
        this.animateMethods = [];

//        console.log('creating light');
        this.light = new THREE.PointLight(0xFFFFFF, 1);
        this.light.position = new THREE.Vector3(1000, 1000, 1000);
        this.done = true;
//        console.log('creating light complete');

        this.events.push({
            class: 'light2',
            equation: 'barCounter == 1 && miniBarCounter == 1',
            action: function() { scene.add(self.light); }
        });

        allEvents.push(this);

        return this;
    }

    function MainCamera() {
        var self = this;

        this.events = [];
        this.renderMethods = [];
        this.animateMethods = [];

        this.posX = 0;

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 6500);
        this.camera = new THREE.OrthographicCamera(
            window.innerWidth / -2,   // Left
            window.innerWidth / 2,    // Right
            window.innerHeight / 2,   // Top
            window.innerHeight / -2,  // Bottom
            0,            // Near clipping plane
            0              // Far clipping plane
        );
//        this.camera.setLens(35);
//        this.camera.rotation.x = 500;
//        this.camera.rotation.y = 500;
        // -137 100 -147 - -2.5442299489876343 -0.6565398994983 -2.7480311538053943

//        this.camera.position.x = -140;
//        this.camera.position.y = 100;
//        this.camera.position.z = -147;
//
//        this.camera.rotation.x = -.5;
//        this.camera.rotation.y = 0;
//        this.camera.rotation.z = -2.7;

        this.camera = new THREE.Camera( 3, window.innerWidth / window.innerHeight, -2000, 10000 );
        this.camera.projectionMatrix = THREE.Matrix4.makeOrtho( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 2000, 10000 );
        this.camera.position.x = -10;
        this.camera.position.y = 10; // 30 degree angle from the xz plane
        this.camera.position.z = 150;

//        var timer = new Date().getTime() * 0.0005;
//        this.camera.position.x = Math.floor(Math.cos( timer ) * 200);
//        this.camera.position.y = 100;
//        this.camera.position.z = Math.floor(Math.sin( timer ) * 200);
        this.done = true;

        this.init = function() {
            self.camera.lookAt(scene.position);
            mainCamera = self.camera;
            scene.add(mainCamera = self.camera);
            allEvents.push(self);
            mainCamera.lookAt(scene.position);
        };

        this.events.push({
            class: 'mainCamera',
            equation: 'barCounter == 1 && miniBarCounter == 1',
            action: function() {  }
        });

//        this.events.push({
//            class: 'mainCamera',
//            equation: 'barCounter == 4 && miniBarCounter== 4*4',
//            action: function() {
//                cameraBck = mainCamera;
//                self.camera.visible = false;
//            }
//        });
//
//        this.events.push({
//            class: 'mainCamera',
//            equation: 'barCounter == 8 && miniBarCounter == 8*4',
//            action: function() {
//                mainCamera = cameraBck;
//                self.visible = true;
//            }
//        });

        return this;
    }

    function CameraOrtho() {
        var self = this;

        this.rotationBck = false;
        this.rotationAmount = 100;

        this.events = [];
        this.renderMethods = [];
        this.animateMethods = [];

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
//                console.log('start ortho camera move');
                self.rotationBck = mainCamera.rotation;
            } else {
//                console.log('start ortho camera move back');
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
//                    console.log('camera move back complete');
                    self.camera.visible = false;
                } else {
//                    console.log('camera move complete');
                }
            });

            tween.start();
        };

        this.events.push({
            class: 'orthoCamera',
            equation: 'barCounter == 1 && miniBarCounter == 1',
            action: function() { scene.add(self.camera) }
        });

//        this.events.push({
//            class: 'orthoCamera',
//            equation: 'barCounter == 4 && miniBarCounter == 4*4',
//            action: function() {
//                mainCamera = self.camera;
//                self.camera.visible = true;
//                self.moveCamera('move');
//            }
//        });
//
//        this.events.push({
//            class: 'orthoCamera',
//            equation: 'barCounter == 8 && miniBarCounter == 4*8',
//            action: function() {
//                self.moveCamera('back');
//            }
//        });
//
        allEvents.push(this);

        return this;
    }

    function CubeGroup() {
        var self = this;

        this.events = [];
        this.renderMethods = [];
        this.animateMethods = [];

        this.offsetX = 100;
        this.offsetZ = 200;
        this.startPosZ = -450;

        this.positions_barLength = [
            getPosInGrid(1, 1),
            getPosInGrid(1, 3),
            getPosInGrid(7, 1),
            getPosInGrid(7, 3)
        ];

        this.positions_miniBarLength = [
            getPosInGrid(2, 1),
            getPosInGrid(6, 1)
        ];

        this.cubes_barLength = [];
        this.cubes_miniBarLength = [];

        for (var i=0;i<this.positions_barLength.length;i++) {
            var o = new Cube(self.positions_barLength[i][0], self.positions_barLength[i][1], barLength, false);
            this.cubes_barLength.push(o);
        }

        for (var i=0;i<this.positions_miniBarLength.length;i++) {
            var o = new Cube(self.positions_miniBarLength[i][0], self.positions_miniBarLength[i][1], miniBarLength*4, 0xFFFF00);
            this.cubes_miniBarLength.push(o);
        }

        this.done = true;

        this.events.push({
            class: 'cubegroup',
            equation: 'barCounter == 1 && miniBarCounter == 1',
            action: function() {
                for (var i=0;i<self.cubes_barLength.length;i++) {
                    scene.add(self.cubes_barLength[i].cube);
                }
                for (var i=0;i<self.cubes_miniBarLength.length;i++) {
                    self.cubes_miniBarLength[i].isMoving = true;
                    scene.add(self.cubes_miniBarLength[i].cube);
                }
            }
        });

        this.events.push({
            class: 'cubegroup',
            equation: 'barCounter % 4 == 0 && miniBarCounter % 4 == 0',
            action: function() {
                for (var i=0;i<self.cubes_barLength.length;self.cubes_barLength[i++].move()) ;
            }
        });

        this.events.push({
            class: 'cubegroup',
            equation: 'miniBarCounter % 4 == 0',
            action: function() {
                for (var i=0;i<self.cubes_miniBarLength.length;self.cubes_miniBarLength[i++].move()) ;
            }
        });

        this.renderMethods.push({
            equation: 'barCounter <= maxBars',
            action: function() {
                for (var i=0;i<self.cubes_barLength.length;i++) {
//                    console.log(self.cubes[i]);
                    self.cubes_barLength[i].cube.rotation.y += 0.1;
                    self.cubes_barLength[i].cube.rotation.x += 0.0225;
                    self.cubes_barLength[i].cube.rotation.z += 0.0175;
                }
            }
        });

        allEvents.push(this);
        return this;

    }

    function Cube(posX, posZ, length, color) {
        var self = this;

        this.events = [];
        this.renderMethods = [];
        this.animateMethods = [];

        this.movement = 1; // -1 = down, 1 = up
        this.maxY = 300;
        this.length = length ? length : barLength;

        this.isMoving = false;
        this.posX = posX;
        this.posY = 50;
        this.posZ = posZ;
        this.oldPosX = 0;
        this.oldPosZ = 0;
        this.color = color ? color : 0xFF0000;

//        console.log('creating cube '+posX+' x '+posZ);
        this.cube = new THREE.Mesh(
            new THREE.CubeGeometry(50, 50, 50),
            new THREE.MeshLambertMaterial( { color: self.color } )
        );

        this.cube.position.x = this.posX;
        this.cube.position.y = this.posY;
        this.cube.position.z = this.posZ;

        this.done = true;
//        console.log('creating done');

        this.moveDone = function() {
	    if (self.isMoving) {
		var newPos = getRandPos();
		self.posX = newPos[0];
		self.posZ = newPos[1];
	    }

            self.movement *= -1;
        };

        this.move = function() {
	    self.oldPosX = self.cube.position.x;
	    self.oldPosZ = self.cube.position.z;

	    generalMove(self, self.length, self.cube, self.moveDone);
        }

        return this;
    }

    var generalMove = function(thisIn, length, o, onComplete) {
        var position = { y: thisIn.movement > 0 ?  thisIn.posY: thisIn.maxY, x: thisIn.oldPosX, z: thisIn.oldPosZ };
        var target = { y: thisIn.movement > 0 ? thisIn.maxY : thisIn.posY, x: thisIn.posX, z: thisIn.posZ };
        var tween = new TWEEN.Tween(position).to(target, (length-.1)*1000).easing(
            giveEase(this.movement < 0 ? 'Out' : 'In')
        );

        tween.onUpdate(function() {
            o.position.x = position.x;
            o.position.y = position.y;
            o.position.z = position.z;
        });

        tween.onComplete(onComplete);

        tween.start();
    };

    var generalMoveEase = function(thisIn, length, o, onComplete, ease) {
        var position = { y: thisIn.movement > 0 ?  thisIn.posY: thisIn.maxY, x: thisIn.oldPosX, z: thisIn.oldPosZ };
        var target = { y: thisIn.movement > 0 ? thisIn.maxY : thisIn.posY, x: thisIn.posX, z: thisIn.posZ };
        var tween = new TWEEN.Tween(position).to(target, (length-.1)*1000).easing(ease);

        tween.onUpdate(function() {
            o.position.x = position.x;
            o.position.y = position.y;
            o.position.z = position.z;
        });

        tween.onComplete(onComplete);

        tween.start();
    };

    function Sphere() {
//        console.log('creating sphere');
        var self = this;

        this.movement = -1; // -1 = down, 1 = up
        this.maxY = 300;

        this.posY = 50;

        var positions = getPosInGrid(1, 3);
        this.posX = positions[0];
        this.posZ = positions[1];

        this.events = [];
        this.renderMethods = [];
        this.animateMethods = [];

        this.sphere = new THREE.Mesh(
            new THREE.SphereGeometry(
                50,
                16,
                16),

            new THREE.MeshLambertMaterial({
                color: 0xCC0000
            })
        );

        this.sphere.doubleSided = true;
        this.sphere.position.x = this.posX;
        this.sphere.position.y = this.posY;
        this.sphere.position.z = this.posZ;

        this.done = true;

        this.moveDone = function() {
            var newPos = getRandPos();
            self.posX = newPos[0];
            self.posZ = newPos[1];

            self.movement *= -1;
        };

        this.move = function() {
            self.oldPosX = self.sphere.position.x;
            self.oldPosZ = self.sphere.position.z;
            generalMove(self, miniBarLength*2, self.sphere, self.moveDone);
        }

        this.events.push({
            class: 'sphere',
            equation: 'barCounter == 4 && miniBarCounter == 4*4',
            action: function() { scene.add(self.sphere) }
        });

        this.events.push({
            class: 'sphere',
            equation: 'barCounter >= 4 && miniBarCounter % 2 == 0',
            action: self.move
        });
//
//        this.events.push({
//            class: 'sphere',
//            equation: 'barCounter == 57',
//            action: function() { self.sphere.visible = true }
//        });
//
//        this.events.push({
//            class: 'sphere',
//            equation: 'barCounter == 40',
//            action: function() { self.sphere.visible = false }
//        });

        allEvents.push(this);
        return this;
    }

    /**
     * End objects
     * --------------
     */

    function animate() {
        for (var i=0;i<allEvents.length;i++) {
            for(var j=0;j<allEvents[i].animateMethods.length;j++) {
                if (eval(allEvents[i].animateMethods[j].equation)) {
                    allEvents[i].animateMethods[j].action();
                }
            }
        }

        if (loading && loadingObj) {
            loadingObj.uniforms.time.value += 0.05;
            loadingObj.uniforms.effectAmount.value = 14/100;
            loadingObj.top.position.y += .18;
        }

        if (barCounter <= maxBars) {
            requestAnimationFrame(animate, renderer.domElement);
            render();
        }
    }

    function render() {
        TWEEN.update();

        for (var i=0;i<allEvents.length;i++) {
            for(var j=0;j<allEvents[i].renderMethods.length;j++) {
                if (eval(allEvents[i].renderMethods[j].equation)) {
                    allEvents[i].renderMethods[j].action();
                }
            }
        }

        // Set the camera to always point to the centre of our scene, i.e. at vector 0, 0, 0
//        mainCamera.position.x -= 2;
//        mainCamera.position.y -= .5;
        mainCamera.lookAt( scene.position );
        renderer.render(scene, mainCamera);

        if (haveStats) {
            stats.update();
        }
    }

    function giveEase(inOrOut) {
        return eval('TWEEN.Easing.' + curvesInOut[parseInt(randomRange(0, curvesInOut.length-1))] + '.Ease' + inOrOut);
    }

    function randomRange(min, max) {
        return Math.random()*(max-min) + min;
    }

    function onWindowResize( event ) {

        var SCREEN_HEIGHT = window.innerHeight;
        var SCREEN_WIDTH  = window.innerWidth;

        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

        mainCamera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        mainCamera.updateProjectionMatrix();
    };

    function playMusic() {
        var audio = document.createElement('audio');
        audio.volume = 1;

        for(var i=0; i<music.length;i ++ ) {
            var source = document.createElement('source');
            source.src = music[i];
            audio.appendChild(source);
        }

        audio.play();
    }

    function getClass(obj) {
        if (typeof obj === "undefined")
            return "undefined";
        if (obj === null)
            return "null";
        return Object.prototype.toString.call(obj)
            .match(/^\[object\s(.*)\]$/)[1];
    }

    function setLoadingOld() {
        var fontSize = 16;
        var lettersPerSide = 16;
        var c = document.createElement('canvas');
        c.width = c.height = fontSize*lettersPerSide;
        var ctx = c.getContext('2d');
        ctx.font = fontSize+'px Monospace';
        var i=0;

        for (var y=0; y<lettersPerSide; y++) {
            for (var x=0; x<lettersPerSide; x++,i++) {
                var ch = String.fromCharCode(i);
                ctx.fillText(ch, x*fontSize, -(8/32)*fontSize+(y+1)*fontSize);
            }
        }

        var tex = new THREE.Texture(c);
        tex.needsUpdate = true;

        var mat = new THREE.MeshBasicMaterial({map: tex});
        mat.transparent = true;

        var geo = new THREE.Geometry();
        var text = [];
        for (var i=0;i<100;text.push("Loading ~ Loading ~ Loading ~ Loading ~ Loading"), i++) ;
        var str = text.join("\n");

        var j=0, ln=0;

        for (i=0; i<str.length; i++) {
            var code = str.charCodeAt(i);
            var cx = code % lettersPerSide;
            var cy = Math.floor(code / lettersPerSide);
            var v,t;
            geo.vertices.push(
                new THREE.Vertex(new THREE.Vector3( j*1.1+0.05, ln*1.1+0.05, 0 )),
                new THREE.Vertex(new THREE.Vector3( j*1.1+1.05, ln*1.1+0.05, 0 )),
                new THREE.Vertex(new THREE.Vector3( j*1.1+1.05, ln*1.1+1.05, 0 )),
                new THREE.Vertex(new THREE.Vector3( j*1.1+0.05, ln*1.1+1.05, 0 ))
            );
            var face = new THREE.Face4(i*4+0, i*4+1, i*4+2, i*4+3);
            geo.faces.push(face);
            var ox=cx/lettersPerSide, oy=cy/lettersPerSide, off=1/lettersPerSide;
            var sz = lettersPerSide*fontSize;
            geo.faceVertexUvs[0].push([
                new THREE.UV( ox, oy+off ),
                new THREE.UV( ox+off, oy+off ),
                new THREE.UV( ox+off, oy ),
                new THREE.UV( ox, oy )
            ]);
            if (code == 10) {
                ln--;
                j=0;
            } else {
                j++;
            }
        }

        this.top = new THREE.Object3D();
        this.top.position.y = 10;

        var width = window.innerWidth,
            height = window.innerHeight;

        this.uniforms = {
            time : { type: "f", value: 1.0 },
            size : { type: "v2", value: new THREE.Vector2(width,height) },
            map : { type: "t", value: 1, texture: tex },
            effectAmount : { type: "f", value: 0.0 }
        };

        var shaderMaterial = new THREE.ShaderMaterial({
            uniforms : this.uniforms,
            vertexShader : document.querySelector('#vertex').textContent,
            fragmentShader : document.querySelector('#fragment').textContent
        });
        shaderMaterial.depthTest = false;

        var books = [];
        var w = 80 * 1.1;
        var n = 3;
        var r = w * 1/2 * 1/Math.PI * n;
        for (var i=0; i<n; i++) {
            var book = new THREE.Mesh(
                geo,
                shaderMaterial
            );
            book.doubleSided = true;
            var a = i/n * Math.PI*2 + Math.PI/2;
            book.position.x = Math.cos(Math.PI+a) * r;
            book.position.z = Math.sin(Math.PI+a) * r;
            book.rotation.y = Math.PI/2 - a;
            books.push(book);
            this.top.add(book);
        }

        scene.add(this.top);

        mainCamera.position.x = 0;
        mainCamera.position.y = 0;
        mainCamera.position.z = 0;
    }


};
