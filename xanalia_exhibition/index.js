import * as THREE from './three.module.js';
import { PointerLockControls } from './XanaliaControls.js';
import { GLTFLoader } from './GLTFLoader.js';import { RGBELoader } from './RGBELoader.js';


//limits: x--> (-135,135), z--> (-70,70);
document.getElementById('blocker').style.visibility="hidden";

let camera, scene, renderer, controls, rendererNew;

let cameraViewingDistance = 20;
let yHeight = 13;
let worldScaleFactor = 10;

let canvasElement;// = document.getElementById('load');

let objects = [];

let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let isDragging = false;
let isMouseDown = false;

let floorMesh, circleMesh, wallMesh;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

const clickedCanvasMaterial = new THREE.MeshStandardMaterial( { 
	color: 0xffff66,
	metalness: 0,
	roughness: 1
} );

let previousClickedMaterial;
let previousClickedCanvas;

init();
animate();

function init() {

	camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.y = yHeight;

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );
	scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

	const light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
	light.position.set( 0.5, 1, 0.75 );
	scene.add( light );

	let radius   = 3;
	let segments = 24;
	let circleMaterial = new THREE.MeshBasicMaterial( { color: 0x0000ff} );
	let circleGeometry = new THREE.CircleGeometry( radius, segments );

	circleMesh = new THREE.Mesh(circleGeometry, circleMaterial)
	scene.add(circleMesh);
	circleMesh.position.set(0,0,-50);
	circleMesh.rotation.x = -Math.PI/2

	controls = new PointerLockControls( camera, document.body );

	const blocker = document.getElementById( 'blocker' );
	const instructions = document.getElementById( 'instructions' );

	instructions.addEventListener( 'click', function () {

		controls.lock();

	} );

	controls.addEventListener( 'lock', function () {

		instructions.style.display = 'none';
		blocker.style.display = 'none';
		// console.log("lock event captured")

	} );



	controls.addEventListener( 'unlock', function () {

		blocker.style.display = 'block';
		instructions.style.display = '';
		// console.log("unlock event captured");

	} );

	scene.add( controls.getObject() );

	const onKeyDown = function ( event ) {

		switch ( event.code ) {

			case 'ArrowUp':
			case 'KeyW':
				moveForward = true;
				break;

			case 'ArrowLeft':
			case 'KeyA':
				moveLeft = true;
				break;

			case 'ArrowDown':
			case 'KeyS':
				moveBackward = true;
				break;

			case 'ArrowRight':
			case 'KeyD':
				moveRight = true;
				break;

			case 'Space':
				if ( canJump === true ) velocity.y += 350/2;
				canJump = false;
				break;

		}

	};

	const onKeyUp = function ( event ) {

		switch ( event.code ) {

			case 'ArrowUp':
			case 'KeyW':
				moveForward = false;
				break;

			case 'ArrowLeft':
			case 'KeyA':
				moveLeft = false;
				break;

			case 'ArrowDown':
			case 'KeyS':
				moveBackward = false;
				break;

			case 'ArrowRight':
			case 'KeyD':
				moveRight = false;
				break;

		}

	};

	document.addEventListener( 'keydown', onKeyDown );
	document.addEventListener( 'keyup', onKeyUp );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.setClearColor(0x000000);
	renderer.shadowMap.enabled = true;
	renderer.physicallyCorrectLights = true;
	renderer.toneMappingExposure = 0.75
	;
	document.body.appendChild( renderer.domElement );
	canvasElement = renderer.domElement;
	renderer.domElement.style.visibility="hidden";

	//


//////////////////////////////////////////////////////////////////////
/*GALLERY IMPORT */
/////////////////////
const pmremGenerator = new THREE.PMREMGenerator( renderer );
pmremGenerator.compileEquirectangularShader();
let envMap;
new RGBELoader()
.setDataType( THREE.UnsignedByteType )
.setPath( 'textures/equirectangular/' )
// .load( 'royal_esplanade_1k.hdr', function ( texture ) {
.load( 'royal_esplanade_1k - Copy (3).hdr', function ( texture ) {

envMap = pmremGenerator.fromEquirectangular( texture ).texture;

// scene.background = envMap;
scene.environment = envMap;

texture.dispose();
pmremGenerator.dispose();


// render();

} );//end of hdri import

"============================== Vars for all cart canvasses ======================"
let canvas_1, canvas_2, canvas_3, canvas_4, canvas_5, canvas_6, canvas_7, canvas_8, canvas_9, canvas_10,
canvas_11, canvas_12, canvas_13, canvas_14, canvas_15, canvas_16, canvas_17, canvas_18, canvas_19, 
canvas_20, canvas_21, canvas_22, canvas_23, canvas_24;

