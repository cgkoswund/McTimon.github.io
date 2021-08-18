import * as THREE from './three.module.js';
import { leftGearPoints,rightGearPoints,GearGenerator } from "./GearGenerator.js";
import { BufferGeometryUtils } from './BufferGeometryUtils__m.js';
import { OrbitControls } from './OrbitControls2.js';
import { Curve, TetrahedronGeometry } from "./three.module.js";
import {BespokeGeo} from "./BespokeGeo2.js"
import { RGBELoader } from './RGBELoader.js';
import { GLTFLoader } from './GLTFLoader.js';

import { HDRCubeTextureLoader } from './HDRCubeTextureLoader.js';
import { RGBMLoader } from './RGBMLoader.js';
import { DebugEnvironment } from './DebugEnvironment.js';
import { ChainAnimGenerator } from './chainAnimGenerator.js';


let camera, scene, rendererNew;
let oldRGBELoader;
let envMap;

let chainCurve, chainPoints, chainGeometry,chainMaterial, chainSplineObject;

let frontSprocketZShift = 0; //to replace GearGenerator.rightSprocketCentreZOffset for better centering


let oldControlsTarget = {x:GearGenerator.sprocketCentreInterval/2,y:0,z:0};
let oldControlsPosition = {x:GearGenerator.sprocketCentreInterval/2,y:0,z:10};
// let oldControlsPosition = {x:10,y:10,z:15}
let rearTeethCount = 42;
let rearTeethSet = [30,25,20,15,10,5];
let isFirstRGBEPageLoad = true;

let frontTeethSet = [40,"None"];
let paddleTeethCount = 100;
let container, stats;
// let camera, scene, renderer, controls;
let torusMesh, planeMesh;
let generatedCubeRenderTarget, ldrCubeRenderTarget, hdrCubeRenderTarget, rgbmCubeRenderTarget;
let ldrCubeMap, hdrCubeMap, rgbmCubeMap;
let linkMeshes;
let bearingMesh, pivotMesh, slateMesh, slateMeshIn;
let bearingMat, pivotMat, slateMat, slateInMat;
let pivotAnimLocations = [];

let bearingLinkMeshes = [];
let pivotLinkMeshes = [];
let slateLinkMeshes = [];
let slateInLinkMeshes = [];

let isPopulatedBearing = false;
let isPopulatedPivot = false;
let isPopulatedSlate = false;
let isPopulatedSlateIn = false;
let isPopulatedBufferGeo = false;

let isFirstCameraSetup = true;
// let sprocketOne, sprocketTwo, sprocketThree, sprocketFour, sprocketFive;
let timeCustom = 0;
let containerNew;

let noOfLinks = GearGenerator.noOfLinks;
// console.log(noOfLinks);
// let noOfLinks; 

let rearToothedGears = [];
let frontToothedGears = [];

