
/*------------------DONE----------------

//add env map - DONE 
//bring back the orbit functionality - DONE
//let gears rotate according to correct ratio - DONE
//bottom of gears sets floor, not bottom of chain -DONE
//lengthen tip of sprocket - DONE
-fill in back faces - DONE
-use stool code to change from cubemap to equirectangular - DONE
-set overall "52 engaged angular speed", the calculate everything else from it - DONE
//slant the teeth, then slant the tip too - DONE
//create dom on the fly like helmet example to fix hdri issue - DONE (something else worked!)

---------------------------------------------------
*/

/*---------------------PENDING----------------------
//centre the animation based on target window size 


//better chain models (just do this in blender)
-Make sprocket thinner, make them a bit further apart, add separator rings
//better chain animation (math based, incorporate speed calc)
//set "LOOKAT"/controls orbit centre position to calculate as the centre of the two chains
//add 'X' or arc braces to inner ring
-potentially pass theme color as rgb values to webview to fake transparency
--------------------------------------------------------------
*/


import * as THREE from '../build/three.module.js';

import { GUI } from './jsm/libs/dat.gui.module.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';

let controls, camera, scene, renderer;
let textureEquirec, textureCube;
let sphereMesh, sphereMaterial;

init();
animate();

function init() {

    // CAMERAS

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 100000 );
    camera.position.set( 0, 0, 1000 );

    // SCENE

    scene = new THREE.Scene();

    // Lights

    const ambient = new THREE.AmbientLight( 0xffffff );
    scene.add( ambient );

    // Textures

    const loader = new THREE.CubeTextureLoader();
    loader.setPath( 'textures/cube/Bridge2/' );

    textureCube = loader.load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
    textureCube.encoding = THREE.sRGBEncoding;

    const textureLoader = new THREE.TextureLoader();

    textureEquirec = textureLoader.load( 'textures/2294472375_24a3b8ef46_o.jpg' );
    textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
    textureEquirec.encoding = THREE.sRGBEncoding;

    scene.background = textureCube;

    //

    const geometry = new THREE.IcosahedronGeometry( 400, 15 );
    sphereMaterial = new THREE.MeshLambertMaterial( { envMap: textureCube } );
    sphereMesh = new THREE.Mesh( geometry, sphereMaterial );
    scene.add( sphereMesh );

    //

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild( renderer.domElement );

    //

    controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 500;
    controls.maxDistance = 2500;

    //

    const params = {
        Cube: function () {

            scene.background = textureCube;

            sphereMaterial.envMap = textureCube;
            sphereMaterial.needsUpdate = true;

        },
        Equirectangular: function () {

            scene.background = textureEquirec;

            sphereMaterial.envMap = textureEquirec;
            sphereMaterial.needsUpdate = true;

        },
        Refraction: false
    };

    const gui = new GUI();
    gui.add( params, 'Cube' );
    gui.add( params, 'Equirectangular' );
    gui.add( params, 'Refraction' ).onChange( function ( value ) {

        if ( value ) {

            textureEquirec.mapping = THREE.EquirectangularRefractionMapping;
            textureCube.mapping = THREE.CubeRefractionMapping;

        } else {

            textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
            textureCube.mapping = THREE.CubeReflectionMapping;

        }

        sphereMaterial.needsUpdate = true;

    } );
    gui.open();

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {

    camera.lookAt( scene.position );
    renderer.render( scene, camera );

}

