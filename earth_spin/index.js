        import * as THREE from './three.module.js';
        import { GLTFLoader } from './GLTFLoader.js';
        import { RGBELoader } from './RGBELoader.js';
        import { RoughnessMipmapper } from './RoughnessMipmapper.js';
        import Bowser from './browser_detect_library/bowser.js';

        //THREE.js global variables
        let camera, scene, renderer, mixer, aspect;
        let clock = new THREE.Clock();
        let model;

        //variables for tracking scroll and syncing timeline
        let scrollBuffer = 0; 
        let currentScroll = 0;
        let scrollDelta = 0; 
        let el;

        //hidden divs, variables for click handling of buttons
        let firstHiddenDiv, secondHiddenDiv, thirdHiddenDiv;
        let firstHiddenButton, secondHiddenButton, thirdHiddenButton;

        //variables for restricting animation to frame range,
        //and for unhiding divs at appropriate frames
        let currentAnimationFrame, currentTime = 0;

        //brower detect for balancing scroll speed
        const browserName = Bowser.parse(window.navigator.userAgent).browser.name;

        //overall scroll speed factor
        const scrollSpeed = 10;

        init();
        render();

        function init() {

            const container = document.querySelector( '#hidden-button-bg' );
            const canvas = document.querySelector("#c");

            firstHiddenDiv = document.querySelector("#first");
            secondHiddenDiv = document.querySelector("#second");
            thirdHiddenDiv = document.querySelector("#third");

            firstHiddenButton = document.querySelector("#first-button");
            secondHiddenButton = document.querySelector("#second-button");
            thirdHiddenButton = document.querySelector("#third-button");
            el = container;

            camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.00025, 20 );
            camera.position.set( 0.0, 0.0, 14.0 );

            scene = new THREE.Scene();

            //load evironment texture (for good lighting)
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

                    //load 3D model (and animation)
                    const loader = new GLTFLoader().setPath( 'earth_model/' );
                    loader.load( 'scene.gltf', function ( gltf ) {

                        model = gltf.scene;
                        scene.add(model);

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


            const pmremGenerator = new THREE.PMREMGenerator( renderer );
            pmremGenerator.compileEquirectangularShader();

            window.addEventListener( 'resize', onWindowResize, false );

        }

        function onWindowResize() { //make canvas responsive
            camera.aspect = window.innerWidth / window.innerHeight;
            aspect = camera.aspect;
            camera.updateProjectionMatrix();
            renderer.setSize( window.innerWidth, window.innerHeight );
            render();

        }

        function render() {// refresh view/re-render canvas

            scrollDelta = currentScroll - scrollBuffer;
            if(browserName === "Chrome") {scrollDelta *= 0.03;}
            requestAnimationFrame(render);
            var delta = clock.getDelta();

            let updateBuffer = delta*scrollDelta*20*scrollSpeed;

            if (mixer != null) {

                //restrict animation to 0.11s - 22.9s (24FPS)
                if (currentTime > 22.9){currentTime = 22.9;}
                if (currentTime < 0.11){currentTime = 0.11;}

                currentTime = currentTime + updateBuffer;
                if(currentTime >= 0.11 && currentTime < 22.9){
                    //do something if animation is within restricted range
                currentTime
                } else {
                    //don't play animation
                    updateBuffer = 0;
                }

                //sync animation time with scroll position
                mixer.update(updateBuffer);
                scrollBuffer = currentScroll;

                currentAnimationFrame = mixer.time * 24;
            
                //hide or unhide clickable divs based on current frame
                if (currentAnimationFrame > 58 && firstHiddenDiv){
                    firstHiddenDiv.classList.add('active-div');
                }

                if (currentAnimationFrame > 75 || currentAnimationFrame < 58){
                    firstHiddenDiv.classList.remove('active-div');
                }
            

                if (currentAnimationFrame > 268 && secondHiddenDiv){
                    secondHiddenDiv.classList.add('active-div');
                }

                if (currentAnimationFrame > 284 || currentAnimationFrame < 268){
                    secondHiddenDiv.classList.remove('active-div');
                }
            

                if (currentAnimationFrame > 480 && thirdHiddenDiv){
                    thirdHiddenDiv.classList.add('active-div');
                }

                if (currentAnimationFrame > 494 || currentAnimationFrame < 480){
                    thirdHiddenDiv.classList.remove('active-div');
                }

            };

            renderer.render( scene, camera );

        }

//event functions
function zoom(event) {
    event.preventDefault();
    currentScroll += event.deltaY * -0.01;
  }
  
function firstButtonClick(){
    window.open('https://www.google.com/');
}
function secondButtonClick(){
    window.open('https://www.amazon.com/');
}
function thirdButtonClick(){
    window.open('https://www.duckduckgo.com/');
}

  //event listeners
  el.onwheel = zoom;
  firstHiddenButton.addEventListener('click', firstButtonClick);
  secondHiddenButton.addEventListener('click', secondButtonClick);
  thirdHiddenButton.addEventListener('click', thirdButtonClick);