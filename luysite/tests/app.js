import * as THREE from "../../ThreeJSr138/build/three.module.js";
// import { OrbitControls } from "../../ThreeJSr138/examples/jsm";
import { GLTFLoader } from "../../ThreeJSr138/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "../../ThreeJSr138/examples/jsm/loaders/RGBELoader.js";

// const section = document.querySelector("section");
const rootElem = document.querySelector("#three");

let camera, scene, renderer;
let mesh;
let xLoc = 0,
  yLoc = 0;
let modelLuy;

init();
render();

function init() {
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 450;
  camera.position.y = -90;
  //   camera.rotation.set(0.7, 0, 0);
  camera.lookAt(0, 250, 0);

  scene = new THREE.Scene();

  //   const texture = new THREE.TextureLoader().load("textures/crate.gif");
  const light1 = new THREE.PointLight(0xfff, 10);
  scene.add(light1);
  light1.translateX(300);

  const light2 = new THREE.PointLight(0xfff, 10);
  scene.add(light2);
  light1.translateX(-300);

  const light3 = new THREE.PointLight(0xfff, 10);
  scene.add(light3);
  light3.translateZ(300);
  light3.translateY(300);

  const light4 = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(light4);

  const geometry = new THREE.BoxGeometry(200, 200, 200);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

  mesh = new THREE.Mesh(geometry, material);
  //   scene.add(mesh);

  new RGBELoader()
    .setPath("textures/equirectangular/")
    .load("kloppenheim_06_1k.hdr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;

      scene.background = texture;
      scene.environment = texture;

      render();

      // model

      const loader = new GLTFLoader().setPath("models/");
      loader.load("luy_assets.gltf", function (gltf) {
        modelLuy = gltf.scene;
        modelLuy.scale.set(12, 12, 12);
        const shinyMat = new THREE.MeshStandardMaterial({
          color: 0x997711,
          roughness: 0.1,
          metalness: 0.9,
        });
        gltf.scene.traverse(function (child) {
          if (child.isMesh) {
            child.material = shinyMat;
          }
        });
        modelLuy.translateY(300);
        scene.add(modelLuy);

        render();
      });
    });

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;

  rootElem.appendChild(renderer.domElement);

  //

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
  requestAnimationFrame(render); //for animation behaviour

  if (modelLuy != undefined) {
    const xRot = (0.05 * (yLoc - window.innerHeight / 2) * Math.PI) / 180;
    const yRot = (0.05 * (xLoc - window.innerWidth / 2) * Math.PI) / 180;
    camera.position.set(
      (xLoc - window.innerWidth / 2) / 10,
      (yLoc - window.innerHeight / 2) / 10,
      450
    );
    // console.log(camera.position.x);
    camera.lookAt(0, 350, 0);

    modelLuy.rotation.set(xRot, yRot, 0, "XYZ");
    // scene.rotateY(0.01);
    // modelLuy.rotation.set();
    // console.log(modelLuy.rotation.set);
  }

  renderer.render(scene, camera);
}

let offset = 0;

const handleScroll = (e) => {
  const diag = Math.round(
    Math.sqrt(window.innerHeight ** 2 + 0.25 * window.innerWidth ** 2)
  );
  offset += e.deltaY; // / 5;
  let value = 300 + offset / 5;
  if (value <= 300) {
    offset = 0;
    value = 300;
  }
  if (value >= diag) {
    offset = Math.round(5 * (diag - 300));
    value = diag;
  }
  //   console.log(value);
  rootElem.style.clipPath = `circle(${value}px at bottom)`;
};

const handleMove = (e) => {
  xLoc = e.clientX;
  yLoc = e.clientY;
};
window.addEventListener("wheel", handleScroll);
window.addEventListener("pointermove", handleMove);
