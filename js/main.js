define([
    'generic/Music', 'generic/Events', 'generic/World', 'objects/CloudGroup', 'objects/MainCamera',
    'objects/Light1', 'objects/Light2', 'objects/Light3', 'objects/Floor', 'objects/FireFlowers', 'objects/PalmGroup',
    'objects/CubeGroup', 'objects/Monster'
    ],
    function(Music, Events, World, CloudGroup, MainCamera, Light1, Light2, Light3, Floor, FireFlowers, PalmGroup,
        CubeGroup, Monster) {
        var startTime	= Date.now();

        if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

        var container, stats;

        var scene, renderer, sceneHolder;

        var haveStats = true;

        var SCREEN_HEIGHT = window.innerHeight;
        var SCREEN_WIDTH  = window.innerWidth;

        container = document.createElement('div');
        document.body.appendChild(container);

        scene = new THREE.Scene();

        sceneHolder = new THREE.Object3D();
        scene.add(sceneHolder);

        renderer = new THREE.WebGLRenderer({
            antialias: false,
    //        clearColor: 0xEEEEEE, // white
            clearColor: 0x222222, // gray
            clearAlpha: 1
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.sortObjects = false;
        renderer.shadowMapEnabled = true;
        renderer.clear();
        container.appendChild(renderer.domElement);
        window.addEventListener('resize', onWindowResize, false);

        if (haveStats) {
            stats = new Stats();
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.top = '0px';
            stats.domElement.style.left = '10px';
            container.appendChild(stats.domElement);
        }

        var events = new Events();
        var music = new Music();

        var myworld = new World({
            gridStartPosX: -550,
            gridStartPosZ: -250,
            gridOffsetX: 100,
            gridOffsetZ: 200,
            numX: 8,
            numZ: 2,
            events: events,
            scene: scene,
            music: music
        });

        // Fix this
        CloudGroup.prototype.world = MainCamera.prototype.world = Light1.prototype.world = Light2.prototype.world =
            Light3.prototype.world = Floor.prototype.world = FireFlowers.prototype.world = PalmGroup.prototype.world =
                 CubeGroup.prototype.world = Monster.prototype.world = myworld;

        myworld.addObject(new MainCamera());
        myworld.addObject(new CloudGroup({ c: 4 }));
        myworld.addObject(new Light1());
        myworld.addObject(new Light2());
        myworld.addObject(new Light3());
        myworld.addObject(new Floor());
        myworld.addObject(new FireFlowers());
        myworld.addObject(new PalmGroup(4));
        myworld.addObject(new CubeGroup(
            [
                myworld.getPosInGrid(0, 0),
                myworld.getPosInGrid(0, 0),
                myworld.getPosInGrid(0, 3),
                myworld.getPosInGrid(0, 3),
                myworld.getPosInGrid(7, 0),
                myworld.getPosInGrid(7, 0),
                myworld.getPosInGrid(7, 3),
                myworld.getPosInGrid(7, 3)
            ],
            false,
            music.getBarLength()*4,
            false
        ));
        myworld.addObject(new CubeGroup(
            [
                myworld.getPosInGrid(2, 1),
                myworld.getPosInGrid(6, 1)
            ],
            0xFFFF00,
            music.getBarLength()*2,
            true
        ));
        myworld.addObject(new Monster());

        myworld.loadObjects(function() {
//            music.play();
            music.barCounterTimer();
            myworld.runEvents();
            animate();
            console.log(myworld);
        });

        function onWindowResize(event) {
            renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
//            myworld.onWindowResize(event);
        }

        function render() {
            TWEEN.update();
            renderer.render(scene, myworld.mainCamera);
            myworld.mainCamera.lookAt(scene.position);
            if (haveStats) {
                stats.update();
            }
        }

        function animate() {
            if (music.getBarCounter() < music.getNumBars()) {
                requestAnimationFrame(animate, renderer.domElement);
                render();
            }
        }
    }
);