function init(rearTeethSetArray,frontTeethSetArray,activeRearGear,activeFrontGear, meshGenCallback){
    noOfLinks = ChainAnimGenerator.points(rearTeethSetArray[activeRearGear],frontTeethSetArray[activeFrontGear]);
    noOfLinks = noOfLinks[noOfLinks.length-1];
    frontSprocketZShift = -0.5*((rearTeethSetArray.length-1)*2*GearGenerator.rearSprocketZSpacing+(frontTeethSetArray.length-1)*2*GearGenerator.rearSprocketZSpacing);
    // console.log(noOfLinks2);
    frontToothedGears = [];
    rearToothedGears = [];
    rearTeethSet = rearTeethSetArray;
    frontTeethSet = frontTeethSetArray;

    let chainParamsArray = ChainAnimGenerator.points(rearTeethSetArray[activeRearGear],frontTeethSetArray[activeFrontGear]);
    // noOfLinks = chainParamsArray[4];
    // console.log(chainParamsArray);

    // console.log("isPopulatedGeneral: " + isPopulatedGeneral);
    // isPopulatedBearing = isPopulatedPivot = isPopulatedSlate = isPopulatedSlateIn;// = isPopulatedGeneral;

    /**/container = document.querySelector("#canvas_root");
    const canvas = document.querySelector('#c');
    /*const*/ //let renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
    /*const*/ rendererNew = new THREE.WebGLRenderer({ canvas, antialias: true, alpha:true});
    rendererNew.setClearColor(0x000000);
    rendererNew.shadowMap.enabled = true;
    
    rendererNew.physicallyCorrectLights = true;
    rendererNew.toneMapping = THREE.ACESFilmicToneMapping;

    camera = new THREE.PerspectiveCamera( 40, (0.78* window.innerWidth) / window.innerHeight, 0.1, 1000 );
    // camera.position.set( - 1.1, 1.9, 20.5 );
    // camera.position.set(8, 5, 12.2).multiplyScalar(4);

function positionCameraToWindowSize(width, height){
    let xPos = 0;
    let yPos = 0;
    let zPos = 0;


}
camera.position.set(oldControlsPosition.x, oldControlsPosition.y, oldControlsPosition.z);
    // camera.position.set(10, 10, 15);//.multiplyScalar(4);
    // camera.lookAt(oldControlsTarget.x,oldControlsTarget.y,oldControlsTarget.z);
    // camera.lookAt(9.8,3.5,5);
    // camera.lookAt(10,10,10);
    // camera.lookAt(1.8,3.5,2);

    // const texture = new THREE.TextureLoader().load( 'textures/equirectangular/royal_esplanade_1k.hdr' );

////////////////////
const materialX2 = new THREE.MeshStandardMaterial( { //sprocket metal
    color: 0xaaaaaa,
	metalness: 1,
	roughness: 0.2
} );
const materialX3 = new THREE.MeshStandardMaterial( { //chain metal
    color: 0xbb8933,
    // color: 0x996622,
	metalness: 1,
	roughness: 0.5
} );

let envMap;
// if(isFirstRGBEPageLoad){
/*rgbeLoader = */ new RGBELoader()
.setDataType( THREE.UnsignedByteType )
.setPath( 'textures/equirectangular/' )
.load( 'royal_esplanade_1k.hdr', function ( texture ) {

    envMap = pmremGenerator.fromEquirectangular( texture ).texture;

    // scene.background = envMap;
    scene.environment = envMap;

    texture.dispose();
    pmremGenerator.dispose();

    // render();

    } );
// isFirstRGBEPageLoad = false;
// oldRGBELoader = rgbeLoader;
// }


    const bearingLoader = new GLTFLoader().setPath( 'models/' );
    bearingLoader.load( 'split_meshes.gltf', function ( gltf ) {

        gltf.scene.traverse( function ( child ) {

            if ( child.isMesh ) {
                // TOFIX RoughnessMipmapper seems to be broken with WebGL 2.0
                // roughnessMipmapper.generateMipmaps( child.material );
                const chainScale = 0.25;  
                switch(child.name){

                    case 'bearing_LP001':
                        bearingMesh = child;
                        // console.log('found Mesh');
                        bearingMat = child.material;
                        bearingMat.color.set(0x181818);
                        bearingMat.roughness = 0.4;
                        bearingMat.metalness = 1;
                        bearingMesh.scale.set(chainScale,chainScale,chainScale);
                        // topStoolMat.color.set(getDimmerColour(topColour));
                        // topStoolMat.map = null;
                        break;                 
                    case 'pivot_LP001':
                        pivotMesh = child;
                        pivotMat = child.material;

                        pivotMat = child.material;
                        pivotMat.color.set(0x333333);
                        pivotMat.roughness = 0.5;
                        pivotMat.metalness = 1;
                        pivotMesh.scale.set(chainScale,chainScale,chainScale);
                        // midStoolMat.color.set(getDimmerColour(midColour));
                        // midStoolMat.map = null;
                        break;
                    case 'slate_LP001':
                        slateMesh = child;
                        slateMat = child.material;

                        slateMat = child.material;
                        slateMat.color.set(0xbb8933);
                        slateMat.roughness = 0.2;
                        slateMat.metalness = 1;
                        slateMesh.scale.set(chainScale,chainScale,chainScale);
                        // bottomStoolMat.color.set(getDimmerColour(bottomColour));
                        // bottomStoolMat.map = null;
                        break;
                    case 'slate_LPin001':
                        slateMeshIn = child;
                        slateInMat = child.material;

                        slateInMat = child.material;
                        // slateInMat.color.set(0x553525);
                        slateInMat.color.set(0xbb8933);
                        slateInMat.roughness = 0.3;
                        slateInMat.metalness = 1;
                        slateMeshIn.position.z = 0.5;
                        slateMeshIn.scale.set(chainScale,chainScale,chainScale);
                        // bottomStoolMat.color.set(getDimmerColour(bottomColour));
                        // bottomStoolMat.map = null;
                        break;/* 
*/
                }


            }

        } );

        // console.log(gltf.scene);
        // scene.add( gltf.scene );

        bearingLinkMeshes = meshGenCallback(noOfLinks, bearingMesh);
        pivotLinkMeshes = meshGenCallback(noOfLinks, pivotMesh);
        slateLinkMeshes = meshGenCallback(noOfLinks, slateMesh);
        slateInLinkMeshes = meshGenCallback(noOfLinks, slateMeshIn);
        // scene.add( pivotMesh );
        // scene.add( slateMesh );
        // scene.add( slateMeshIn );
        // scene.add( bearingMesh );

        // roughnessMipmapper.dispose();

        // render();

    } );


    // console.log('bearing loader: '); console.log(bearingLoader);
    // if(!isFirstRGBEPageLoad){rgbeLoader = oldRGBELoader;}


    // rendererNew = new THREE.WebGLRenderer( { 
    //     canvas,
    //     antialias: true,
    //     alpha: true 
    // } );

    rendererNew.toneMapping = THREE.ACESFilmicToneMapping;
    rendererNew.outputEncoding = THREE.sRGBEncoding;

    const pmremGenerator = new THREE.PMREMGenerator( rendererNew );
    pmremGenerator.compileEquirectangularShader();
    
    rendererNew.outputEncoding = THREE.sRGBEncoding;

    scene = new THREE.Scene();

{
    const light = new THREE.DirectionalLight(0xffddff, 1);
    light.position.set(0,2,-5);
    scene.add(light);
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

    const d = 50;
    light.shadow.camera.left = -d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = -d;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 50;
    light.shadow.bias = 0.001;
}

{
    const light2 = new THREE.DirectionalLight(0xccffff, 0.81);
    light2.position.set(1,2,15);
    scene.add(light2);
}

const carWidth = GearGenerator.carWidth;
const carHeight = GearGenerator.carHeight;
const carLength = GearGenerator.carLength;

const chainLink = new THREE.Object3D();
scene.add(chainLink);

const bodyGeometry = new THREE.BoxBufferGeometry(carWidth, carHeight, carLength);
const bodyMaterial = new THREE.MeshStandardMaterial(
    {color: 0xeecc00,metalness:0.6,roughness:0.05}
);
const bodyMesh = new THREE.Mesh(bodyGeometry, materialX3);
// const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
bodyMesh.position.y = 0;
// bodyMesh.position.y = 1.4;
bodyMesh.castShadow = true;
chainLink.add(bodyMesh);

const wheelRadius = GearGenerator.wheelRadius;
const wheelThickness = GearGenerator.wheelThickness;
const wheelSegments = GearGenerator.wheelSegments;
const wheelGeometry = new THREE.CylinderBufferGeometry(
    wheelRadius, //top rad
    wheelRadius, //bottom rad
    wheelThickness,
    wheelSegments

);


const wheelMaterial = new THREE.MeshStandardMaterial(
    {color: 0xffdd66,metalness:0.5,roughness:0.05}
);
const wheelPositions = [
    [-carWidth/2 - wheelThickness/2, - 0*carHeight/2, 0],
    [carWidth/2 + wheelThickness/2, - 0*carHeight/2, 0],
];

/*const wheelMeshes =*/ wheelPositions.map((position) => {
    let mesh = new THREE.Mesh(wheelGeometry, materialX3);
    // let mesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
    mesh.position.set(...position);
    mesh.rotation.z = Math.PI/2;
    mesh.castShadow =  true;
    bodyMesh.add(mesh);
    return mesh;
});

let radiusL = GearGenerator.radius(rearTeethSetArray[activeRearGear]);//RL
let radiusR = GearGenerator.radius(frontTeethSetArray[activeFrontGear]);//Rr
let maxTeethCount = 0;

for(let i = 0; i < rearTeethSetArray.length;i++){
    maxTeethCount = Math.max(maxTeethCount,rearTeethSet[i])
}

for(let i = 0; i < frontTeethSetArray.length;i++){
    maxTeethCount = Math.max(maxTeethCount,frontTeethSet[i]);
}

let sprocketCentreHeight = GearGenerator.radius(maxTeethCount)+wheelRadius*1.5;
if(isFirstCameraSetup){
    let extension = 0.2;
oldControlsTarget = {x:(GearGenerator.sprocketCentreInterval + radiusR - radiusL) /2 + extension,y:sprocketCentreHeight,z:0};
oldControlsPosition = {x:(GearGenerator.sprocketCentreInterval + radiusR - radiusL)/2 + extension,y:sprocketCentreHeight,z:20};
camera.position.set(oldControlsPosition.x,oldControlsPosition.y,oldControlsPosition.z);
isFirstCameraSetup = false;

}
const sprocketCentreInterval= GearGenerator.sprocketCentreInterval;  //d

let extrudeSettings;
// let material;
let sprocketToothed;
for(let j = 0;j < rearTeethSetArray.length; j++){ 
sprocketToothed = BespokeGeo.sprocket(rearTeethSetArray[j],0,sprocketCentreHeight,-carWidth/4 + 2*j*GearGenerator.rearSprocketZSpacing);

rearToothedGears.push(sprocketToothed);
sprocketToothed.name="sprocket";
scene.add(sprocketToothed);


extrudeSettings = GearGenerator.extrudeSettings;


// material = new THREE.MeshStandardMaterial( { color: 0x848080,roughness:0.05, metalness: 0} );

}//end of rear sprocket set 'for loop'


for(let j = 0; j<frontTeethSetArray.length;j++){
    sprocketToothed = BespokeGeo.sprocket(frontTeethSetArray[(frontTeethSetArray.length-j-1)],GearGenerator.sprocketCentreInterval,sprocketCentreHeight,-carWidth/4 + (-frontTeethSetArray.length+1 + j)*2*GearGenerator.rearSprocketZSpacing - frontSprocketZShift);
    
    frontToothedGears.push(sprocketToothed);
    sprocketToothed.name="sprocket";
    
    scene.add(sprocketToothed);
    }//end of front sprocket 'for loop'

    
// let noOfLinks = GearGenerator.noOfLinks;
linkMeshes = [];

// for(let i = 0; i<noOfLinks;i++){
    // linkMeshes.push(chainLink.clone());
    // scene.add(linkMeshes[i]);
// }

bodyMesh.position.y = 200;
const arrayGenPoint = [];

const aMax = Math.atan((radiusR-radiusL)/sprocketCentreInterval);
const curveResolution = 15;//number of curve "handles"
let interval = (Math.PI-2*aMax)/(curveResolution/2); //angle interval for arcs during spline generation
let aRanger = aMax;
let chainTheta = 0;
let xPoint = 0;
let yPoint = 0;
let zPoint = 0;

////chain points
//move chains out a bit
let chainExpandFactor = 1.045;
//smaller sprocker half points
for (let i = 0; i < (curveResolution/2); i++){
    
    chainTheta = Math.PI/2 + aRanger + interval*i;
    xPoint = radiusL*chainExpandFactor*Math.cos(chainTheta);
    yPoint = -1 * radiusL*chainExpandFactor*Math.sin(chainTheta) - sprocketCentreHeight;
    zPoint = GearGenerator.rearSprocketZSpacing*activeRearGear;

    arrayGenPoint.push(new THREE.Vector3(xPoint,zPoint,yPoint));//append
}

chainTheta = 0;
interval = (Math.PI+2*aMax)/(curveResolution/2); 
aRanger = Math.PI/2 - aMax;

//larger sprocker half points
for (let j = 0; j < (curveResolution/2); j++){
    chainTheta = Math.PI + aRanger + interval*(j);
    xPoint = sprocketCentreInterval + radiusR*chainExpandFactor*Math.cos(chainTheta);
    // yPoint = 0-carWidth/4 + (-frontTeethSetArray.length+1 + activeFrontGear)*GearGenerator.rearSprocketZSpacing - GearGenerator.rightSprocketCentreZOffset;
    yPoint = -1*radiusR*chainExpandFactor*Math.sin(chainTheta) - sprocketCentreHeight;

    arrayGenPoint.push(new THREE.Vector3(xPoint,
        // 0-GearGenerator.rightSprocketCentreZOffset + GearGenerator.rearSprocketZSpacing*activeRearGear,
        1*(/*-carWidth/4 +*/(/*-frontTeethSetArray.length+1 +*/ -activeFrontGear)*GearGenerator.rearSprocketZSpacing - frontSprocketZShift),
        // 0-carWidth/4 + (-frontTeethSetArray.length+1 + activeFrontGear)*GearGenerator.rearSprocketZSpacing - GearGenerator.rightSprocketCentreZOffset,
        yPoint));//append
}

arrayGenPoint.push(arrayGenPoint[0]);//append

chainCurve = new THREE.CatmullRomCurve3(arrayGenPoint);

chainPoints = chainCurve.getPoints(curveResolution);
chainGeometry = new THREE.BufferGeometry().setFromPoints(chainPoints);
chainMaterial = new THREE.LineBasicMaterial({color:0xff0000});
chainSplineObject =  new THREE.Line(chainGeometry, chainMaterial);

chainSplineObject.rotation.x = Math.PI * .5;
chainSplineObject.position.y = 0.05;
// scene.add(chainSplineObject);

function resizeRendererToDisplaySize(rendererNew){
    const canvas = rendererNew.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const needResize = canvas.width !== width || canvas.height !== height;
    if(needResize){
        rendererNew.setSize(width*2.2, height*2.2, false);
    }
    return needResize
}

const controls = new OrbitControls( camera, rendererNew.domElement );
// controls.addEventListener( 'change', render ); // use if there is no animation loop
controls.minDistance = 2;
controls.maxDistance = 1000;
controls.target.set( oldControlsTarget.x, oldControlsTarget.y, oldControlsTarget.z);
controls.update();

function render(time) {
    oldControlsTarget = controls.target;
    oldControlsPosition = controls.object.position;

    time *= 0.001;
if(!linkMeshes[0]){
    for(let i = 0; i<noOfLinks;i++){
    linkMeshes.push(chainLink.clone());
    scene.add(linkMeshes[i]);
}
// console.log("bufferGeo loop");
}

    //wait for mesh load before referencing
    // if(bearingMesh && !isPopulatedBearing){console.log("isPopulatedBearing in render: " + isPopulatedBearing);
    //     // bearingLinkMeshes = [];
    //         isPopulatedBearing = true;
    //     for(let i = 0; i<noOfLinks;i++){
    //         linkMeshes.push(chainLink.clone());
    //         bearingLinkMeshes.push(bearingMesh.clone());
    //         scene.add(bearingLinkMeshes[i]);
    //         scene.add(linkMeshes[i]);
    //     }           
    //                 console.log("No. of Links: " + noOfLinks);
    //                  console.log("isPopulatedBearing in render: " + isPopulatedBearing);
    // }

    //  if(bearingMesh){console.log("bearingLinkMesh in render: "); console.log(bearingLinkMeshes[0].position);}
// console.log(bearingLinkMeshes.length);
//wait for mesh load before referencing
    // if(pivotMesh && !isPopulatedPivot){
    //         // linkMeshes = [];
    //         isPopulatedPivot = true;
    //     for(let i = 0; i<noOfLinks;i++){
    //         // linkMeshes.push(chainLink.clone());
    //         pivotLinkMeshes.push(pivotMesh.clone());
    //         scene.add(pivotLinkMeshes[i]);
    //     }
    // }

//wait for mesh load before referencing
    // if(slateMesh && !isPopulatedSlate){
    //         // linkMeshes = [];
    //         isPopulatedSlate = true;
    //     for(let i = 0; i<noOfLinks;i++){
    //         // linkMeshes.push(chainLink.clone());
    //         slateLinkMeshes.push(slateMesh.clone());
    //         scene.add(slateLinkMeshes[i]);
    //     }
    // }

//wait for mesh load before referencing
    // if(slateMeshIn && !isPopulatedSlateIn){
    //         // linkMeshes = [];
    //         isPopulatedSlateIn = true;
    //     for(let i = 0; i<noOfLinks/2;i++){
    //         // linkMeshes.push(chainLink.clone());
    //         slateInLinkMeshes.push(slateMeshIn.clone());
    //         scene.add(slateInLinkMeshes[i]);
    //     }
    // }


    if(resizeRendererToDisplaySize(rendererNew)){
        const canvas = rendererNew.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
    }

    let speed2 = 134/noOfLinks;
    // let speed2 = GearGenerator.fiftyTwoAngularVelocity*0.02;

    let angularSpeedRear = GearGenerator.fiftyTwoAngularVelocity/rearTeethSetArray[activeRearGear];
    let angularSpeedFront = GearGenerator.fiftyTwoAngularVelocity/frontTeethSetArray[activeFrontGear];

    let tankXPosition = new THREE.Vector3();
    let tankXTarget = new THREE.Vector3();


         // move chain ring
      if(bearingMesh && bearingLinkMeshes[noOfLinks-1]){
      for(let k = 0;k<noOfLinks;k++){
        let tankXTime = ((time + k*0.15*speed2) * .05);
        chainCurve.getPointAt(tankXTime % 1, tankXPosition);
        chainCurve.getPointAt((tankXTime + 0.01) % 1, tankXTarget);
        linkMeshes[k].position.set(tankXPosition.x, tankXPosition.z * -1, tankXPosition.y);
        linkMeshes[k].lookAt(tankXTarget.x, tankXTarget.z *-1, tankXTarget.y);
        bearingLinkMeshes[k].position.set(tankXPosition.x, tankXPosition.z * -1, tankXPosition.y);
        bearingLinkMeshes[k].lookAt(tankXTarget.x, tankXTarget.z *-1, tankXTarget.y);
               chainLink.rotation.z=Math.PI; 
        }
    }
      //move chain cylinder
      if(pivotMesh && pivotLinkMeshes[noOfLinks-1]){
          pivotAnimLocations=[];
        for(let k = 0;k<noOfLinks;k++){

          let tankXTime = ((time + k*0.15*speed2) * .05);
          chainCurve.getPointAt(tankXTime % 1, tankXPosition);
          chainCurve.getPointAt((tankXTime + 0.01) % 1, tankXTarget);
          pivotLinkMeshes[k].position.set(tankXPosition.x, tankXPosition.z * -1, tankXPosition.y);
          pivotLinkMeshes[k].lookAt(tankXTarget.x, tankXTarget.z *-1, tankXTarget.y);
          chainLink.rotation.z=Math.PI; 
          
          pivotAnimLocations.push({x: tankXPosition.x, y: tankXPosition.z * -1, z: tankXPosition.y})
          }
      }
      
    //   console.log(pivotAnimLocations);

      //move chain flat outer link
      if(slateMesh && slateLinkMeshes[noOfLinks-1]){
        for(let k = 0;k<noOfLinks;k++){
          let tankXTime = ((time + k*0.15*speed2) * .05);
          chainCurve.getPointAt(tankXTime % 1, tankXPosition);
          chainCurve.getPointAt((tankXTime + 0.01) % 1, tankXTarget);
          slateLinkMeshes[k].position.set(tankXPosition.x, tankXPosition.z * -1, tankXPosition.y);
          slateLinkMeshes[k].lookAt(tankXTarget.x, tankXTarget.z *-1, tankXTarget.y);
          slateLinkMeshes[k].position.set(pivotAnimLocations[k].x, pivotAnimLocations[k].y, pivotAnimLocations[k].z+0.07);
                 chainLink.rotation.z=Math.PI; 
          }
      }

      //move chain flat inner link
      if(slateMeshIn && slateInLinkMeshes[noOfLinks-1]){
      for(let k = 0;k<noOfLinks;k++){
        let tankXTime = ((time + k*0.15*speed2) * .05);
        chainCurve.getPointAt(tankXTime % 1, tankXPosition);
        chainCurve.getPointAt((tankXTime + 0.01) % 1, tankXTarget);
        slateInLinkMeshes[k].position.set(tankXPosition.x, tankXPosition.z * -1, tankXPosition.y);
        slateInLinkMeshes[k].lookAt(tankXTarget.x, tankXTarget.z *-1, tankXTarget.y);
        slateInLinkMeshes[k].position.set(pivotAnimLocations[k].x, pivotAnimLocations[k].y, pivotAnimLocations[k].z-0.07);       
        chainLink.rotation.z=Math.PI; 
        }
    }

    //rotate sprockets
    for(let i = 0; i < rearToothedGears.length;i++){

        rearToothedGears[i].rotation.y = angularSpeedRear*time;
        rearToothedGears[i].material = materialX2;
        // rearToothedGears[i].material.envMap = newEnvMap;
        rearToothedGears[i].material.needsUpdate = true;
        // materialX3.envMap = newEnvMap;
    }

    for(let i = 0; i < frontToothedGears.length;i++){

        frontToothedGears[i].rotation.y = angularSpeedFront*time;
        frontToothedGears[i].material = materialX2;
        // frontToothedGears[i].material.envMap = newEnvMap;
        frontToothedGears[i].material.needsUpdate = true;
        // materialX3.envMap = newEnvMap;
    }
    rendererNew.toneMappingExposure = 0.75;
    rendererNew.render(scene, camera);

    requestAnimationFrame(render);
    }

    requestAnimationFrame(render);



}/////////////////////END OF INIT


