import * as THREE from './three.module.js';
//import {OrbitControls} from './OrbitControls.js';
import {GLTFLoader} from './GLTFLoader.js';
import { EXRLoader } from './EXRLoader.js';
import { RGBELoader } from './RGBELoader.js';
import { RoughnessMipmapper } from './RoughnessMipmapper.js';

const params = {
  envMap: 'EXR',
  roughness: 0.0,
  metalness: 0.0,
  exposure: 5.0,
  debug: false,
};

let canvas, stats;
let camera, sceneR, renderer, controls;
// let torusMesh, planeMesh;
// let pngCubeRenderTarget, exrCubeRenderTarget;
// let pngBackground, exrBackground;
let topStool;


function main() {
    canvas = document.querySelector('#c');
    renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true
    });

//////////////////////////////
    THREE.DefaultLoadingManager.onLoad = function ( ) {

      pmremGenerator.dispose();

    };

    
sceneR = new THREE.Scene();

    new RGBELoader()
        .setDataType( THREE.UnsignedByteType )
        .setPath( 'textures/' )
        .load( 'royal_esplanade_1k.hdr', function ( texture ) {

            const envMap = pmremGenerator.fromEquirectangular( texture ).texture;

            // scene.background = envMap;
            sceneR.environment = envMap;

            texture.dispose();
            pmremGenerator.dispose();

            render();

            // model

            // use of RoughnessMipmapper is optional
            const roughnessMipmapper = new RoughnessMipmapper( renderer );

            const loader = new GLTFLoader().setPath( 'models/' );
            loader.load( '4c4b3605.gltf', function ( gltf ) {

                gltf.scene.traverse( function ( child ) {

                    if ( child.isMesh ) {
                        // TOFIX RoughnessMipmapper seems to be broken with WebGL 2.0
                        // roughnessMipmapper.generateMipmaps( child.material );
                        topStool = child;
                        sceneR.add( topStool );
                    }

                } );

                

                roughnessMipmapper.dispose();

                render();

            } );


        } );

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( 0.78*window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.outputEncoding = THREE.sRGBEncoding;

    const pmremGenerator = new THREE.PMREMGenerator( renderer );
    pmremGenerator.compileEquirectangularShader();


/////////////////////////////

    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(-0.4, 0.5, 1.7);
    camera.rotation.x = -0.20;

    let highestX; 
    let highestY;
    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
        highestX = canvas.clientWidth;
        highestY = canvas.clientHeight;
      }
      return needResize;
    }
    let pointerX = 5;
    let pointerY = 6;
    window.addEventListener('mousemove', function(e){
        pointerX = e.clientX;
        pointerY = e.clientY;
    });

    let xAngleIncrement;
    let yAngleIncrement;
    function lookAtMouse(){


         const xAngleDegreeLimit = 60;
         const yAngleDegreeLimit = 60;
         const speed=0.05;

         let xAxisTransform = (2*pointerX - highestX)/highestX;
         let yAxisTransform = (2*pointerY - highestY)/highestY;

         let xAngleTarget = (Math.PI/180)*xAngleDegreeLimit*yAxisTransform;
         let yAngleTarget = (Math.PI/180)*yAngleDegreeLimit*xAxisTransform;

         xAngleIncrement = speed * (xAngleTarget - topStool.rotation.x);
         yAngleIncrement = speed * (yAngleTarget - topStool.rotation.y);


    }
    function render() {


      // let newEnvMap;

			// 	switch ( params.envMap ) {

			// 		case 'EXR':
			// 			newEnvMap = exrCubeRenderTarget ? exrCubeRenderTarget.texture : null;
			// 			scene.environment = exrBackground;
			// 			break;
			// 		case 'PNG':
			// 			newEnvMap = pngCubeRenderTarget ? pngCubeRenderTarget.texture : null;
			// 			scene.environment = pngBackground;
      //       break;
      //   }

        if(topStool){
            lookAtMouse();
            topStool.rotation.y += yAngleIncrement;
            topStool.rotation.x += xAngleIncrement;
            canvas.zIndex = 4;
    }
        // console.log(myMesh.position.x);
        // console.log(`mouseX: ${pointerX},mouseY: ${pointerY}, xMax: ${highestX}, yMax: ${highestY}`);
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
  
      renderer.render(sceneR, camera);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }
  
  main();
  