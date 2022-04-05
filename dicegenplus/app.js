import * as THREE from "../ThreeJSr138/build/three.module.js"
import {OrbitControls} from "../ThreeJSr138/examples/jsm/controls/OrbitControls.js"
import { ImprovedNoise } from '../ThreeJSr138/examples/jsm/math/ImprovedNoise.js';
import * as BufferGeometryUtils from "../ThreeJSr138/examples/jsm/utils/BufferGeometryUtils.js"
import {MaxNumberBufferGeometry} from "./MaxNumberBufferGeometry.js"

let camera, scene, renderer, controls;
let mesh, texture;

// const worldWidth = 256, worldDepth = 256,
const worldWidth = 1024, worldDepth = 1024,
worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;
let maxImageVerts = [];

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 8000 );
    camera.position.set(0,200,600) ;
    camera.lookAt(0,0,0)

    scene = new THREE.Scene();
    
    const size = 900;
    const divisions = 50;


    const gridHelper = new THREE.GridHelper( size, divisions );
    scene.add( gridHelper );

    const colorAmb = 0xFFFFFF;

    const intensityAmb = 0.3;
    const lightAmb = new THREE.AmbientLight(colorAmb, intensityAmb);
    lightAmb.position.set(300, 200,-100);
    scene.add(lightAmb);

    const color = 0xFF9999;
    const intensity = 0.2;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(30, 0,-10);
    light.target.position.set(0,0,0);
    scene.add(light);



    const light2 = new THREE.DirectionalLight(color, intensity);
    light2.position.set(-30, 0,-10);
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

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    // controls.minDistance = 100;
    // controls.maxDistance = 500;

    // controls.maxPolarAngle = Math.PI / 2;
    
    //image load for data
    // const imgLoader = new THREE.ImageLoader();
    // imgLoader.load('./textures/arduino height map copy.jpg', createHeightmap);


  function createHeightmap(image) {
    // extract the data from the image by drawing it to a canvas
    // and calling getImageData
    const ctx = document.createElement('canvas').getContext('2d');
    const {width, height} = image;
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.drawImage(image, 0, 0);
    const {data} = ctx.getImageData(0, 0, width, height);

    const geometry = new THREE.BufferGeometry();
    // const geometry = new THREE.PlaneGeometry( 750, 750, worldWidth - 1, worldDepth - 1 );

    const cellsAcross = width - 1;
    const cellsDeep = height - 1;
    for (let z = 0; z < cellsDeep; ++z) {
      for (let x = 0; x < cellsAcross; ++x) {
        // compute row offsets into the height data
        // we multiply by 4 because the data is R,G,B,A but we
        // only care about R
        const base0 = (z * width + x) * 4;
        const base1 = base0 + (width * 4);

        // look up the height for the for points
        // around this cell
        const h00 = data[base0] / 32;
        const h01 = data[base0 + 4] / 32;
        const h10 = data[base1] / 32;
        const h11 = data[base1 + 4] / 32;
        // compute the average height
        const hm = (h00 + h01 + h10 + h11) / 4;


        // the corner positions
        const x0 = x;
        const x1 = x + 1;
        const z0 = z;
        const z1 = z + 1;

        // remember the first index of these 5 vertices
        // const verticesData = geometry.attributes.position.array;
        // const ndx = geometry.vertices.length;

        // add the 4 corners for this cell and the midpoint
        maxImageVerts.push (new THREE.Vector3(x0, h00, z0),
        new THREE.Vector3(x1, h01, z0),
        new THREE.Vector3(x0, h10, z1),
        new THREE.Vector3(x1, h11, z1),
        new THREE.Vector3((x0 + x1) / 2, hm, (z0 + z1) / 2),);

        // verticesData.push(
        //   new THREE.Vector3(x0, h00, z0),
        //   new THREE.Vector3(x1, h01, z0),
        //   new THREE.Vector3(x0, h10, z1),
        //   new THREE.Vector3(x1, h11, z1),
        //   new THREE.Vector3((x0 + x1) / 2, hm, (z0 + z1) / 2),
        // );

        //      2----3
        //      |\  /|
        //      | \/4|
        //      | /\ |
        //      |/  \|
        //      0----1

        // create 4 triangles
        // geometry.faces.push(
        //   new THREE.Face3(ndx    , ndx + 4, ndx + 1),
        //   new THREE.Face3(ndx + 1, ndx + 4, ndx + 3),
        //   new THREE.Face3(ndx + 3, ndx + 4, ndx + 2),
        //   new THREE.Face3(ndx + 2, ndx + 4, ndx + 0),
        // );

        // add the texture coordinates for each vertex of each face.
        // const u0 = x / cellsAcross;
        // const v0 = z / cellsAcross;
        // const u1 = (x + 1) / cellsDeep;
        // const v1 = (z + 1) / cellsDeep;
        // const um = (u0 + u1) / 2;
        // const vm = (v0 + v1) / 2;
        // geometry.faceVertexUvs[0].push(
        //   [ new THREE.Vector2(u0, v0), new THREE.Vector2(um, vm), new THREE.Vector2(u1, v0) ],
        //   [ new THREE.Vector2(u1, v0), new THREE.Vector2(um, vm), new THREE.Vector2(u1, v1) ],
        //   [ new THREE.Vector2(u1, v1), new THREE.Vector2(um, vm), new THREE.Vector2(u0, v1) ],
        //   [ new THREE.Vector2(u0, v1), new THREE.Vector2(um, vm), new THREE.Vector2(u0, v0) ],
        // );
      }
    }

    // geometry.computeFaceNormals();

    // center the geometry
    geometry.translate(width / -2, 0, height / -2);

    const loader = new THREE.TextureLoader();
    // const texture = loader.load('https://r105.threejsfundamentals.org/threejs/resources/images/star.png');

    const material = new THREE.MeshPhongMaterial({color: 'green'/*, map: texture*/});

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const positions = [];
        const normals = [];
        const uvs = [];
        
        // for(const vertex of cubeVertices){
        //     positions.push(...vertex.pos);
        //     normals.push(...vertex.norm);
        //     uvs.push(...vertex.uv);
        // }
        
        for(const vertex of maxImageVerts){
            positions.push(...vertex);
            // normals.push(...vertex.norm);
            // uvs.push(...vertex.uv);
        }
        
        const cubeGeometry = new THREE.BufferGeometry();
        const positionNumComponents = 3;
        const normalNumComponents = 3;
        const uvNumComponents = 2;
        cubeGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(positions),positionNumComponents
        ));
        // cubeGeometry.setAttribute(
        //     'normal',
        //     new THREE.BufferAttribute(new Float32Array(normals),normalNumComponents
        // ));
        // cubeGeometry.setAttribute(
        //     'uv',
        //     new THREE.BufferAttribute(new Float32Array(uvs),uvNumComponents
        // ));
        cubeGeometry.deleteAttribute('uv');
        cubeGeometry.deleteAttribute('normal');
        
        
        // const loader = new THREE.TextureLoader();
        //   const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/star.png');
        
        const material_z = new THREE.MeshPhongMaterial({color: 0xcccc00, map:texture});
        // const material = new THREE.MeshStandardMaterial( { color: 0xfefefe, roughness:0.6 } );

        // const ringClone = new THREE.Geometry()//.fromBufferGeometry(cubeGeometry);

        // ringClone.mergeVertices();
        
        // after only mergeVertices my textrues were turning black so this fixed normals issues
        // ringClone.computeVertexNormals();
        // ringClone.computeFaceNormals();
        
        // child.geometry = new BufferGeometry().fromGeometry(ringClone);
        //cubeGeometry.computeVertexNormals(true);
        let ringGeoClone = BufferGeometryUtils.mergeVertices(cubeGeometry,0.1)
        // let ringClone = 
        // ringGeoClone.mergeVertices();
        ringGeoClone.computeVertexNormals(true);
        // cubeGeometry.computeFaceNormals(true);

            const cubez = new THREE.Mesh(ringGeoClone, material);        
            cubez.material.flatShading = false;
            // console.log(cubez.material)
            // console.log(cubez)
            // scene.add(cubez);
            // console.log(cubez);
  }



    //
    const data = generateHeight( worldWidth, worldDepth );

    // const planeGeo = MaxNumberBufferGeometry.make("Lets gooo");
    // scene.add(planeGeo);

    // const geometry = new THREE.PlaneGeometry( 750, 750, worldWidth - 1, worldDepth - 1 );
    // geometry.rotateX( - Math.PI / 2 );

    // const vertices = geometry.attributes.position.array;

    // for ( let i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {

    //     vertices[ j + 1 ] = data[ i ] * 10;

    // }

    //

    //texture = new THREE.CanvasTexture( generateTexture( data, worldWidth, worldDepth ) );
    //texture.wrapS = THREE.ClampToEdgeWrapping;
    //texture.wrapT = THREE.ClampToEdgeWrapping;

    // mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial(  ) );
    // mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture } ) );
    // scene.add( mesh );

    window.addEventListener( 'resize', onWindowResize );

}
function cb(imgLoaded){
    //use image here
}
function generateHeight( width, height ) {
    // let dataM;
    // const imgLoader = new THREE.ImageLoader();
    // imgLoader.load('./textures/arduino height map copy.jpg', createNewHeightmap);
    let hasLoaded = false;
    let canvasAlt = document.createElement('canvas'),
      ctx = canvasAlt.getContext('2d'),
      imageAlt = new Image();
    //   image.crossOrigin = 'Anonymous';
    let dataM;
  imageAlt.onload = function(img) {
    canvasAlt.width = this.width;
    canvasAlt.height = this.height;
    // console.log("canvasAlt.width:");
    // console.log(canvasAlt.width);
    // console.log("canvasAlt.height:");
    // console.log(canvasAlt.height);
    ctx.drawImage(this, 0, 0, this.width, this.height);
    dataM = new Uint8ClampedArray(ctx.getImageData(0,0, this.height, this.width).data.length)
    dataM = ctx.getImageData(0,0, this.height, this.width).data;
    cb(ctx.getImageData(0,0, this.height, this.width).data);
    // console.log("dataM: ")
    // console.log(dataM);
    const geometry = new THREE.PlaneGeometry( 750, 750, this.width - 1, this.height - 1 );
    geometry.rotateX( - Math.PI / 2 );

    const vertices = geometry.attributes.position.array;
    function addNewCube(x,y,z){
        let geometryC = new THREE.BoxGeometry(2,2,2);
        let color = 0xccffcc;
            if(!hasLoaded){
                if(y>2){color = 0x2222ff;}
            let materialC = new THREE.MeshStandardMaterial({color});
            let meshC = new THREE.Mesh(geometryC,materialC);
            meshC.position.set(x,y,z);
            // console.log("x: "+x);
            // console.log("z: "+z);
            scene.add(meshC);
        }

    }

    const planeGeo = MaxNumberBufferGeometry.make([canvasAlt.width,canvasAlt.height],dataM);
    scene.add(planeGeo);

    // for ( let i = 0 ; i < (canvasAlt.width*canvasAlt.height); i ++ ) {//cubes array
    //     addNewCube((i%canvasAlt.width)*2,(255-dataM[i*4]) / 20,Math.floor((i/canvasAlt.height))*2);
    //     // vertices[ j + 1 ] = (255-dataM[ i ]) / 20;
    // }
    // for ( let i = 0, j = 0; i < vertices.length; i ++, j += 3 ) {//plane buffer array
    //     // addNewCube((i%canvasAlt.width)*2,(255-dataM[ i ]) / 20,Math.floor((i/canvasAlt.height))*2);
    //     vertices[ j + 1 ] = (255-dataM[ i ]) / 20;}
        hasLoaded = true;
        // console.log(dataM.length)
        // mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial( {color:0xffcccc} ) );
        // mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture } ) );
        // scene.add( mesh );
    return dataM;
    
      }
  imageAlt.src = './textures/happy dino.jpg';
//   imageAlt.src = './textures/ardSmall2.jpg';

    // function createNewHeightmap(image){
    // console.log(image);
    //new data from heightmap images
    // const ctx = document.createElement('canvas').getContext('2d');
    // const {width, height} = image;
    // console.log(width);
    // console.log(height);
    // console.log(ctx)
    // ctx.canvas.width = width;
    // ctx.canvas.height = height;
    // ctx.drawImage(image, 0, 0);
    // console.log(ctx)
    // const {data} = ctx.getImageData(0, 0, width, height);
    // dataM = data;}
    //end of heightmap data

    
    // const size = width * height, dataH = new Uint8Array( size ),
        // perlin = new ImprovedNoise(), z = Math.random() * 100;

    // let quality = 1;

    // for ( let j = 0; j < 4; j ++ ) {

        // for ( let i = 0; i < size; i ++ ) {

            // const x = i % width, y = ~ ~ ( i / width );
            // dataH[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 )*0.1;
            // data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );

        // }

        // quality *= 5;

    // }

    // console.log(dataM);
    // return dataM;

}

