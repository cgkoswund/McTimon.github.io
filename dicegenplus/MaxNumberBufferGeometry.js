import * as THREE from "../ThreeJSr138/build/three.module.js";
import { MeshXTriOps } from "./MeshXTriOps.js";
import * as BufferGeometryUtils from "../ThreeJSr138/examples/jsm/utils/BufferGeometryUtils.js";

const uv = [0, 0];
const norm = [0, 1, 0];

//adjust to perma overall width instead of unit square

let MaxNumberBufferGeometry = {
  make: function (imageRes, yPoints) {
    // console.log(image);
    let overallWidth = 256 * 10;
    let unitSquareWidth = imageRes[0] / 256;
    let tessRez = imageRes;

    let vertAOps, vertBOps, vertCOps, vertDOps;
    let normalAOps, normalBOps, normalCOps, normalDOps;
    let uvAOps, uvBOps, uvCOps, uvDOps;

    let cubeVerts = [];

    let innerMakePokedQuad = function () {
      cubeVerts.push(
        ...MeshXTriOps.makePokedFace(
          vertAOps,
          vertBOps,
          vertCOps,
          vertDOps,
          normalAOps,
          normalBOps,
          normalCOps,
          normalDOps,
          uvAOps,
          uvBOps,
          uvCOps,
          uvDOps
        )
      );
      //correct but commented to make flat plane for now
      // cubeVerts.push(...MeshOps.makePokedFace(
      //     vertAOps, vertBOps, vertCOps, vertDOps,
      //     normalAOps, normalBOps, normalCOps, normalDOps,
      //     uvAOps, uvBOps, uvCOps, uvDOps
      // ));
    };
    let x23 = unitSquareWidth;
    let z23 = unitSquareWidth;

    normalBOps = normalBOps = normalCOps = normalDOps = norm;
    uvAOps = uvBOps = uvCOps = uvDOps = uv;

    for (let i = 0; i < tessRez[0] - 1; i++) {
      for (let j = 0; j < tessRez[1] - 1; j++) {
        //-tessRess/2 to center it. from uWidth*i - uWidth*iMax/2
        let yA = (i + 0 + j * tessRez[0]) * 4;
        let yB = (i + 1 + j * tessRez[0]) * 4;
        let yC = (i + 1 + (j + 1) * tessRez[0]) * 4;
        let yD = (i + 0 + (j + 1) * tessRez[0]) * 4;
        vertAOps = [
          unitSquareWidth * (i - tessRez[0] / 2),
          (255 - yPoints[yA]) / 2,
          unitSquareWidth * (j - tessRez[1] / 2),
        ];
        vertBOps = [
          unitSquareWidth * (i + 1 - tessRez[0] / 2),
          (255 - yPoints[yB]) / 2,
          unitSquareWidth * (j - tessRez[1] / 2),
        ];
        vertCOps = [
          unitSquareWidth * (i + 1 - tessRez[0] / 2),
          (255 - yPoints[yC]) / 2,
          unitSquareWidth * (j + 1 - tessRez[1] / 2),
        ];
        vertDOps = [
          unitSquareWidth * (i - tessRez[0] / 2),
          (255 - yPoints[yD]) / 2,
          unitSquareWidth * (j + 1 - tessRez[1] / 2),
        ];
        innerMakePokedQuad();
      }
    }

    const positions = [];
    const normals = [];
    const uvs = [];

    // for(const vertex of cubeVertices){
    //     positions.push(...vertex.pos);
    //     normals.push(...vertex.norm);
    //     uvs.push(...vertex.uv);
    // }

    for (const vertex of cubeVerts) {
      positions.push(...vertex.pos);
      // normals.push(...vertex.norm);
      uvs.push(...vertex.uv);
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
    // cubeGeometry.setAttribute(
    //     'normal',
    //     new THREE.BufferAttribute(new Float32Array(normals),normalNumComponents
    // ));
    // cubeGeometry.setAttribute(
    //     'uv',
    //     new THREE.BufferAttribute(new Float32Array(uvs),uvNumComponents
    // ));
    cubeGeometry.deleteAttribute("uv");
    cubeGeometry.deleteAttribute("normal");

    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      "https://threejsfundamentals.org/threejs/resources/images/star.png"
    );

    const material_z = new THREE.MeshPhongMaterial({
      color: 0xcccc00,
      map: texture,
    });
    const material = new THREE.MeshStandardMaterial({
      color: 0xfefefe,
      roughness: 0.6,
    });

    // const ringClone = new THREE.Geometry()//.fromBufferGeometry(cubeGeometry);

    // ringClone.mergeVertices();

    // after only mergeVertices my textrues were turning black so this fixed normals issues
    // ringClone.computeVertexNormals();
    // ringClone.computeFaceNormals();

    // child.geometry = new BufferGeometry().fromGeometry(ringClone);
    //cubeGeometry.computeVertexNormals(true);
    let ringGeoClone =
      /*BufferGeometryUtils.mergeVertices(*/ cubeGeometry; /*,0.1)*/
    // let ringClone =
    // ringGeoClone.mergeVertices();
    ringGeoClone.computeVertexNormals(true);
    // cubeGeometry.computeFaceNormals(true);

    const cubez = new THREE.Mesh(ringGeoClone, material);
    // cubez.material.flatShading = false;
    // console.log(cubez.material)
    // console.log(cubez)
    // scene.add(cubez);

    return cubez;
  },

  // make: function(){
  //     console.log("this is from ring buffer MAAAKE")
  //     return "tested";
  // }
};
//Todo some extra commits today
//done
//tomorrow we rise

export { MaxNumberBufferGeometry };