function reset(rearTeethSetArray,frontTeethSetArray,activeRearGear,activeFrontGear, meshGenCallback){
    noOfLinks = ChainAnimGenerator.points(rearTeethSet[activeRearGear],frontTeethSet[activeFrontGear]);
    noOfLinks = noOfLinks[noOfLinks.length-1];
    frontSprocketZShift = -0.5*((rearTeethSetArray.length-1)*2*GearGenerator.rearSprocketZSpacing+(frontTeethSetArray.length-1)*2*GearGenerator.rearSprocketZSpacing);
    // console.log(GearGenerator.rearSprocketZSpacing);
//     frontToothedGears = [];
//     rearToothedGears = [];
    rearTeethSet = rearTeethSetArray;
    frontTeethSet = frontTeethSetArray;

//     let chainParamsArray = ChainAnimGenerator.points(rearTeethSetArray[activeRearGear],frontTeethSetArray[activeFrontGear]);
//     // noOfLinks = chainParamsArray[4];
//     // console.log(chainParamsArray);

//     // console.log("isPopulatedGeneral: " + isPopulatedGeneral);
//     // isPopulatedBearing = isPopulatedPivot = isPopulatedSlate = isPopulatedSlateIn;// = isPopulatedGeneral;

//     /**/container = document.querySelector("#canvas_root");
//     const canvas = document.querySelector('#c');
//     /*const*/ //let renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
//     /*const*/ rendererNew = new THREE.WebGLRenderer({ canvas, antialias: true, alpha:true});
//     rendererNew.setClearColor(0x000000);
//     rendererNew.shadowMap.enabled = true;
    
//     rendererNew.physicallyCorrectLights = true;
//     rendererNew.toneMapping = THREE.ACESFilmicToneMapping;

//     camera = new THREE.PerspectiveCamera( 40, (0.78* window.innerWidth) / window.innerHeight, 0.1, 1000 );
//     // camera.position.set( - 1.1, 1.9, 20.5 );
//     // camera.position.set(8, 5, 12.2).multiplyScalar(4);

// function positionCameraToWindowSize(width, height){
//     let xPos = 0;
//     let yPos = 0;
//     let zPos = 0;


// }
// camera.position.set(oldControlsPosition.x, oldControlsPosition.y, oldControlsPosition.z);
//     // camera.position.set(10, 10, 15);//.multiplyScalar(4);
//     // camera.lookAt(oldControlsTarget.x,oldControlsTarget.y,oldControlsTarget.z);
//     // camera.lookAt(9.8,3.5,5);
//     // camera.lookAt(10,10,10);
//     // camera.lookAt(1.8,3.5,2);

//     // const texture = new THREE.TextureLoader().load( 'textures/equirectangular/royal_esplanade_1k.hdr' );

// ////////////////////
// const materialX2 = new THREE.MeshStandardMaterial( { //sprocket metal
//     color: 0xaaaaaa,
// 	metalness: 1,
// 	roughness: 0.2
// } );
// const materialX3 = new THREE.MeshStandardMaterial( { //chain metal
//     color: 0xbb8933,
//     // color: 0x996622,
// 	metalness: 1,
// 	roughness: 0.5
// } );


// // if(isFirstRGBEPageLoad){
// // /*rgbeLoader = */ new RGBELoader()
// // .setDataType( THREE.UnsignedByteType )
// // .setPath( 'textures/equirectangular/' )
// // .load( 'royal_esplanade_1k.hdr', function ( texture ) {

// //     envMap = pmremGenerator.fromEquirectangular( texture ).texture;


// //     scene.environment = envMap;

// //     texture.dispose();
// //     pmremGenerator.dispose();

// //     // render();

// //     } );
// // isFirstRGBEPageLoad = false;
// // oldRGBELoader = rgbeLoader;
// // }


// //     const bearingLoader = new GLTFLoader().setPath( 'models/' );
// //     bearingLoader.load( 'split_meshes.gltf', function ( gltf ) {

// //         gltf.scene.traverse( function ( child ) {

// //             if ( child.isMesh ) {
// //                 // TOFIX RoughnessMipmapper seems to be broken with WebGL 2.0
// //                 // roughnessMipmapper.generateMipmaps( child.material );
// //                 const chainScale = 0.25;  
// //                 switch(child.name){

// //                     case 'bearing_LP001':
// //                         bearingMesh = child;
// //                         // console.log('found Mesh');
// //                         bearingMat = child.material;
// //                         bearingMat.color.set(0x181818);
// //                         bearingMat.roughness = 0.4;
// //                         bearingMat.metalness = 1;
// //                         bearingMesh.scale.set(chainScale,chainScale,chainScale);
// //                         // topStoolMat.color.set(getDimmerColour(topColour));
// //                         // topStoolMat.map = null;
// //                         break;                 
// //                     case 'pivot_LP001':
// //                         pivotMesh = child;
// //                         pivotMat = child.material;

// //                         pivotMat = child.material;
// //                         pivotMat.color.set(0x333333);
// //                         pivotMat.roughness = 0.5;
// //                         pivotMat.metalness = 1;
// //                         pivotMesh.scale.set(chainScale,chainScale,chainScale);
// //                         // midStoolMat.color.set(getDimmerColour(midColour));
// //                         // midStoolMat.map = null;
// //                         break;
// //                     case 'slate_LP001':
// //                         slateMesh = child;
// //                         slateMat = child.material;

// //                         slateMat = child.material;
// //                         slateMat.color.set(0xbb8933);
// //                         slateMat.roughness = 0.2;
// //                         slateMat.metalness = 1;
// //                         slateMesh.scale.set(chainScale,chainScale,chainScale);
// //                         // bottomStoolMat.color.set(getDimmerColour(bottomColour));
// //                         // bottomStoolMat.map = null;
// //                         break;
// //                     case 'slate_LPin001':
// //                         slateMeshIn = child;
// //                         slateInMat = child.material;

// //                         slateInMat = child.material;
// //                         // slateInMat.color.set(0x553525);
// //                         slateInMat.color.set(0xbb8933);
// //                         slateInMat.roughness = 0.3;
// //                         slateInMat.metalness = 1;
// //                         slateMeshIn.position.z = 0.5;
// //                         slateMeshIn.scale.set(chainScale,chainScale,chainScale);
// //                         // bottomStoolMat.color.set(getDimmerColour(bottomColour));
// //                         // bottomStoolMat.map = null;
// //                         break;/* 
// // */
// //                 }


// //             }

// //         } );

// //         // console.log(gltf.scene);
// //         // scene.add( gltf.scene );

// //         bearingLinkMeshes = meshGenCallback(noOfLinks, bearingMesh);
// //         pivotLinkMeshes = meshGenCallback(noOfLinks, pivotMesh);
// //         slateLinkMeshes = meshGenCallback(noOfLinks, slateMesh);
// //         slateInLinkMeshes = meshGenCallback(noOfLinks, slateMeshIn);
// //         // scene.add( pivotMesh );
// //         // scene.add( slateMesh );
// //         // scene.add( slateMeshIn );
// //         // scene.add( bearingMesh );

// //         // roughnessMipmapper.dispose();

// //         // render();

// //     } );


//     // console.log('bearing loader: '); console.log(bearingLoader);
//     // if(!isFirstRGBEPageLoad){rgbeLoader = oldRGBELoader;}


//     // rendererNew = new THREE.WebGLRenderer( { 
//     //     canvas,
//     //     antialias: true,
//     //     alpha: true 
//     // } );

//     rendererNew.toneMapping = THREE.ACESFilmicToneMapping;
//     rendererNew.outputEncoding = THREE.sRGBEncoding;

//     const pmremGenerator = new THREE.PMREMGenerator( rendererNew );
//     pmremGenerator.compileEquirectangularShader();
    
// rendererNew.outputEncoding = THREE.sRGBEncoding;

//     scene = new THREE.Scene();

// {
//     const light = new THREE.DirectionalLight(0xffddff, 1);
//     light.position.set(0,2,-5);
//     scene.add(light);
//     light.castShadow = true;
//     light.shadow.mapSize.width = 2048;
//     light.shadow.mapSize.height = 2048;

//     const d = 50;
//     light.shadow.camera.left = -d;
//     light.shadow.camera.right = d;
//     light.shadow.camera.top = d;
//     light.shadow.camera.bottom = -d;
//     light.shadow.camera.near = 1;
//     light.shadow.camera.far = 50;
//     light.shadow.bias = 0.001;
// }

// {
//     const light2 = new THREE.DirectionalLight(0xccffff, 0.81);
//     light2.position.set(1,2,15);
//     scene.add(light2);
// }

const carWidth = GearGenerator.carWidth;
const carHeight = GearGenerator.carHeight;
const carLength = GearGenerator.carLength;

// const chainLink = new THREE.Object3D();
// scene.add(chainLink);

// const bodyGeometry = new THREE.BoxBufferGeometry(carWidth, carHeight, carLength);
// const bodyMaterial = new THREE.MeshStandardMaterial(
//     {color: 0xeecc00,metalness:0.6,roughness:0.05}
// );
// const bodyMesh = new THREE.Mesh(bodyGeometry, materialX3);
// // const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
// bodyMesh.position.y = 0;
// // bodyMesh.position.y = 1.4;
// bodyMesh.castShadow = true;
// chainLink.add(bodyMesh);

const wheelRadius = GearGenerator.wheelRadius;
// const wheelThickness = GearGenerator.wheelThickness;
// const wheelSegments = GearGenerator.wheelSegments;
// const wheelGeometry = new THREE.CylinderBufferGeometry(
//     wheelRadius, //top rad
//     wheelRadius, //bottom rad
//     wheelThickness,
//     wheelSegments

// );


// const wheelMaterial = new THREE.MeshStandardMaterial(
//     {color: 0xffdd66,metalness:0.5,roughness:0.05}
// );
// const wheelPositions = [
//     [-carWidth/2 - wheelThickness/2, - 0*carHeight/2, 0],
//     [carWidth/2 + wheelThickness/2, - 0*carHeight/2, 0],
// ];

// /*const wheelMeshes =*/ wheelPositions.map((position) => {
//     let mesh = new THREE.Mesh(wheelGeometry, materialX3);
//     // let mesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
//     mesh.position.set(...position);
//     mesh.rotation.z = Math.PI/2;
//     mesh.castShadow =  true;
//     bodyMesh.add(mesh);
//     return mesh;
// });

let radiusL = GearGenerator.radius(rearTeethSetArray[activeRearGear]);//RL
let radiusR = GearGenerator.radius(frontTeethSetArray[activeFrontGear]);//Rr
let maxTeethCount = 0;

for(let i = 0; i < rearTeethSetArray.length;i++){
    maxTeethCount = Math.max(maxTeethCount,rearTeethSet[i])
}

for(let i = 0; i < frontTeethSetArray.length;i++){
    maxTeethCount = Math.max(maxTeethCount,frontTeethSet[i]);
}

let sprocketCentreHeight = GearGenerator.radius(maxTeethCount)+wheelRadius*1.5;
// if(isFirstCameraSetup){
//     let extension = 0.2;
// oldControlsTarget = {x:(GearGenerator.sprocketCentreInterval + radiusR - radiusL) /2 + extension,y:sprocketCentreHeight,z:0};
// oldControlsPosition = {x:(GearGenerator.sprocketCentreInterval + radiusR - radiusL)/2 + extension,y:sprocketCentreHeight,z:20};
// camera.position.set(oldControlsPosition.x,oldControlsPosition.y,oldControlsPosition.z);
// isFirstCameraSetup = false;

// }
const sprocketCentreInterval= GearGenerator.sprocketCentreInterval;  //d

let extrudeSettings;
for(let j=0;j<5;j++){
for(let i=0;i< scene.children.length;i++){
    if(scene.children[i].name == "sprocket"){
        scene.remove(scene.children[i]);
    }
    // scene.remove(scene.children[i+2]);
}
}

// while(scene.children.)

rearToothedGears = [];
// console.log(scene.children);

// // let material;
let sprocketToothed;
for(let j = 0;j < rearTeethSetArray.length; j++){ 
sprocketToothed = BespokeGeo.sprocket(rearTeethSetArray[j],0,sprocketCentreHeight,-carWidth/4 + 2*j*GearGenerator.rearSprocketZSpacing);
sprocketToothed.name = "sprocket";
rearToothedGears.push(sprocketToothed);
scene.add(sprocketToothed);


extrudeSettings = GearGenerator.extrudeSettings;


// material = new THREE.MeshStandardMaterial( { color: 0x848080,roughness:0.05, metalness: 0} );

}//end of rear sprocket set 'for loop'

frontToothedGears = [];
for(let j = 0; j<frontTeethSetArray.length;j++){
    sprocketToothed = BespokeGeo.sprocket(frontTeethSetArray[(frontTeethSetArray.length-j-1)],GearGenerator.sprocketCentreInterval,sprocketCentreHeight,-carWidth/4 + (-frontTeethSetArray.length+1 + j)*2*GearGenerator.rearSprocketZSpacing - frontSprocketZShift);
    
    frontToothedGears.push(sprocketToothed);
    sprocketToothed.name = "sprocket";
    
    scene.add(sprocketToothed);
    }//end of front sprocket 'for loop'



    
// // let noOfLinks = GearGenerator.noOfLinks;
// linkMeshes = [];

// // for(let i = 0; i<noOfLinks;i++){
//     // linkMeshes.push(chainLink.clone());
//     // scene.add(linkMeshes[i]);
// // }

// bodyMesh.position.y = 200;
const arrayGenPoint = [];

const aMax = Math.atan((radiusR-radiusL)/sprocketCentreInterval);
const curveResolution = 15;//number of curve "handles"
let interval = (Math.PI-2*aMax)/(curveResolution/2); //angle interval for arcs during spline generation
let aRanger = aMax;
let chainTheta = 0;
let xPoint = 0;
let yPoint = 0;
let zPoint = 0;

////chain points
//move chains out a bit
let chainExpandFactor = 1.045;
//smaller sprocker half points
for (let i = 0; i < (curveResolution/2); i++){
    
    chainTheta = Math.PI/2 + aRanger + interval*i;
    xPoint = radiusL*chainExpandFactor*Math.cos(chainTheta);
    yPoint = -1 * radiusL*chainExpandFactor*Math.sin(chainTheta) - sprocketCentreHeight;
    zPoint = 2*GearGenerator.rearSprocketZSpacing*activeRearGear;

    arrayGenPoint.push(new THREE.Vector3(xPoint,zPoint,yPoint));//append
}

chainTheta = 0;
interval = (Math.PI+2*aMax)/(curveResolution/2); 
aRanger = Math.PI/2 - aMax;

//larger sprocker half points
for (let j = 0; j < (curveResolution/2); j++){
    chainTheta = Math.PI + aRanger + interval*(j);
    xPoint = sprocketCentreInterval + radiusR*chainExpandFactor*Math.cos(chainTheta);
    // yPoint = 0-carWidth/4 + (-frontTeethSetArray.length+1 + activeFrontGear)*GearGenerator.rearSprocketZSpacing - GearGenerator.rightSprocketCentreZOffset;
    yPoint = -1*radiusR*chainExpandFactor*Math.sin(chainTheta) - sprocketCentreHeight;

    arrayGenPoint.push(new THREE.Vector3(xPoint,
        // 0-GearGenerator.rightSprocketCentreZOffset + GearGenerator.rearSprocketZSpacing*activeRearGear,
        1*(/*-carWidth/4 +*/(/*-frontTeethSetArray.length+1 +*/ -activeFrontGear)*2*GearGenerator.rearSprocketZSpacing - frontSprocketZShift),
        // 0-carWidth/4 + (-frontTeethSetArray.length+1 + activeFrontGear)*GearGenerator.rearSprocketZSpacing - GearGenerator.rightSprocketCentreZOffset,
        yPoint));//append
}

arrayGenPoint.push(arrayGenPoint[0]);//append

chainCurve = new THREE.CatmullRomCurve3(arrayGenPoint);

chainPoints = chainCurve.getPoints(curveResolution);
chainGeometry = new THREE.BufferGeometry().setFromPoints(chainPoints);
chainMaterial = new THREE.LineBasicMaterial({color:0xff0000});
chainSplineObject =  new THREE.Line(chainGeometry, chainMaterial);
chainSplineObject.rotation.x = Math.PI * .5;
chainSplineObject.position.y = 0.05;
// scene.add(chainSplineObject);

function resizeRendererToDisplaySize(rendererNew){
    const canvas = rendererNew.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const needResize = canvas.width !== width || canvas.height !== height;
    if(needResize){
        rendererNew.setSize(width*2.2, height*2.2, false);
    }
    return needResize
}

// const controls = new OrbitControls( camera, rendererNew.domElement );
// // controls.addEventListener( 'change', render ); // use if there is no animation loop
// controls.minDistance = 2;
// controls.maxDistance = 1000;
// controls.target.set( oldControlsTarget.x, oldControlsTarget.y, oldControlsTarget.z);
// controls.update();

// function render(time) {
//     oldControlsTarget = controls.target;
//     oldControlsPosition = controls.object.position;

//     time *= 0.001;
// if(!linkMeshes[0]){
//     for(let i = 0; i<noOfLinks;i++){
//     linkMeshes.push(chainLink.clone());
//     scene.add(linkMeshes[i]);
// }
// // console.log("bufferGeo loop");
// }

//     //wait for mesh load before referencing
//     // if(bearingMesh && !isPopulatedBearing){console.log("isPopulatedBearing in render: " + isPopulatedBearing);
//     //     // bearingLinkMeshes = [];
//     //         isPopulatedBearing = true;
//     //     for(let i = 0; i<noOfLinks;i++){
//     //         linkMeshes.push(chainLink.clone());
//     //         bearingLinkMeshes.push(bearingMesh.clone());
//     //         scene.add(bearingLinkMeshes[i]);
//     //         scene.add(linkMeshes[i]);
//     //     }           
//     //                 console.log("No. of Links: " + noOfLinks);
//     //                  console.log("isPopulatedBearing in render: " + isPopulatedBearing);
//     // }

//     //  if(bearingMesh){console.log("bearingLinkMesh in render: "); console.log(bearingLinkMeshes[0].position);}
// // console.log(bearingLinkMeshes.length);
// //wait for mesh load before referencing
//     // if(pivotMesh && !isPopulatedPivot){
//     //         // linkMeshes = [];
//     //         isPopulatedPivot = true;
//     //     for(let i = 0; i<noOfLinks;i++){
//     //         // linkMeshes.push(chainLink.clone());
//     //         pivotLinkMeshes.push(pivotMesh.clone());
//     //         scene.add(pivotLinkMeshes[i]);
//     //     }
//     // }

// //wait for mesh load before referencing
//     // if(slateMesh && !isPopulatedSlate){
//     //         // linkMeshes = [];
//     //         isPopulatedSlate = true;
//     //     for(let i = 0; i<noOfLinks;i++){
//     //         // linkMeshes.push(chainLink.clone());
//     //         slateLinkMeshes.push(slateMesh.clone());
//     //         scene.add(slateLinkMeshes[i]);
//     //     }
//     // }

// //wait for mesh load before referencing
//     // if(slateMeshIn && !isPopulatedSlateIn){
//     //         // linkMeshes = [];
//     //         isPopulatedSlateIn = true;
//     //     for(let i = 0; i<noOfLinks/2;i++){
//     //         // linkMeshes.push(chainLink.clone());
//     //         slateInLinkMeshes.push(slateMeshIn.clone());
//     //         scene.add(slateInLinkMeshes[i]);
//     //     }
//     // }


//     if(resizeRendererToDisplaySize(rendererNew)){
//         const canvas = rendererNew.domElement;
//             camera.aspect = canvas.clientWidth / canvas.clientHeight;
//             camera.updateProjectionMatrix();
//     }

//     let speed2 = 134/noOfLinks;
//     // let speed2 = GearGenerator.fiftyTwoAngularVelocity*0.02;

//     let angularSpeedRear = GearGenerator.fiftyTwoAngularVelocity/rearTeethSetArray[activeRearGear];
//     let angularSpeedFront = GearGenerator.fiftyTwoAngularVelocity/frontTeethSetArray[activeFrontGear];

//     let tankXPosition = new THREE.Vector3();
//     let tankXTarget = new THREE.Vector3();


//          // move chain ring
//       if(bearingMesh && bearingLinkMeshes[noOfLinks-1]){
//       for(let k = 0;k<noOfLinks;k++){
//         let tankXTime = ((time + k*0.15*speed2) * .05);
//         chainCurve.getPointAt(tankXTime % 1, tankXPosition);
//         chainCurve.getPointAt((tankXTime + 0.01) % 1, tankXTarget);
//         linkMeshes[k].position.set(tankXPosition.x, tankXPosition.z * -1, tankXPosition.y);
//         linkMeshes[k].lookAt(tankXTarget.x, tankXTarget.z *-1, tankXTarget.y);
//         bearingLinkMeshes[k].position.set(tankXPosition.x, tankXPosition.z * -1, tankXPosition.y);
//         bearingLinkMeshes[k].lookAt(tankXTarget.x, tankXTarget.z *-1, tankXTarget.y);
//                chainLink.rotation.z=Math.PI; 
//         }
//     }
//       //move chain cylinder
//       if(pivotMesh && pivotLinkMeshes[noOfLinks-1]){
//           pivotAnimLocations=[];
//         for(let k = 0;k<noOfLinks;k++){

//           let tankXTime = ((time + k*0.15*speed2) * .05);
//           chainCurve.getPointAt(tankXTime % 1, tankXPosition);
//           chainCurve.getPointAt((tankXTime + 0.01) % 1, tankXTarget);
//           pivotLinkMeshes[k].position.set(tankXPosition.x, tankXPosition.z * -1, tankXPosition.y);
//           pivotLinkMeshes[k].lookAt(tankXTarget.x, tankXTarget.z *-1, tankXTarget.y);
//           chainLink.rotation.z=Math.PI; 
          
//           pivotAnimLocations.push({x: tankXPosition.x, y: tankXPosition.z * -1, z: tankXPosition.y})
//           }
//       }
      
//     //   console.log(pivotAnimLocations);

//       //move chain flat outer link
//       if(slateMesh && slateLinkMeshes[noOfLinks-1]){
//         for(let k = 0;k<noOfLinks;k++){
//           let tankXTime = ((time + k*0.15*speed2) * .05);
//           chainCurve.getPointAt(tankXTime % 1, tankXPosition);
//           chainCurve.getPointAt((tankXTime + 0.01) % 1, tankXTarget);
//           slateLinkMeshes[k].position.set(tankXPosition.x, tankXPosition.z * -1, tankXPosition.y);
//           slateLinkMeshes[k].lookAt(tankXTarget.x, tankXTarget.z *-1, tankXTarget.y);
//           slateLinkMeshes[k].position.set(pivotAnimLocations[k].x, pivotAnimLocations[k].y, pivotAnimLocations[k].z+0.07);
//                  chainLink.rotation.z=Math.PI; 
//           }
//       }

//       //move chain flat inner link
//       if(slateMeshIn && slateInLinkMeshes[noOfLinks-1]){
//       for(let k = 0;k<noOfLinks;k++){
//         let tankXTime = ((time + k*0.15*speed2) * .05);
//         chainCurve.getPointAt(tankXTime % 1, tankXPosition);
//         chainCurve.getPointAt((tankXTime + 0.01) % 1, tankXTarget);
//         slateInLinkMeshes[k].position.set(tankXPosition.x, tankXPosition.z * -1, tankXPosition.y);
//         slateInLinkMeshes[k].lookAt(tankXTarget.x, tankXTarget.z *-1, tankXTarget.y);
//         slateInLinkMeshes[k].position.set(pivotAnimLocations[k].x, pivotAnimLocations[k].y, pivotAnimLocations[k].z-0.07);       
//         chainLink.rotation.z=Math.PI; 
//         }
//     }

//     //rotate sprockets
//     for(let i = 0; i < rearToothedGears.length;i++){

//         rearToothedGears[i].rotation.y = angularSpeedRear*time;
//         rearToothedGears[i].material = materialX2;
//         // rearToothedGears[i].material.envMap = newEnvMap;
//         rearToothedGears[i].material.needsUpdate = true;
//         // materialX3.envMap = newEnvMap;
//     }

//     for(let i = 0; i < frontToothedGears.length;i++){

//         frontToothedGears[i].rotation.y = angularSpeedFront*time;
//         frontToothedGears[i].material = materialX2;
//         // frontToothedGears[i].material.envMap = newEnvMap;
//         frontToothedGears[i].material.needsUpdate = true;
//         // materialX3.envMap = newEnvMap;
//     }
//     rendererNew.toneMappingExposure = 0.75;
//     rendererNew.render(scene, camera);

//     requestAnimationFrame(render);
//     }

//     requestAnimationFrame(render);



}/////////////END OF RESET

