window.onload = function() {
    var startTime	= Date.now();

    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    var container, stats;

    var scene, renderer, sceneHolder;

    var haveStats = true;

    var FLOOR = -250;
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

    var music = new MUSIC();

    var world = new WORLD({
        scene: scene,
        barLength: music.getBarLength(),
        SCREEN_HEIGHT: SCREEN_HEIGHT,
        SCREEN_WIDTH: SCREEN_WIDTH
    });

    world.initDemo(function() {
        animate();
        music.barCounterTimer(world.getMainCamera())
        music.play();
        world.runDemo();
    });

    function onWindowResize(event) {
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        world.onWindowResize(event);
    };

    function render() {
        TWEEN.update();
        renderer.render(scene, world.getMainCamera());
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
};
