import * as THREE from "../ThreeJSr138/build/three.module.js"
import { OrbitControls } from '../ThreeJSr138/examples/jsm/controls/OrbitControls.js';
import {RingBufferGeo} from "./RingBufferGeo.js"
import {DefaultConstants} from "./DefaultConstants.js"

			let camera, scene, renderer, controls;
			let handlesArray = [];
			let handleZOffsetsArray = [];
			let mesh;

			let selectedHandle,clickedHandle;
			let mouseIsDown = false;
			let isDragging = false;
			let isOnPoint = false;
			let startedOnPoint = false;

			let guideCurve, curveObject;
			let curvePoints = [];
			let ringNewPoints
			let curveSmallOffset = DefaultConstants.curveSmallOffset;

			let oldGuidePlane, newGuidePlane, oldRing, newRing;
			let newCurveHandlePoint;
			let isTransforming = false;

			let selectedHandleLocZ, selectedHandleID;



			function init() {

				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.z = 400;

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xffffff );


				// const texture = new THREE.TextureLoader().load( 'textures/crate.gif' );


				const geometry = new THREE.TorusGeometry( 100, 15, 16, 100 );
				// const material = new THREE.MeshStandardMaterial( { color: 0xfefefe, roughness:0.07 } );
				// const torus = new THREE.Mesh( geometry, material );
				// scene.add( torus );

				// const ringGeo = new THREE.BoxGeometry(100,100,100);
				// const ringMesh = new THREE.Mesh(ringGeo, material);
				// scene.add(ringMesh);

				// RingBufferGeo.make();
				let ringRadius = DefaultConstants.ringRadius;
				let controlSphereOffsetZ = DefaultConstants.ringWidth-DefaultConstants.sphereSmallOffset
				let controlSphereOffsetR = DefaultConstants.ringThickness-DefaultConstants.sphereSmallOffset
				
				{//setup control spheres

						
						let sphereGeo = new THREE.SphereGeometry(ringRadius/40);
						let sphereMat = new THREE.MeshStandardMaterial({color:0x3766ae});
						
						let sphereMatSelected = new THREE.MeshStandardMaterial({color:0x3766ae});
						for(let i = 0; i<8;i++){

							let offset = 0;
							let identifier = 0;
	
							function updateIDs(){
	
								identifier = i*4+offset;
								if(identifier<=9){identifier= "0"+identifier;}
								sphereMesh.name = "sphereHandle"+ identifier
								offset++;
								// console.log(sphereMesh);
							}	

							let sphereMesh;

							function makeSphere(){
								sphereMesh = new THREE.Mesh(sphereGeo,sphereMat)
								scene.add(sphereMesh)
								handlesArray.push(sphereMesh)
								if(i%4 == 0){
									sphereMesh.position.set((ringRadius+controlSphereOffsetR)*Math.cos(theta*i),(ringRadius+controlSphereOffsetR)*Math.sin(theta*i),controlSphereOffsetZ);
									curvePoints.push(new THREE.Vector3((ringRadius+controlSphereOffsetR)*Math.cos(theta*i),(ringRadius+controlSphereOffsetR)*Math.sin(theta*i),controlSphereOffsetZ+curveSmallOffset))

								}
							}
							let theta = Math.PI*2/8;

							// makeSphere();
							sphereMesh = new THREE.Mesh(sphereGeo,sphereMat)
							scene.add(sphereMesh)
							handlesArray.push(sphereMesh)
							sphereMesh.position.set((ringRadius+controlSphereOffsetR)*Math.cos(theta*i),(ringRadius+controlSphereOffsetR)*Math.sin(theta*i),controlSphereOffsetZ);
							curvePoints.push(new THREE.Vector3((ringRadius+controlSphereOffsetR)*Math.cos(theta*i),(ringRadius+controlSphereOffsetR)*Math.sin(theta*i),controlSphereOffsetZ+curveSmallOffset))
							updateIDs();
														
							sphereMesh = new THREE.Mesh(sphereGeo,sphereMat)
							scene.add(sphereMesh)
							handlesArray.push(sphereMesh)
							sphereMesh.position.set((ringRadius+controlSphereOffsetR)*Math.cos(theta*i),(ringRadius+controlSphereOffsetR)*Math.sin(theta*i),-controlSphereOffsetZ);
							updateIDs();
							
							
							sphereMesh = new THREE.Mesh(sphereGeo,sphereMat)
							scene.add(sphereMesh)
							handlesArray.push(sphereMesh)
							sphereMesh.position.set((ringRadius-controlSphereOffsetR)*Math.cos(theta*i),(ringRadius-controlSphereOffsetR)*Math.sin(theta*i),controlSphereOffsetZ);
							updateIDs();
								
							
							sphereMesh = new THREE.Mesh(sphereGeo,sphereMat)
							scene.add(sphereMesh)
							handlesArray.push(sphereMesh)
							sphereMesh.position.set((ringRadius-controlSphereOffsetR)*Math.cos(theta*i),(ringRadius-controlSphereOffsetR)*Math.sin(theta*i),-controlSphereOffsetZ);
							updateIDs();
						}
						
						
					}
					
					{//setup guide curve
						guideCurve = new THREE.CatmullRomCurve3( curvePoints );
						guideCurve.closed = true;
						
						ringNewPoints = guideCurve.getPoints( DefaultConstants.ringSegments );
						const geometry = new THREE.BufferGeometry().setFromPoints( ringNewPoints );
						
						const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
						
						// Create the final object to add to the scene
						curveObject = new THREE.Line( geometry, material );
						curveObject.material.transparent = true;
						curveObject.material.opacity = 0;
						scene.add(curveObject);
					}

					// console.log(handlesArray);
					// handlesArray.sort((a,b)=>b.position.x - a.position.x);
					// console.log(handlesArray);
					
					updateRing(ringNewPoints);
				const geometry2 = new THREE.TorusGeometry( 100, 15, 16, 100 );
				const material2 = new THREE.MeshBasicMaterial( { color: 0x555555, roughness:0.2 } );
				const baseCircle = new THREE.Mesh( geometry2, material2 );
				baseCircle.rotation.set(Math.PI/2,0,0);
				baseCircle.position.set(0,-115,0);
				baseCircle.scale.set(1,1,0.1);
				scene.add( baseCircle );

				const colorAmb = 0xFFFFFF;
				const intensityAmb = 0.6;
				const lightAmb = new THREE.AmbientLight(colorAmb, intensityAmb);
				lightAmb.position.set(300, 200,-100);
				scene.add(lightAmb);

				const color = 0xFFFFFF;
				const intensity = 0.2;
				const light = new THREE.DirectionalLight(color, intensity);
				light.position.set(300, 200,-100);
				light.target.position.set(0,0,0);
				scene.add(light);



				const light2 = new THREE.DirectionalLight(color, intensity);
				light2.position.set(-300, 0,-100);
				light2.target.position.set(0,0,0);
				scene.add(light2);


				const light3 = new THREE.DirectionalLight(color, intensity);
				light3.position.set(-300, 200,100);
				light3.target.position.set(0,0,0);
				scene.add(light3);

				const light4 = new THREE.DirectionalLight(color, intensity);
				light3.position.set(300, 0,100);
				light3.target.position.set(0,0,0);
				scene.add(light3);

				//const geometry = new THREE.BoxGeometry( 200, 200, 200 );
				//const material = new THREE.MeshBasicMaterial( {color:0x555555 } );
				// const material = new THREE.MeshBasicMaterial( { map: texture } );

				// mesh = new THREE.Mesh( geometry, material );
				// scene.add( mesh );

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth*1, window.innerHeight*1 );
				document.body.appendChild( renderer.domElement );

				controls = new OrbitControls( camera, renderer.domElement );
				controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
				controls.dampingFactor = 0.05;

				//

				window.addEventListener( 'resize', onWindowResize );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth*1, window.innerHeight*1 );

			}

			const raycaster = new THREE.Raycaster();
			const pointer = new THREE.Vector2();
			let sphereMat = new THREE.MeshStandardMaterial({color:0x3766ae});
			let sphereMatSelected = new THREE.MeshStandardMaterial({color:0xff66ae});

	function animate() {//basically the render function

		// update the picking ray with the camera and pointer position

	if(selectedHandle&&isTransforming){
		selectedHandleLocZ = Math.abs(selectedHandle.position.z);
		selectedHandleID = Number(selectedHandle.name.substring(12));


		//get 4 handles ID
		let batchSlot = Math.floor(selectedHandleID/4)

		//move all 4 spheres
		for(let i = 0; i < 4; i++){
		handlesArray[batchSlot*4+i].position.z = selectedHandleLocZ*(1-2*(i%2))
		}
	}
	
	for(let i = 0; i<handlesArray.length;i++){
		handlesArray[i].material.color = sphereMat.color;
	}
	if(selectedHandle)selectedHandle.material = new THREE.MeshBasicMaterial( { color: 0xff66ae } );
	raycaster.setFromCamera( pointer, camera );
	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );
	// if(intersects.length>0){console.log(intersects)};
	
	clickedHandle = null;
	for ( let i = 0; i < intersects.length; i ++ ) {

		if(intersects[i].object.name=="movePlane"){
			newCurveHandlePoint=intersects[i].point;
		}

		if(intersects[i].object.name.includes("sphereHandle")){
			clickedHandle = intersects[i].object;
		intersects[ i ].object.material = new THREE.MeshBasicMaterial( { color: 0xff66ae } )

		break;
	}
	
	if(isTransforming&&selectedHandle){selectedHandle.position.z=newCurveHandlePoint.z}
}

		requestAnimationFrame( animate );
		renderer.render( scene, camera );

	}