// main(0,0,0,0);

function generateChainLinks(genNoOfLinks, meshObject){
    let genLinkMeshes = [];

for(let i = 0; i<genNoOfLinks;i++){
    genLinkMeshes.push(meshObject.clone());
    scene.add(genLinkMeshes[i]);
    }

    return genLinkMeshes;
}

function getTeethCount(rearTeethCount,paddleTeethCount){

    //remove "None" strings, change to number
    let rearTeethCorrected = [];
    let frontTeethCorrected = [];
    for(let i=0;i<rearTeethCount.length;i++){
        if(rearTeethCount[i]=="None"){}
        else{
             rearTeethCorrected.push(parseInt(rearTeethCount[i]));
        }
    }
    for(let i=0;i<paddleTeethCount.length;i++){
        if(paddleTeethCount[i]=="None"){}
        else{
            frontTeethCorrected.push(parseInt(paddleTeethCount[i]));
        }
    }
    // isPopulatedBearing = isPopulatedPivot = isPopulatedSlate = isPopulatedSlateIn = false;
    reset(rearTeethCorrected,frontTeethCorrected,0,0,generateChainLinks);
    // scene.environment = envMap;


}

function setActiveRearGear(activeRearGear,activeFrontGear){

    // timeCustom = 0;
    // isPopulatedBearing = isPopulatedPivot = isPopulatedSlate = isPopulatedSlateIn = false;
    reset(rearTeethSet,frontTeethSet,activeRearGear,activeFrontGear,generateChainLinks);
    // scene.environment = envMap;

    // console.log(noOfLinks);
    // console.log("isPopulatedBearing: " + isPopulatedBearing);

    // console.log("Bearing Meshes: ")
    // console.log(bearingLinkMeshes[0]);
    // console.log("Slate In Meshes: ")
    // console.log(slateInLinkMeshes);
    // console.log("Slate In Meshes: ")
    // console.log(slateInLinkMeshes);
    // console.log("Slate In Meshes: ")
    // console.log(slateInLinkMeshes);
    
}

// getTeethCount(["30","25","20","16","8"],["40","30", "20","10","8"]);
init(["30","25","20","16","8"],["40","30", "20","10","8"],0,0,generateChainLinks);


window.getTeethCount = getTeethCount;
window.setActiveRearGear = setActiveRearGear;
