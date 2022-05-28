import * as THREE from "../build/three.module.js";

import { MTLLoader } from "./jsm/loaders/MTLLoader.js";
import { OBJLoader } from "./jsm/loaders/OBJLoader.js";
import { OrbitControls } from "./jsm/controls/OrbitControls.js";

let camera, scene, renderer, controls;

let obj_upload_button = document.querySelector("#new_obj_btn");
let hidden_upload_button = document.querySelector("#file_btn");
let newModel, currentModel;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

init();
animate();
const centreObject = (loadedObj) => {
  loadedObj.position.set(0, 0, 0);
  const boundingBox = groupBoundingBox(loadedObj);
  loadedObj.position.set(
    -(boundingBox.max.x + boundingBox.min.x) / 2,
    -(boundingBox.max.y + boundingBox.min.y) / 2,
    -(boundingBox.max.z + boundingBox.min.z) / 2
  );

  camera.position.z =
    ((boundingBox.max.y - boundingBox.min.y) * 300) / (2 * 90);
  camera.position.x = 0;
  camera.position.y = 0;
  controls.update();
};
const groupBoundingBox = (group) => {
  const box = new THREE.Box3();
  if (group.children) {
    group.traverse((child) => {
      if (child.isMesh) {
        child.geometry.computeBoundingBox();
        box.min.x = Math.min(box.min.x, child.geometry.boundingBox.min.x);
        box.min.y = Math.min(box.min.y, child.geometry.boundingBox.min.y);
        box.min.z = Math.min(box.min.z, child.geometry.boundingBox.min.z);
        box.max.x = Math.max(box.max.x, child.geometry.boundingBox.max.x);
        box.max.y = Math.max(box.max.y, child.geometry.boundingBox.max.y);
        box.max.z = Math.max(box.max.z, child.geometry.boundingBox.max.z);
      }
    });
  }
  return box;
};

function init() {
  const container = document.createElement("div");
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.z = 300;

  // scene

  scene = new THREE.Scene();

  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.8);
  camera.add(pointLight);
  scene.add(camera);

  // model

  const onProgress = function (xhr) {
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log(Math.round(percentComplete, 2) + "% downloaded");
    }
  };

  new OBJLoader().setPath("/src/models/obj/male02/").load(
    "male02.obj",
    function (object) {
      object.position.y = -95;
      currentModel = object;
      scene.add(object);
    },
    onProgress
  );

  const loadObjNew = (objFile) => {
    if (currentModel) scene.remove(currentModel);

    const uploadedObj = new OBJLoader().parse(objFile);
    centreObject(uploadedObj);
    // uploadedObj.position.y = -95;
    scene.add(uploadedObj);
    currentModel = uploadedObj;
  };

  obj_upload_button.addEventListener("click", (e) => {
    hidden_upload_button.click();
  });

  hidden_upload_button.addEventListener("change", (e) => {
    const fileName = e.target.files[0].name;
    const raw = e.target.files[0];

    const extensionSet = fileName.split(".");
    const extension = extensionSet[extensionSet.length - 1];
    if (extension == "obj") {
      const reader = new FileReader();
      reader.readAsText(raw, "UTF-8");
      reader.onload = function (e) {
        const stringObj = e.target.result;
        newModel = stringObj;
        loadObjNew(newModel);
      };
    }
  });
  //

  renderer = new THREE.WebGLRenderer();
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xaaaaaa, 1);
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);

  controls.screenSpacePanning = false;
  controls.rotateSpeed = 0.2;

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  controls.update();

  renderer.render(scene, camera);
}