function addGuidePlane(position){
	oldGuidePlane = newGuidePlane;

	const geometry = new THREE.PlaneGeometry( 600, 300 );
	const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide, opacity:0, transparent:true} );
	const plane = new THREE.Mesh( geometry, material );
	plane.name = "movePlane"
	plane.rotateY(Math.PI/2)
	plane.position.set(position.x,position.y,0*position.z)
	newGuidePlane = plane
	scene.add( plane );

	if(oldGuidePlane){
		scene.remove(oldGuidePlane);
		oldGuidePlane.geometry.dispose();
		oldGuidePlane.material.dispose();
		oldGuidePlane= undefined;
	}
	// console.log(position)
}

function updateGuideCurve(curvePoints){
	//setup guide curve
	let cp2 = [];
	for (let i = 0; i < handlesArray.length/4; i++){
		cp2.push(handlesArray[4*i].position)
	}
	guideCurve = new THREE.CatmullRomCurve3( cp2 );
	guideCurve.closed = true;

	ringNewPoints = guideCurve.getPoints( DefaultConstants.ringSegments );
	const geometry = new THREE.BufferGeometry().setFromPoints( ringNewPoints );

	const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );

	// Create the final object to add to the scene
	scene.remove(curveObject);
	curveObject.material.dispose();
	curveObject.geometry.dispose();
	curveObject = new THREE.Line( geometry, material );
	// curveObject.material.transparent = true;
	// curveObject.material.opacity = 0;
	scene.add(curveObject);

	updateRing(ringNewPoints)
						
}

