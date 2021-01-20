        import * as THREE from './three.module.js';

        import { OrbitControls } from './OrbitControls.js';
        import { GLTFLoader } from './GLTFLoader.js';
        import { RGBELoader } from './RGBELoader.js';
        import { RoughnessMipmapper } from './RoughnessMipmapper.js';

        let camera, scene, renderer;

        init();
        render();

        function init() {

            const container = document.createElement( 'div' );
            document.body.appendChild( container );

            camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
            camera.position.set( - 1.8, 0.6, 2.7 );

            scene = new THREE.Scene();

            new RGBELoader()
                .setDataType( THREE.UnsignedByteType )
                .setPath( 'textures/equirectangular/' )
                .load( 'royal_esplanade_1k.hdr', function ( texture ) {

                    const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
                    scene.environment = envMap;

                    texture.dispose();
                    pmremGenerator.dispose();

                    render();

                    // model

                    // use of RoughnessMipmapper is optional
                    const roughnessMipmapper = new RoughnessMipmapper( renderer );

                    const loader = new GLTFLoader().setPath( 'free_sci_fi_helmet/' );
                    loader.load( 'scene.gltf', function ( gltf ) {

                        gltf.scene.traverse( function ( child ) {

                            if ( child.isMesh ) {

                                // TOFIX RoughnessMipmapper seems to be broken with WebGL 2.0
                                // roughnessMipmapper.generateMipmaps( child.material );

                            }

                        } );
                        gltf.scene.scale.set(5,5,5);
                        scene.add( gltf.scene );

                        roughnessMipmapper.dispose();

                        render();

                    } );

                } );

            renderer = new THREE.WebGLRenderer( { antialias: true } );
            renderer.setClearColor( 0xaaaaaa, 1 );
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( window.innerWidth, window.innerHeight );
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1;
            renderer.outputEncoding = THREE.sRGBEncoding;
            container.appendChild( renderer.domElement );

            {
                const color = 0xFFFFFF;
                const intensity = 1;
                const light = new THREE.PointLight(color, intensity);
                light.position.set(0,2,-2);
                scene.add(light);
            }

            {
                const color = 0xFFFFFF;
                const intensity = 2;
                const light = new THREE.PointLight(color, intensity);
                light.position.set(0,3,2);
                scene.add(light);
            }

            const pmremGenerator = new THREE.PMREMGenerator( renderer );
            pmremGenerator.compileEquirectangularShader();

            const controls = new OrbitControls( camera, renderer.domElement );
            controls.addEventListener( 'change', render ); // use if there is no animation loop
            controls.minDistance = 2;
            controls.maxDistance = 10;
            controls.target.set( 1, 0, - 0.2 );
            controls.update();

            window.addEventListener( 'resize', onWindowResize, false );

        }

        function onWindowResize() {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( window.innerWidth, window.innerHeight );

            render();

        }

        //

        function render() {

            renderer.render( scene, camera );

        }

    