function generateTexture( data, width, height ) {

    // bake lighting into texture

    let context, image, imageData, shade;

    const vector3 = new THREE.Vector3( 0, 0, 0 );

    const sun = new THREE.Vector3( 1, 1, 1 );
    sun.normalize();

    const canvas = document.createElement( 'canvas' );
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext( '2d' );
    context.fillStyle = '#000';
    context.fillRect( 0, 0, width, height );

    image = context.getImageData( 0, 0, canvas.width, canvas.height );
    imageData = image.data;

    for ( let i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {

        vector3.x = data[ j - 2 ] - data[ j + 2 ];
        vector3.y = 2;
        vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
        vector3.normalize();

        shade = vector3.dot( sun );

        imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
        imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
        imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );

    }

    context.putImageData( image, 0, 0 );

    // Scaled 4x

    const canvasScaled = document.createElement( 'canvas' );
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;

    context = canvasScaled.getContext( '2d' );
    context.scale( 4, 4 );
    context.drawImage( canvas, 0, 0 );

    image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
    imageData = image.data;

    for ( let i = 0, l = imageData.length; i < l; i += 4 ) {

        const v = ~ ~ ( Math.random() * 5 );

        imageData[ i ] += v;
        imageData[ i + 1 ] += v;
        imageData[ i + 2 ] += v;

    }

    context.putImageData( image, 0, 0 );

    return canvasScaled;

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    // mesh.rotation.x += 0.005;
    // mesh.rotation.y += 0.01;

    renderer.render( scene, camera );

}
