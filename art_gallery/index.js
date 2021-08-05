			import * as THREE from './three.module.js';
			import { PointerLockControls } from './PointerLockControls.js';
			import { GLTFLoader } from './GLTFLoader.js';import { RGBELoader } from './RGBELoader.js';


			//limits: x--> (-135,135), z--> (-70,70);
			document.getElementById('blocker').style.visibility="hidden";

			let camera, scene, renderer, controls, rendererNew;

			const objects = [];

			let raycaster;

			let moveForward = false;
			let moveBackward = false;
			let moveLeft = false;
			let moveRight = false;
			let canJump = false;

			let prevTime = performance.now();
			const velocity = new THREE.Vector3();
			const direction = new THREE.Vector3();
			const vertex = new THREE.Vector3();
			const color = new THREE.Color();

			init();
			animate();

			function init() {

				camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.y = 10;

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xffffff );
				scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

				const light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
				light.position.set( 0.5, 1, 0.75 );
				scene.add( light );

				controls = new PointerLockControls( camera, document.body );

				const blocker = document.getElementById( 'blocker' );
				const instructions = document.getElementById( 'instructions' );

				instructions.addEventListener( 'click', function () {

					controls.lock();

				} );

				controls.addEventListener( 'lock', function () {

					instructions.style.display = 'none';
					blocker.style.display = 'none';

				} );



				controls.addEventListener( 'unlock', function () {

					blocker.style.display = 'block';
					instructions.style.display = '';

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

				raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

				// floor

				// let floorGeometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
				// floorGeometry.rotateX( - Math.PI / 2 );

				// vertex displacement

				// let position = floorGeometry.attributes.position;

				// for ( let i = 0, l = position.count; i < l; i ++ ) {

				// 	vertex.fromBufferAttribute( position, i );

				// 	vertex.x += Math.random() * 20 - 10;
				// 	vertex.y += Math.random() * 2;
				// 	vertex.z += Math.random() * 20 - 10;

				// 	position.setXYZ( i, vertex.x, vertex.y, vertex.z );

				// }

				// floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

				// position = floorGeometry.attributes.position;
				// const colorsFloor = [];

				// for ( let i = 0, l = position.count; i < l; i ++ ) {

				// 	color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
				// 	colorsFloor.push( color.r, color.g, color.b );

				// }

				// floorGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colorsFloor, 3 ) );

				// const floorMaterial = new THREE.MeshBasicMaterial( { vertexColors: true } );

				// const floor = new THREE.Mesh( floorGeometry, floorMaterial );
				// scene.add( floor );

				// objects

				// const boxGeometry = new THREE.BoxGeometry( 20, 20, 20 ).toNonIndexed();

				// position = boxGeometry.attributes.position;
				// const colorsBox = [];

				// for ( let i = 0, l = position.count; i < l; i ++ ) {

				// 	color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
				// 	colorsBox.push( color.r, color.g, color.b );

				// }

				// boxGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colorsBox, 3 ) );

				// for ( let i = 0; i < 500; i ++ ) {

					// const boxMaterial = new THREE.MeshPhongMaterial( { specular: 0xffffff, flatShading: true, vertexColors: true } );
					// boxMaterial.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

					// const box = new THREE.Mesh( boxGeometry, boxMaterial );
					// box.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
					// box.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
					// box.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;

					// scene.add( box );
					// objects.push( box );

				// }

				//

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


			const bearingLoader = new GLTFLoader().setPath( 'models/simple/' );
    bearingLoader.load( 'simple_gallery_room.gltf', function ( gltf ) {
/*
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
                        break; 

                }


            }

        } );*/

        // console.log(gltf.scene);
		gltf.scene.scale.set(10,10,10);
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

					raycaster.ray.origin.copy( controls.getObject().position );
					raycaster.ray.origin.y -= 10;

					const intersections = raycaster.intersectObjects( objects );

					const onObject = intersections.length > 0;

					const delta = ( time - prevTime ) / 1000;

					velocity.x -= velocity.x * 10.0 * delta;
					velocity.z -= velocity.z * 10.0 * delta;

					velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

					direction.z = Number( moveForward ) - Number( moveBackward );
					direction.x = Number( moveRight ) - Number( moveLeft );
					direction.normalize(); // this ensures consistent movements in all directions

					if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
					if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

					if ( onObject === true ) {

						velocity.y = Math.max( 0, velocity.y );
						canJump = true;

					}

					controls.moveRight( - velocity.x * delta );
					controls.moveForward( - velocity.z * delta );

					controls.getObject().position.y += ( velocity.y * delta ); // new behavior

					if ( controls.getObject().position.y < 10 ) {

						velocity.y = 0;
						controls.getObject().position.y = 10;

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
				// console.log("loading");
				document.getElementById('blocker').style.visibility="hidden";
				if (state == 'interactive') {
					// document.getElementById('load').style.visibility="visible";
					

				} else if (state == 'complete') {
					setTimeout(function(){
						document.getElementById('interactive');
						document.getElementById('load').style.visibility="hidden";
						document.getElementById('blocker').style.visibility="visible";
						renderer.domElement.style.visibility="visible";
						// console.log("loaded");
					},1000);
				}
}