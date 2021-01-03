import * as THREE from './three.module.js';

import { OrbitControls } from './OrbitControls.js';
import { GLTFLoader } from './GLTFLoader.js';
import { RGBELoader } from './RGBELoader.js';
import { RoughnessMipmapper } from './RoughnessMipmapper.js';

import ColorPicker from './simple-color-picker.module.js';
 
let colorPickerTop = new ColorPicker();

let topColour = 0x880000;
let midColour = 0x008800;
let bottomColour = 0x000088;
let legsColour = 0x008888;
let skipBG = false;

let camera, scene, renderer;
let topStool, midStool, bottomStool, legsStool;
let topStoolMat, midStoolMat, bottomStoolMat, legsStoolMat;

init();
render();

function init() {

   const canvas = document.querySelector( '#c' );

    camera = new THREE.PerspectiveCamera( 45, (0.78* window.innerWidth) / window.innerHeight, 0.25, 20 );
    camera.position.set( - 1.1, 0.9, 0.5 );

    scene = new THREE.Scene();



    new RGBELoader()
        .setDataType( THREE.UnsignedByteType )
        .setPath( 'textures/equirectangular/' )
        .load( 'royal_esplanade_1k.hdr', function ( texture ) {

            const envMap = pmremGenerator.fromEquirectangular( texture ).texture;

            // scene.background = envMap;
            scene.environment = envMap;

            texture.dispose();
            pmremGenerator.dispose();

            render();

            // model

            // use of RoughnessMipmapper is optional
            const roughnessMipmapper = new RoughnessMipmapper( renderer );

            const loader = new GLTFLoader().setPath( 'stool/' );
            loader.load( 'split_meshes.gltf', function ( gltf ) {

                gltf.scene.traverse( function ( child ) {

                    if ( child.isMesh ) {
                        // TOFIX RoughnessMipmapper seems to be broken with WebGL 2.0
                        // roughnessMipmapper.generateMipmaps( child.material );

                        switch(child.name){

                            case 'topObj':
                                topStool = child;
                                topStoolMat = child.material;
                                topStoolMat.color.set(getDimmerColour(topColour));
                                topStoolMat.map = null;
                                break;
                            case 'middleObj':
                                midStool = child;
                                midStoolMat = child.material;
                                midStoolMat.color.set(getDimmerColour(midColour));
                                midStoolMat.map = null;
                                break;
                            case 'bottomObj':
                                bottomStool = child;
                                bottomStoolMat = child.material;
                                bottomStoolMat.color.set(getDimmerColour(bottomColour));
                                bottomStoolMat.map = null;
                                break;
                            case 'feetObj':
                                legsStool = child;
                                legsStoolMat = child.material;
                                legsStoolMat.color.set(getDimmerColour(legsColour));
                                legsStoolMat.map = null;
                                legsStoolMat.flatShading = true;
                                break;
                        }


                    }

                } );

                scene.add( topStool );
                scene.add( midStool );
                scene.add( bottomStool );
                scene.add( legsStool );

                roughnessMipmapper.dispose();

                render();

            } );


        } );

    renderer = new THREE.WebGLRenderer( { 
        canvas,
        antialias: true,
        alpha: true 
    } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( 0.78*window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;

    const pmremGenerator = new THREE.PMREMGenerator( renderer );
    pmremGenerator.compileEquirectangularShader();

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render ); // use if there is no animation loop
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.target.set( 0, 0, - 0.2 );
    controls.update();

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = 0.78*window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( 0.78*window.innerWidth, window.innerHeight );

    render();

}

//

function render() {

    renderer.render( scene, camera );

}


function getDimmerColour(oldColour){
    let dummyPicker = new ColorPicker({color: oldColour});
    let buffer = dummyPicker.getRGB();
    // let newColour = getDimmerColour(calcBuffer);

    let reds = buffer.r * 255;
    let greens = buffer.g * 255;
    let blues = buffer.b * 255;
    reds = Math.floor(reds/3);
    greens = Math.floor(greens/3);
    blues = Math.floor(blues/3);

    if(reds < 16){reds += 16;} 
    reds = reds.toString(16);

    if(greens < 16){greens += 16;} 
    greens = greens.toString(16);

    if(blues < 16){blues += 16;} 
    blues = blues.toString(16);

    let hexColour;

    hexColour = "#" + reds + greens +blues;

    let bufferPicker = new ColorPicker({color: hexColour});

    return bufferPicker.getHexNumber();
}

function topClick(){
    skipBG = true;
    removePickers();
    colorPickerTop = new ColorPicker({color: topColour});

    colorPickerTop.onChange(  () => {

        if(topStoolMat) {
            topColour = colorPickerTop.getHexNumber();
            // let calcBuffer = colorPickerTop.getRGB();
            // let newColour = getDimmerColour(topColour);
            topStoolMat.color.set( getDimmerColour(topColour));
            const topHex = colorPickerTop.getHexString();
            document.querySelector('#top_colour_button').style.backgroundColor = ''+ topHex;
        }
        skipBG = true;
        render();
    });

    colorPickerTop.appendTo('#top_colour_picker');
    render();
}

function midClick(){
    skipBG = true;
    removePickers();
    colorPickerTop = new ColorPicker({color: midColour});

    colorPickerTop.onChange(  () => {

        if(midStoolMat) {
            midColour = colorPickerTop.getHexNumber();
            // let calcBuffer = colorPickerTop.getRGB();
            // let newColour = getDimmerColour(calcBuffer);
            midStoolMat.color.set( getDimmerColour(midColour));
            const midHex = colorPickerTop.getHexString();
            document.querySelector('#mid_colour_button').style.backgroundColor = ''+ midHex;
        }
        skipBG = true;
        render();
    });

    colorPickerTop.appendTo('#mid_colour_picker');
    const CP = document.querySelector('#mid_colour_picker');
    CP.style.top = "140px";
    render();
}

function bottomClick(){
    skipBG = true;
    removePickers();
    colorPickerTop = new ColorPicker({color: bottomColour});

    colorPickerTop.onChange(  () => {

        if(bottomStoolMat) {
            bottomColour = colorPickerTop.getHexNumber();
            // let calcBuffer = colorPickerTop.getRGB();
            // let newColour = getDimmerColour(calcBuffer);
            bottomStoolMat.color.set( getDimmerColour(bottomColour));
            const bottomHex = colorPickerTop.getHexString();
            document.querySelector('#bottom_colour_button').style.backgroundColor = ''+ bottomHex;
        }
        skipBG = true;
        render();
    });

    colorPickerTop.appendTo('#bottom_colour_picker');
    const CP = document.querySelector('#bottom_colour_picker');
    CP.style.top = "200px";
    render();
}

function legsClick(){
    skipBG = true;
    removePickers();
    colorPickerTop = new ColorPicker({color: legsColour});

    colorPickerTop.onChange(  () => {

        if(legsStoolMat) {
            legsColour = colorPickerTop.getHexNumber();
            // let calcBuffer = colorPickerTop.getRGB();
            // let newColour = getDimmerColour(calcBuffer);
            legsStoolMat.color.set(getDimmerColour(legsColour));
            const legsHex = colorPickerTop.getHexString();
            document.querySelector('#legs_colour_button').style.backgroundColor = ''+ legsHex;
        }
        skipBG = true;
        render();
    });

    colorPickerTop.appendTo('#legs_colour_picker');
    const CP = document.querySelector('#legs_colour_picker');
    CP.style.top = "260px";
    render();
}

function bgClick(){
    if(!skipBG)removePickers();
    skipBG = false;
}

function removePickers(){
    colorPickerTop.remove();
}

window.onload = function() {
    var top = document.querySelector('#top_colour_button');
    top.onclick = topClick;
    var mid = document.querySelector('#mid_colour_button');
    mid.onclick = midClick;
    var bottom = document.querySelector('#bottom_colour_button');
    bottom.onclick = bottomClick;
    var legs = document.querySelector('#legs_colour_button');
    legs.onclick = legsClick;
    var bg = document.querySelector('#body_click');
    bg.onclick = bgClick;

}