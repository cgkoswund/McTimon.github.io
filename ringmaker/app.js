import * as THREE from "../ThreeJSr138/build/three.module.js"
import { OrbitControls } from '../ThreeJSr138/examples/jsm/controls/OrbitControls.js';
import {RingBufferGeo} from "./RingBufferGeo.js"
import {DefaultConstants} from "./DefaultConstants.js"

			let camera, scene, renderer, controls;
			let handlesArray = [];
			let mesh;



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
				let controlSphereOffsetZ = DefaultConstants.ringWidth-2
				let controlSphereOffsetR = DefaultConstants.ringThickness-2
				scene.add(RingBufferGeo.make());

				{//setup control spheres
					let sphereGeo = new THREE.SphereGeometry(ringRadius/40);
					let sphereMat = new THREE.MeshStandardMaterial({color:0x3766ae});
					let sphereMatSelected = new THREE.MeshStandardMaterial({color:0x3766ae});
					for(let i = 0; i<8;i++){
						let sphereMesh = new THREE.Mesh(sphereGeo,sphereMat)
						let theta = Math.PI*2/8;
						sphereMesh.name = "sphereHandle"//+ //(i*4+1)
						scene.add(sphereMesh)
						handlesArray.push(sphereMesh)
						sphereMesh.position.set((ringRadius+controlSphereOffsetR)*Math.cos(theta*i),(ringRadius+controlSphereOffsetR)*Math.sin(theta*i),controlSphereOffsetZ);
						
						sphereMesh = new THREE.Mesh(sphereGeo,sphereMat)
						sphereMesh.name = "sphereHandle"
						scene.add(sphereMesh)
						handlesArray.push(sphereMesh)
						sphereMesh.position.set((ringRadius+controlSphereOffsetR)*Math.cos(theta*i),(ringRadius+controlSphereOffsetR)*Math.sin(theta*i),-controlSphereOffsetZ);
						
						sphereMesh = new THREE.Mesh(sphereGeo,sphereMat)
						sphereMesh.name = "sphereHandle"
						scene.add(sphereMesh)
						handlesArray.push(sphereMesh)
						sphereMesh.position.set((ringRadius-controlSphereOffsetR)*Math.cos(theta*i),(ringRadius-controlSphereOffsetR)*Math.sin(theta*i),controlSphereOffsetZ);
						
						sphereMesh = new THREE.Mesh(sphereGeo,sphereMat)
						sphereMesh.name = "sphereHandle"
						scene.add(sphereMesh)
						handlesArray.push(sphereMesh)
						sphereMesh.position.set((ringRadius-controlSphereOffsetR)*Math.cos(theta*i),(ringRadius-controlSphereOffsetR)*Math.sin(theta*i),-controlSphereOffsetZ);
					}
				}


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

	
	for(let i = 0; i<handlesArray.length;i++){
		handlesArray[i].material.color = sphereMat.color;
	}
	raycaster.setFromCamera( pointer, camera );
	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );
	// if(intersects.length>0){console.log(intersects)};
	for ( let i = 0; i < intersects.length; i ++ ) {

		if(intersects[i].object.name=="sphereHandle"){
		intersects[ i ].object.material = new THREE.MeshBasicMaterial( { color: 0xff66ae } )};
		// intersects[ i ].object.material.color.set( 0xff0000 );

	}

		requestAnimationFrame( animate );
		renderer.render( scene, camera );

	}


function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}
			init();
			animate();

window.addEventListener( 'pointermove', onPointerMove );