let canvas_1_mat, canvas_2_mat, canvas_3_mat, canvas_4_mat, canvas_5_mat, canvas_6_mat, canvas_7_mat, canvas_8_mat, canvas_9_mat, canvas_10_mat,
canvas_11_mat, canvas_12_mat, canvas_13_mat, canvas_14_mat, canvas_15_mat, canvas_16_mat, canvas_17_mat, canvas_18_mat, canvas_19_mat, 
canvas_20_mat, canvas_21_mat, canvas_22_mat, canvas_23_mat, canvas_24_mat;
"================================================================================="

	const galleryLoader = new GLTFLoader().setPath( 'models/simple/' );

    galleryLoader.load( 'simple room2.gltf', function ( gltf ) {
		// console.log(gltf.scene);
        gltf.scene.traverse( function ( child ) {

			"===================Separate imported models and store================="
            if ( child.isMesh ) {

                switch(child.name){

                    case 'Plane005_1':
                        canvas_1 = child;
                        // console.log('found Mesh 1');
                        canvas_1_mat = child.material;
						objects.push(canvas_1);
                        // bearingMat.color.set(0x181818);
                        break;                 
						
                    case 'Plane004_1':
                        canvas_2 = child;
                        // console.log('found Mesh 2');
                        canvas_2_mat = child.material;
						objects.push(canvas_2);
                        // bearingMat.color.set(0x181818);
                        break;                 
                    case 'Plane003_1':
                        canvas_3 = child;
                        // console.log('found Mesh 3');
                        canvas_3_mat = child.material;
						objects.push(canvas_3);
                        // bearingMat.color.set(0x181818);
                        break;                 
                    case 'Plane002_1':
                        canvas_4 = child;
                        // console.log('found Mesh 4');
                        canvas_4_mat = child.material;
						objects.push(canvas_4);
                        // bearingMat.color.set(0x181818);
                        break;                 
                    case 'Plane_1':
                        canvas_5 = child;
                        // console.log('found Mesh 5');
                        canvas_5_mat = child.material;
						objects.push(canvas_5);
                        // bearingMat.color.set(0x181818);
                        break;                 
                    case 'Plane006_1':
                        canvas_6 = child;
                        // console.log('found Mesh 6');
                        canvas_6_mat = child.material;
						objects.push(canvas_6);
                        // bearingMat.color.set(0x181818);
                        break;                 
                    case 'Plane051_1':
                        canvas_7 = child;
                        // console.log('found Mesh 7');
                        canvas_7_mat = child.material;
						objects.push(canvas_7);
                        // bearingMat.color.set(0x181818);
                        break;                 
                    case 'Plane008_1':
                        canvas_8 = child;
                        // console.log('found Mesh 8');
                        canvas_8_mat = child.material;
						objects.push(canvas_8);
                        // bearingMat.color.set(0x181818);
                        break;                 
                    case 'Plane017_1':
                        canvas_9 = child;
                        // console.log('found Mesh 9');
                        canvas_9_mat = child.material;
						objects.push(canvas_9);
                        // bearingMat.color.set(0x181818);
                        break;                 
                    case 'Plane018_1':
                        canvas_10= child;
                        // console.log('found Mesh 10');
                        canvas_10_mat = child.material;
						objects.push(canvas_10);
                        // bearingMat.color.set(0x181818);
                        break;                 
                    case 'Plane019_1':
                        canvas_11 = child;
                        // console.log('found Mesh 11');
                        canvas_11_mat = child.material;
						objects.push(canvas_11);
                        // bearingMat.color.set(0x181818);
                        break;                 
                    case 'Plane020_1':
                        canvas_12 = child;
                        // console.log('found Mesh 12');
                        canvas_12_mat = child.material;
						objects.push(canvas_12);
                        // bearingMat.color.set(0x181818);
                        break;                 
                    case 'Plane013_1':
                        canvas_13 = child;
                        // console.log('found Mesh 13');
                        canvas_13_mat = child.material;
						objects.push(canvas_13);
                        // bearingMat.color.set(0x181818);
                        break;                 
                    case 'Plane012_1':
                        canvas_14 = child;
                        // console.log('found Mesh 14');
                        canvas_14_mat = child.material;
						objects.push(canvas_14);
                        // bearingMat.color.set(0x181818);
                        break;                 
                    case 'Plane011_1':
                        canvas_15 = child;
                        // console.log('found Mesh 15');
                        canvas_15_mat = child.material;
						objects.push(canvas_15);
                        // bearingMat.color.set(0x181818);
                        break;                 
                    case 'Plane010_1':
                        canvas_16 = child;
                        // console.log('found Mesh 16');
                        canvas_16_mat = child.material;
						objects.push(canvas_16);
                        // bearingMat.color.set(0x181818);
                        break;                 
                    // case 'Plane010_1':
                    case 'Plane009_1':
                        canvas_17 = child;
                        // console.log('found Mesh 16 plus');
                        canvas_17_mat = child.material;
						objects.push(canvas_17);
                        // bearingMat.color.set(0x181818);
                        break;                 
                    case 'Plane014_1':
                        canvas_18 = child;
                        // console.log('found Mesh 18');
                        canvas_18_mat = child.material;
						objects.push(canvas_18);
                        // bearingMat.color.set(0x181818);
                        break;                 
                    case 'Plane015_1':
                        canvas_19 = child;
                        // console.log('found Mesh 19');
                        canvas_19_mat = child.material;
						objects.push(canvas_19);
                        // bearingMat.color.set(0x181818);
                        break;                    
                    case 'Plane016_1':
                        canvas_20 = child;
                        // console.log('found Mesh 20');
                        canvas_20_mat = child.material;
						objects.push(canvas_20);
                        // bearingMat.color.set(0x181818);
                        break;                 
                    case 'Plane021_1':
                        canvas_21 = child;
                        // console.log('found Mesh 20');
                        canvas_21_mat = child.material;
						objects.push(canvas_21);
                        // bearingMat.color.set(0x181818);
                        break;                 
                    case 'Plane022_1':
                        canvas_22 = child;
                        // console.log('found Mesh 20');
                        canvas_22_mat = child.material;
						objects.push(canvas_22);
                        // bearingMat.color.set(0x181818);
                        break;                 
                    case 'Plane023_1':
                        canvas_23 = child;
                        // console.log('found Mesh 20');
                        canvas_23_mat = child.material;
						objects.push(canvas_23);
                        // bearingMat.color.set(0x181818);
                        break;                 
                    case 'Plane024_1':
                        canvas_24 = child;
                        // console.log('found Mesh 20');
                        canvas_24_mat = child.material;
						objects.push(canvas_24);
                        // bearingMat.color.set(0x181818);
                        break;              
                    case 'Cube001_1':
                        floorMesh = child;
                        // console.log('found Mesh floor');
                        // canvas_24_mat = child.material;
						// objects.push(canvas_24);
                        // bearingMat.color.set(0x181818);
                        break;              
                    case 'Cube001':
                        wallMesh = child;
                        // console.log('found Mesh floor');
                        // canvas_24_mat = child.material;
						// objects.push(canvas_24);
                        // bearingMat.color.set(0x181818);
                        break;              

/*                    case 'pivot_LP001':
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
                        break; 
*/
                }


            }
			"=================================End of separate models and store======================="
        } );

        // console.log(gltf.scene);
		gltf.scene.scale.set(worldScaleFactor,worldScaleFactor,worldScaleFactor);
        scene.add( gltf.scene );

        // bearingLinkMeshes = meshGenCallback(noOfLinks, bearingMesh);
        // pivotLinkMeshes = meshGenCallback(noOfLinks, pivotMesh);
        // slateLinkMeshes = meshGenCallback(noOfLinks, slateMesh);
        // slateInLinkMeshes = meshGenCallback(noOfLinks, slateMeshIn);
        // scene.add( pivotMesh );
        // scene.add( slateMesh );
        // scene.add( slateMeshIn );
        // scene.add( bearingMesh );

        // roughnessMipmapper.dispose();

        // render();

    } );
			///////////////////////////////////////////////////////////////////////

				window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

	requestAnimationFrame( animate );

	const time = performance.now();

	if ( controls.isLocked === true ) {


		const delta = ( time - prevTime ) / 1000;

		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;

		velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

		direction.z = Number( moveForward ) - Number( moveBackward );
		direction.x = Number( moveRight ) - Number( moveLeft );
		direction.normalize(); // this ensures consistent movements in all directions

		if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
		if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;


		controls.moveRight( - velocity.x * delta );
		controls.moveForward( - velocity.z * delta );

		controls.getObject().position.y += ( velocity.y * delta ); // new behavior

		if ( controls.getObject().position.y < yHeight ) {

			velocity.y = 0;
			controls.getObject().position.y = yHeight;

			canJump = true;

		}

	}

	prevTime = time;

	if(camera.position.x>135)camera.position.x = 135;
	if(camera.position.x<-135)camera.position.x = -135;
	if(camera.position.z>70)camera.position.z = 70;
	if(camera.position.z<-70)camera.position.z = -70;

	renderer.render( scene, camera );
	// console.log(camera.position);

}

