var WORLD = function(opts) {
    var scene = opts.scene;
    var barLength = opts.barLength;
    var SCREEN_HEIGHT = opts.SCREEN_HEIGHT;
    var SCREEN_WIDTH = opts.SCREEN_WIDTH;

    var numFlowersZ = 4;// 4;
    var numFlowersX = 8;// 8;

    var objects = [];

    var mainCamera=false;

    var loading = true;
    var loadingObj = false;

    this.getMainCamera = function() {
        return mainCamera;
    }

    this.onWindowResize = function(event) {
        mainCamera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        mainCamera.updateProjectionMatrix();
    };

    this.initDemo = function(callback) {
        if (objects.length == 0) {
            for (var i=0, a = [
                new MainCamera(scene),
                new Floor(scene),
//                new CameraOrtho(),
                new Light1(scene), new Light2(scene), new Light3(scene),
                new CubeGroup(
                    scene,
                    [
                        getPosInGrid(0, 0),
                        getPosInGrid(0, 0),
                        getPosInGrid(0, 3),
                        getPosInGrid(0, 3),
                        getPosInGrid(7, 0),
                        getPosInGrid(7, 0),
                        getPosInGrid(7, 3),
                        getPosInGrid(7, 3)
                    ],
                    false,
                    barLength*4,
                    i,
                    false
                ),
                new CubeGroup(
                    scene,
                    [
                        getPosInGrid(2, 1),
                        getPosInGrid(6, 1)
                    ],
                    0xFFFF00,
                    barLength*2,
                    i+1,
                    true
                ),
                new Sphere(),
                //new Cartman(10, -1),
                new FireFlowers(scene),
                new Palm(scene, -1, 0, i), new Palm(scene, -1.5, 0, i+1), new Palm(scene, -2, 0, i+2),
                new CloudGroup(scene, 4, i)
            ]; i<a.length;objects.push(a[i++])) ;
        }

        var done = 0;
        for (var i=0;i<objects.length;objects[i++].done ? done++ : setTimeout(function() { this.initDemo(callback); }, 1000)) ;
        if (done == objects.length) {
            if (loading && loadingObj) {
                loadingObj.top.position.z = -10000;
                loading = false;
            }
            callback();
        }
    };

    this.clearEvents = function() {
        for (var k in eventTable) {
            // use hasOwnProperty to filter out keys from the Object.prototype
            if (eventTable.hasOwnProperty(k)) {
                clearTimeout(eventTable[k].tid);
            }
        }
    }

    this.runWorld = function() {

        // Installing event handlers
        for (var i=0;i<allEvents.length;i++) {
            var objEvent = allEvents[i];
            for (var j=0;j<objEvent.events.length;j++) {
                var event = objEvent.events[j];
                var ident = objEvent.name + '.' + event.name;
                if (!eventTable[ident]) eventTable[ident] = {tid: false};
                eventTable[ident].event = event;
                if (eventTable[ident].tid == false) {
                    eventTable[ident].tid = setTimeout(event.action, 1000*event.start);
                    console.log('adding ident='+ident+', with action: '+event.action);
                }
            }
        }

        console.log('event table: '+eventTable);
    }

    function setTimer(ident) {
        if (eventTable[ident].event.name != 'start') {
            eventTable[ident].tid = setTimeout(eventTable[ident].event.action, 1000*eventTable[ident].event.step);
        }
    }

    function morphColorsToFaceColors(geometry) {
        if (geometry.morphColors && geometry.morphColors.length) {
            var colorMap = geometry.morphColors[0];
            for (var i=0; i<colorMap.colors.length; i++) {
                geometry.faces[i].color = colorMap.colors[i];
            }
        }
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




}();
