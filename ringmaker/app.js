import * as THREE from "../build/three.module.js"
import { OrbitControls } from '../examples/jsm/controls/OrbitControls.js';

			let camera, scene, renderer, controls;
			let mesh;

			init();
			animate();

			function init() {

				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.z = 400;

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xffffff );


				// const texture = new THREE.TextureLoader().load( 'textures/crate.gif' );


				const geometry = new THREE.TorusGeometry( 100, 15, 16, 100 );
				const material = new THREE.MeshStandardMaterial( { color: 0xfefefe, roughness:0.07 } );
				const torus = new THREE.Mesh( geometry, material );
				scene.add( torus );



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

				mesh = new THREE.Mesh( geometry, material );
				scene.add( mesh );

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth*0.98, window.innerHeight*0.96 );
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

				renderer.setSize( window.innerWidth*0.98, window.innerHeight*0.96 );

			}

			function animate() {

				requestAnimationFrame( animate );

				// mesh.rotation.x += 0.005;
				// mesh.rotation.y += 0.01;

				renderer.render( scene, camera );

			}