document.onreadystatechange = function () {
	let state = document.readyState;
	document.getElementById('blocker').style.visibility="hidden";
	if (state == 'interactive') {		

	} else if (state == 'complete') {
		setTimeout(function(){
			document.getElementById('interactive');
			document.getElementById('load').style.visibility="hidden";
			document.getElementById('blocker').style.visibility="visible";
			renderer.domElement.style.visibility="visible";

		},1000);
	}
}



const mouse = new THREE.Vector2();
raycaster = new THREE.Raycaster();
let intersects;
function onMouseDown(e){
	isMouseDown = true;
	// mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	// mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
	// raycaster.setFromCamera(mouse,camera);
	// let intersects3 = raycaster.intersectObjects( scene.children, true);


	// console.log(intersects);

}

function onMouseUp(e){
	isMouseDown = false;	
	let faceNormal = {x:0,y:0,z:0};
	let selectedCanvasPosition;
	let isOnCanvas = false;
	let isOnWall = false;
	for(let j = 0; j < intersects.length; j++){				

		for(let i = 0; i < objects.length; i++){

			if(objects[i] === intersects[j].object && !isDragging){
				selectedCanvasPosition = {
					x : objects[i].parent.position.x * worldScaleFactor,
					y : objects[i].parent.position.y * worldScaleFactor,
					z : objects[i].parent.position.z * worldScaleFactor
				}
				isOnCanvas = true;

			//	if(previousClickedCanvas){previousClickedCanvas.material = previousClickedMaterial}
				// previousClickedCanvas = objects[i];
				// previousClickedMaterial = objects[i].material;
				// objects[i].material = clickedCanvasMaterial;
			}
		}


		if(floorMesh === intersects[j].object && !isDragging){
			// faceNormal = intersects[j].face.normal;
			let clickPoint = intersects[j].point;
			// isOnWall = true;
			if(clickPoint.y < 0){
				controls.getObject().position.x = clickPoint.x;
				controls.getObject().position.z = clickPoint.z;	
			}
		}


		if(wallMesh === intersects[j].object){
			faceNormal = intersects[j].face.normal;
			// let clickPoint = intersects[j].point;
			isOnWall = true;
		}

		// console.log("is on wall: " + isOnWall);
		// console.log("is on canvas: " + isOnCanvas);

	}		
	if(isOnWall && isOnCanvas){
		// console.log("in here");
		let newCameraPosition = 
		{
			x: cameraViewingDistance * faceNormal.x + selectedCanvasPosition.x,
			y: cameraViewingDistance * faceNormal.y + selectedCanvasPosition.y,
			z: cameraViewingDistance * faceNormal.z + selectedCanvasPosition.z
		}
		isOnCanvas = false;
		isOnWall = false;
		// console.log("New Cam: ")
		// console.log(newCameraPosition);
		// console.log("Canvas: ")
		// console.log(selectedCanvasPosition);
		// console.log(camera.rotation.y);
		// console.log("z normal: " + faceNormal.z);
		// console.log("x normal:" + faceNormal.x);
		controls.getObject().position.x = newCameraPosition.x;
		controls.getObject().position.z = newCameraPosition.z;	
		//hacky formula but it works :-)
		let yRotation = 0;

		let roughEquals = function(a,b){
			return Math.abs(a-b)< 0.1

		}

		if(roughEquals(faceNormal.z,1) && roughEquals(faceNormal.x,0)){
			yRotation = 0;
		}
		if(roughEquals(faceNormal.z,0) && roughEquals(faceNormal.x,1)){
			yRotation = Math.PI/2;
		}
		if(roughEquals(faceNormal.z,-1) && roughEquals(faceNormal.x,0)){
			yRotation = Math.PI;
		}
		if(roughEquals(faceNormal.z,0) && roughEquals(faceNormal.x,-1)){
			yRotation = -Math.PI/2;
		}
		camera.rotation.set(
			0,
			yRotation,
			0
		);	

	}
	isMouseDown = false;
	isDragging = false;
}

function onMouseMove(e){
	mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
	raycaster.setFromCamera(mouse,camera);
	intersects = raycaster.intersectObjects( scene.children, true);

	if(isMouseDown){
		isDragging = true;
	}

	for(let j = 0; j < intersects.length; j++){
		if(floorMesh === intersects[j].object){
			let clickPoint = intersects[j].point;
			if(clickPoint.y < 0){
				circleMesh.position.set(clickPoint.x,0,clickPoint.z);
			}

			// console.log("got one!")
			// if(previousClickedCanvas){previousClickedCanvas.material = previousClickedMaterial}
			// previousClickedCanvas = objects[i];
			// previousClickedMaterial = objects[i].material;
			// objects[i].material = clickedCanvasMaterial;
		}
		else{
			circleMesh.position.set(0,-1,0);
		}
	}

}
// console.log(canvasElement);

canvasElement.addEventListener( 'mousedown', onMouseDown );
canvasElement.addEventListener( 'mouseup', onMouseUp );
canvasElement.addEventListener( 'mousemove', onMouseMove );
// console.log(scene.children);