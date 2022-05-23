import * as THREE from "../ThreeJSr138/build/three.module.js";
import { OrbitControls } from "../ThreeJSr138/examples/jsm/controls/OrbitControls.js";
import { ImprovedNoise } from "../ThreeJSr138/examples/jsm/math/ImprovedNoise.js";
import * as BufferGeometryUtils from "../ThreeJSr138/examples/jsm/utils/BufferGeometryUtils.js";
import { MaxNumberBufferGeometry } from "./MaxNumberBufferGeometry.js";

let camera, scene, renderer, controls;
let mesh, texture;

// const worldWidth = 256, worldDepth = 256,
const worldWidth = 1024,
  worldDepth = 1024,
  worldHalfWidth = worldWidth / 2,
  worldHalfDepth = worldDepth / 2;
let maxImageVerts = [];

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    8000
  );
  camera.position.set(0, 200, 600);
  camera.lookAt(0, 0, 0);

  scene = new THREE.Scene();

  const size = 900;
  const divisions = 50;

  const gridHelper = new THREE.GridHelper(size, divisions);
  scene.add(gridHelper);

  const colorAmb = 0xffffff;

  const intensityAmb = 0.3;
  const lightAmb = new THREE.AmbientLight(colorAmb, intensityAmb);
  lightAmb.position.set(300, 200, -100);
  scene.add(lightAmb);

  const color = 0xff9999;
  const intensity = 0.2;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(30, 0, -10);
  light.target.position.set(0, 0, 0);
  scene.add(light);

  const light2 = new THREE.DirectionalLight(color, intensity);
  light2.position.set(-30, 0, -10);
  light2.target.position.set(0, 0, 0);
  scene.add(light2);

  const light3 = new THREE.DirectionalLight(color, intensity);
  light3.position.set(-300, 200, 100);
  light3.target.position.set(0, 0, 0);
  scene.add(light3);

  const light4 = new THREE.DirectionalLight(color, intensity);
  light3.position.set(300, 0, 100);
  light3.target.position.set(0, 0, 0);
  scene.add(light4);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;

  controls.screenSpacePanning = false;

  function createHeightmap(image) {
    // extract the data from the image by drawing it to a canvas
    // and calling getImageData
    const ctx = document.createElement("canvas").getContext("2d");
    const { width, height } = image;
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.drawImage(image, 0, 0);
    const { data } = ctx.getImageData(0, 0, width, height);

    const geometry = new THREE.BufferGeometry();

    const cellsAcross = width - 1;
    const cellsDeep = height - 1;
    for (let z = 0; z < cellsDeep; ++z) {
      for (let x = 0; x < cellsAcross; ++x) {
        // compute row offsets into the height data
        // we multiply by 4 because the data is R,G,B,A but we
        // only care about R
        const base0 = (z * width + x) * 4;
        const base1 = base0 + width * 4;

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
        maxImageVerts.push(
          new THREE.Vector3(x0, h00, z0),
          new THREE.Vector3(x1, h01, z0),
          new THREE.Vector3(x0, h10, z1),
          new THREE.Vector3(x1, h11, z1),
          new THREE.Vector3((x0 + x1) / 2, hm, (z0 + z1) / 2)
        );
      }
    }

    // geometry.computeFaceNormals();

    // center the geometry
    geometry.translate(width / -2, 0, height / -2);

    const material = new THREE.MeshPhongMaterial({
      color: "green" /*, map: texture*/,
    });

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

    for (const vertex of maxImageVerts) {
      positions.push(...vertex);
      // normals.push(...vertex.norm);
      // uvs.push(...vertex.uv);
    }

    const cubeGeometry = new THREE.BufferGeometry();
    const positionNumComponents = 3;
    const normalNumComponents = 3;
    const uvNumComponents = 2;
    cubeGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array(positions),
        positionNumComponents
      )
    );

    cubeGeometry.deleteAttribute("uv");
    cubeGeometry.deleteAttribute("normal");

    let ringGeoClone = BufferGeometryUtils.mergeVertices(cubeGeometry, 0.1);

    ringGeoClone.computeVertexNormals(true);

    const cubez = new THREE.Mesh(ringGeoClone, material);
    cubez.material.flatShading = false;
  }

  const data = generateHeight(worldWidth, worldDepth);

  window.addEventListener("resize", onWindowResize);
}
function cb(imgLoaded) {
  //use image here
}
function generateHeight(width, height) {
  let hasLoaded = false;
  let canvasAlt = document.createElement("canvas"),
    ctx = canvasAlt.getContext("2d"),
    imageAlt = new Image();
  let dataM;
  imageAlt.onload = function (img) {
    canvasAlt.width = this.width;
    canvasAlt.height = this.height;
    ctx.drawImage(this, 0, 0, this.width, this.height);
    dataM = new Uint8ClampedArray(
      ctx.getImageData(0, 0, this.height, this.width).data.length
    );
    dataM = ctx.getImageData(0, 0, this.height, this.width).data;
    cb(ctx.getImageData(0, 0, this.height, this.width).data);

    const geometry = new THREE.PlaneGeometry(
      750,
      750,
      this.width - 1,
      this.height - 1
    );
    geometry.rotateX(-Math.PI / 2);

    const planeGeo = MaxNumberBufferGeometry.make(
      [canvasAlt.width, canvasAlt.height],
      dataM
    );
    scene.add(planeGeo);

    hasLoaded = true;

    return dataM;
  };
  imageAlt.src = "./textures/happy dino.jpg";
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}
