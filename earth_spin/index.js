        import * as THREE from './three.module.js';
        import { GLTFLoader } from './GLTFLoader.js';
        import { RGBELoader } from './RGBELoader.js';
        import { RoughnessMipmapper } from './RoughnessMipmapper.js';
        import Bowser from './browser_detect_library/bowser.js';

        let camera, scene, renderer, mixer, aspect;
        let clock = new THREE.Clock();
        let model, mainScene, frames;

        let scrollBuffer = 0; 
        let currentScroll = 0;
        let scrollDelta = 0; 
        let el;
        let elapsedTime = 0;

        const browserName = Bowser.parse(window.navigator.userAgent).browser.name;

        init();
        render();

        function init() {

            const container = document.querySelector( 'div' );
            const canvas = document.querySelector("#c");
            // const container = document.createElement( 'div' );
            document.body.appendChild( container );
            el = container;

            camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.00025, 20 );
            camera.position.set( 0.0, 0.0, 14.0 );

            scene = new THREE.Scene();

            new RGBELoader()
                .setDataType( THREE.UnsignedByteType )
                .setPath( 'textures/equirectangular/' )
                .load( 'royal_esplanade_1k.hdr', function ( texture ) {

                    const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
                    scene.environment = envMap;

                    texture.dispose();
                    pmremGenerator.dispose();

                    render();

                    const roughnessMipmapper = new RoughnessMipmapper( renderer );

                    const loader = new GLTFLoader().setPath( 'earth_model/' );
                    loader.load( 'scene.gltf', function ( gltf ) {

                        model = gltf.scene;
                        mainScene = gltf;
                        frames = mainScene.animations[0].tracks[0].times;
                        scene.add(model);
                        console.log(mainScene);

                        mixer = new THREE.AnimationMixer(model);
                        mixer.clipAction(gltf.animations[0]).play();

                        roughnessMipmapper.dispose();

                        render();

                    } );

                } );

            renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
            renderer.setClearColor( 0xaaaaaa, 1 );
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( window.innerWidth, window.innerHeight );
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1;
            renderer.outputEncoding = THREE.sRGBEncoding;
            // container.appendChild( renderer.domElement );


            const pmremGenerator = new THREE.PMREMGenerator( renderer );
            pmremGenerator.compileEquirectangularShader();

            window.addEventListener( 'resize', onWindowResize, false );

        }

        function onWindowResize() {

            camera.aspect = window.innerWidth / window.innerHeight;
            aspect = camera.aspect;
            camera.updateProjectionMatrix();

            renderer.setSize( window.innerWidth, window.innerHeight );

            render();

        }

        function render() {
            scrollDelta = currentScroll - scrollBuffer;
            if(browserName === "Chrome") {scrollDelta *= 0.03;}
                requestAnimationFrame(render);
                var delta = clock.getDelta();
                if (mixer != null) {
                    mixer.update(delta*scrollDelta*300);
                    scrollBuffer = currentScroll;
                    elapsedTime = elapsedTime + delta*scrollDelta*300;
                    console.log(elapsedTime);

                    console.log(mixer.time)
                };

                renderer.render(scene, camera);
                // console.log(`Height: ${window.innerHeight}, scroll: ${currentScroll}, aspect: ${aspect}`);
                // if(mainScene)console.log(mainScene.animations);
            

            renderer.render( scene, camera );

        }

function zoom(event) {
    // event.preventDefault();
    currentScroll += event.deltaY * -0.01;
  
    // Restrict scale
    
    if(browserName === "Chrome") {
        currentScroll = Math.min(Math.max(3.8, currentScroll), 170 );
    } else {
        currentScroll = Math.min(Math.max(.12, currentScroll), 5.1);
    }
  }
  
  el.onwheel = zoom;