function updateRing(inPoints){
	oldRing = newRing;
	newRing = RingBufferGeo.make(inPoints)
	scene.add(newRing);
	if(oldRing){
		scene.remove(oldRing);
		oldRing.geometry.dispose();
		oldRing.material.dispose();
		oldRing = null;
	}
}

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	if(mouseIsDown){
		isDragging=true;
		if(selectedHandle&&newCurveHandlePoint&&startedOnPoint){
			isTransforming = true;
			updateGuideCurve(8);
			// updateRing(ringNewPoints)
			// controls.enabled = false;
		}else{
			isTransforming = false;
			controls.enabled =true;
		}
	}

	if(isOnPoint){
		controls.enabled = false;
	}else {
		//controls.enabled = true;
	}
	

}




function onPointerDown( event ){
	// console.log("mousedown");
	mouseIsDown = true;
	if(clickedHandle){
		isOnPoint = true;
		startedOnPoint = true;
		controls.enabled=false;
		selectedHandle=clickedHandle;
		addGuidePlane(selectedHandle.position);
	}
	

}

function onPointerUp( event ){
	// console.log("mouseup");
	if(!isDragging){
		// console.log(clickedHandle);
		selectedHandle = clickedHandle;
		// clickedHandle.material = new THREE.MeshBasicMaterial( { color: 0xff66ae } );
	}
	mouseIsDown=false;
	isDragging = false;
	isOnPoint = false;
	isTransforming = false;
	startedOnPoint = false;
	controls.enabled = true;
}
			init();
			animate();

window.addEventListener( 'pointermove', onPointerMove );
window.addEventListener( 'pointerdown', onPointerDown );
window.addEventListener( 'pointerup', onPointerUp);

