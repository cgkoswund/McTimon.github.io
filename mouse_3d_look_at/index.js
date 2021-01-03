import * as THREE from './three.module.js';
//import {OrbitControls} from './OrbitControls.js';
import {GLTFLoader} from './GLTFLoader.js';
import { EXRLoader } from './EXRLoader.js';

const params = {
  envMap: 'PNG',
  roughness: 0.0,
  metalness: 0.0,
  exposure: 1.0,
  debug: false,
};

let container, stats;
let camera, scene, renderer, controls;
let torusMesh, planeMesh;
let pngCubeRenderTarget, exrCubeRenderTarget;
let pngBackground, exrBackground;

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true
    });
    

    let material = new THREE.MeshStandardMaterial( {
      metalness: params.roughness,
      roughness: params.metalness,
      envMapIntensity: 1.0
    } );

//////////////////////////////
    THREE.DefaultLoadingManager.onLoad = function ( ) {

      pmremGenerator.dispose();

    };

    new EXRLoader()
      .setDataType( THREE.UnsignedByteType )
      .load( './textures/piz_compressed.exr', function ( texture ) {

        exrCubeRenderTarget = pmremGenerator.fromEquirectangular( texture );
        exrBackground = exrCubeRenderTarget.texture;

        texture.dispose();

      } );

    new THREE.TextureLoader().load( './textures/equirectangular.png', function ( texture ) {

      texture.encoding = THREE.sRGBEncoding;

      pngCubeRenderTarget = pmremGenerator.fromEquirectangular( texture );

      pngBackground = pngCubeRenderTarget.texture;

      texture.dispose();

    } );

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
  

    const scene = new THREE.Scene();
    // scene.background = new THREE.Color('white');

    // {
    //     const hlight = new THREE.AmbientLight (0x9090a0, 15);
    //     scene.add(hlight);
    // }
  
    // {
    //   const skyColor = 0xB1E1FF;  // light blue
    //   const groundColor = 0xB97A20;  // brownish orange
    //   const intensity = 12;
    //   const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    //   scene.add(light);
    // }
  

    // {
    //   const color = 0xFFFFFF;
    //   const intensity = 1.3;
    //   const light = new THREE.DirectionalLight(color, intensity);
    //   light.position.set(5, 10, 20);
    //   scene.add(light);
    //   scene.add(light.target);
    // }
    
    let stool;
    // function dumpObject(obj, lines = [], isLast = true, prefix = '') {
    //     const localPrefix = isLast ? '└─' : '├─';
    //     lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    //     const newPrefix = prefix + (isLast ? '  ' : '│ ');
    //     const lastNdx = obj.children.length - 1;
    //     obj.children.forEach((child, ndx) => {
    //       const isLast = ndx === lastNdx;
    //       dumpObject(child, lines, isLast, newPrefix);
    //     });
    //     return lines;
    //   }

    {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load('./models/4c4b3605.gltf', (gltf) => {
        const root = gltf.scene;
        scene.add(root);
  
        // compute the box that contains all the stuff
        // from root and below
        const box = new THREE.Box3().setFromObject(root);
  
        // const boxSize = box.getSize(new THREE.Vector3()).length();
        // const boxCenter = box.getCenter(new THREE.Vector3());

        stool = root.getObjectByName('4c4b3605');

        // console.log(dumpObject(root).join('\n'));
        // if(!stool)console.log('YIKES!!!');
        // else console.log(stool);
        // return root;
      });
    }

    
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
        // console.log(e);
        pointerX = e.clientX;
        pointerY = e.clientY;
    });

    let xAngleIncrement;
    let yAngleIncrement;
    function lookAtMouse(){
        /**
         * y-angle-degree-limit: 30
         * y-angle-limit: (Math.PI*y-axis)/180
         * x-angle-degree-limit: -30 to 30
         * x-angle-limit: (Math.PI*x-axis)/180
         * 
         * x-axis transform: mouse (2*pointerX-maxX)/maxX
         * y-axis transform: ((maxY-2pointerY)/maxY
         * 
         * x-angle target = x-angle-limit*y-axis-transform
         * y-angle target = y-angle-limit*x-axis-transform
         * 
         * 
         */

         const xAngleDegreeLimit = 60;
         const yAngleDegreeLimit = 60;
         const speed=0.05;

         let xAxisTransform = (2*pointerX - highestX)/highestX;
         let yAxisTransform = (2*pointerY - highestY)/highestY;

         let xAngleTarget = (Math.PI/180)*xAngleDegreeLimit*yAxisTransform;
         let yAngleTarget = (Math.PI/180)*yAngleDegreeLimit*xAxisTransform;

         xAngleIncrement = speed * (xAngleTarget - stool.rotation.x);
         yAngleIncrement = speed * (yAngleTarget - stool.rotation.y);


    }
    function render() {


      let newEnvMap;// = torusMesh.material.envMap;
				let background = scene.background;

				switch ( params.envMap ) {

					case 'EXR':
						newEnvMap = exrCubeRenderTarget ? exrCubeRenderTarget.texture : null;
						background = exrBackground;
						break;
					case 'PNG':
						newEnvMap = pngCubeRenderTarget ? pngCubeRenderTarget.texture : null;
						background = pngBackground;
            break;
        }

        if(stool){
            // console.log(`RENDERING!!! ${stool.rotation.y}`);
            lookAtMouse();
            stool.rotation.y += yAngleIncrement;
            stool.rotation.x += xAngleIncrement;
            canvas.zIndex = 4;
    }
        // console.log(myMesh.position.x);
        // console.log(`mouseX: ${pointerX},mouseY: ${pointerY}, xMax: ${highestX}, yMax: ${highestY}`);
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
  
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }
  
  main();
  