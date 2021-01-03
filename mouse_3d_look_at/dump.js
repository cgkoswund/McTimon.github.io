
			




			function init() {

				
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );

				container.appendChild( renderer.domElement );

				renderer.toneMapping = THREE.ACESFilmicToneMapping;
				renderer.outputEncoding = THREE.sRGBEncoding;

				stats = new Stats();
				container.appendChild( stats.dom );

			}


			function render() {

				

				if ( newEnvMap !== torusMesh.material.envMap ) {

					torusMesh.material.envMap = newEnvMap;
					torusMesh.material.needsUpdate = true;

					planeMesh.material.map = newEnvMap;
					planeMesh.material.needsUpdate = true;

				}

				scene.background = background;
				renderer.toneMappingExposure = params.exposure;

				renderer.render( scene, camera );

			}