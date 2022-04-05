import * as THREE from "../ThreeJSr138/build/three.module.js";
import { MeshOps } from "./MeshOps.js";
import * as BufferGeometryUtils from "../ThreeJSr138/examples/jsm/utils/BufferGeometryUtils.js";
import { DefaultConstants } from "./DefaultConstants.js";
let platformLoaderPoints, platformLoaderMaterial, platformLoaderRawPoints;

const shapify = function (points) {
  const shape = new THREE.Shape();
  let x, y;
  shape.moveTo(points[0].x, points[0].z);
  for (let i = 1; i < points.length; i++) {
    x = points[i].x;
    y = points[i].z;
    shape.lineTo(x, y); // points[i].z);
  }

  const extrudeSettings = {
    steps: 2, // ui: steps
    depth: 0.2, // ui: depth
    bevelEnabled: false, // ui: bevelEnabled
    bevelThickness: 1, // ui: bevelThickness
    bevelSize: 1, // ui: bevelSize
    bevelSegments: 2, // ui: bevelSegments
  };

  //   const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const geometry = new THREE.ShapeGeometry(shape);
  geometry.rotateX(Math.PI / 2);
  return geometry;
};

let RingBufferGeo = {
  platformBase: function () {
    //accept radius as input later
    let x, y, z;
    y = -115;
    let curvePoints = [];
    const platformResolution = 60;
    const platformInnerRadius = 90;
    const platformOuterRadius = 115;

    const platformMaterial = new THREE.MeshBasicMaterial({
      color: 0x333333,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });

    platformLoaderMaterial = platformMaterial;

    for (let i = 0; i < platformResolution + 1; i++) {
      x =
        -platformOuterRadius *
        Math.cos(-Math.PI / 2 + (i * (2 * Math.PI)) / platformResolution);
      z =
        platformOuterRadius *
        Math.sin(-Math.PI / 2 + (i * (2 * Math.PI)) / platformResolution);
      //   y = 1;
      curvePoints.push(new THREE.Vector3(x, y, z));
    }
    curvePoints.push(new THREE.Vector3(x, y, z));
    for (let i = platformResolution; i > 1; i--) {
      x =
        -platformInnerRadius *
        Math.cos(-Math.PI / 2 + (i * (2 * Math.PI)) / platformResolution);
      z =
        platformInnerRadius *
        Math.sin(-Math.PI / 2 + (i * (2 * Math.PI)) / platformResolution);
      //   y = 1;
      curvePoints.push(new THREE.Vector3(x, y, z));
      if (i == platformResolution) {
        curvePoints.push(new THREE.Vector3(x, y, z));
      }
    }
    curvePoints.push(curvePoints[0]);
    platformLoaderRawPoints = curvePoints;
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const points = curve.getPoints(240);
    platformLoaderPoints = points;
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x555555 });
    const curveObject = new THREE.Line(geometry, material);

    const cInnerRadius = 40;
    const cOuterRadius = 60;
    let cRotFac = 0.58;

    //C-Quad
    const cQuadPoints = [
      new THREE.Vector3(0, y, -cInnerRadius),
      new THREE.Vector3(0, y, -cOuterRadius),
      new THREE.Vector3(-(cOuterRadius - cInnerRadius) / 4, y, -cOuterRadius),
      new THREE.Vector3(-(cOuterRadius - cInnerRadius), y, -cInnerRadius),
      new THREE.Vector3(0, y, -cInnerRadius),
    ];
    const geometryCQuad = new THREE.BufferGeometry().setFromPoints(cQuadPoints);
    const materialCQuad = new THREE.LineBasicMaterial({ color: 0x555555 });
    const curveObjectCQuad = new THREE.Line(geometryCQuad, materialCQuad);
    curveObjectCQuad.rotateY(Math.PI / 1.3);
    curveObject.add(curveObjectCQuad);

    //C-Sickle
    let sickleCurvePoints = [];
    const sickleResolution = 60;

    for (let i = 0; i < sickleResolution + 1; i++) {
      x =
        -cOuterRadius *
        Math.cos(Math.PI / 2 + (1.14 * i * Math.PI) / sickleResolution);
      z =
        cOuterRadius *
        Math.sin(Math.PI / 2 + (1.14 * i * Math.PI) / sickleResolution);
      //   y = 1;
      sickleCurvePoints.push(new THREE.Vector3(x, y, z));
    }
    sickleCurvePoints.push(new THREE.Vector3(x, y, z));
    for (let i = sickleResolution; i > -1; i--) {
      x =
        -cInnerRadius *
        Math.cos(Math.PI / 2 + (1.12 * i * Math.PI) / sickleResolution);
      z =
        cInnerRadius *
        Math.sin(Math.PI / 2 + (1.12 * i * Math.PI) / sickleResolution);
      //   y = 1;
      sickleCurvePoints.push(new THREE.Vector3(x, y, z));
      if (i == sickleResolution) {
        sickleCurvePoints.push(new THREE.Vector3(x, y, z));
      }
    }
    sickleCurvePoints.push(new THREE.Vector3(x, y, z));
    sickleCurvePoints.push(sickleCurvePoints[0]);
    const sickleCurve = new THREE.CatmullRomCurve3(sickleCurvePoints);
    const sickleNewPoints = sickleCurve.getPoints(240);
    const sickleGeometry = new THREE.BufferGeometry().setFromPoints(
      sickleNewPoints
    );
    const sickleMaterial = new THREE.LineBasicMaterial({ color: 0x555555 });
    const sickleCurveObject = new THREE.Line(sickleGeometry, sickleMaterial);
    sickleCurveObject.rotateY(cRotFac * Math.PI);
    // curveObject.add(sickleCurveObject);

    //C-Round Tip

    let roundTipCurvePoints = [];
    const roundTipResolution = 60;
    const roundTipRadius = (cOuterRadius - cInnerRadius) / 2;

    for (let i = 0; i < roundTipResolution + 1; i++) {
      x =
        roundTipRadius *
        Math.cos(Math.PI / 2 + (i * Math.PI) / roundTipResolution);
      z =
        cInnerRadius +
        roundTipRadius +
        roundTipRadius *
          Math.sin(Math.PI / 2 + (i * Math.PI) / roundTipResolution);
      //   y = 1;
      roundTipCurvePoints.push(new THREE.Vector3(x, y, z));
    }
    roundTipCurvePoints.push(new THREE.Vector3(x, y, z));
    roundTipCurvePoints.push(roundTipCurvePoints[0]);
    const roundTipCurve = new THREE.CatmullRomCurve3(roundTipCurvePoints);
    const roundTipPoints = roundTipCurve.getPoints(120);
    const roundTipGeometry = new THREE.BufferGeometry().setFromPoints(
      roundTipPoints
    );
    const roundTipMaterial = new THREE.LineBasicMaterial({ color: 0x555555 });
    const roundTipCurveObject = new THREE.Line(
      roundTipGeometry,
      roundTipMaterial
    );
    const cQuadMesh = new THREE.Mesh(shapify(cQuadPoints), platformMaterial);
    curveObject.add(cQuadMesh);
    const sickleMesh = new THREE.Mesh(
      shapify(sickleNewPoints),
      platformMaterial
    );
    curveObject.add(sickleMesh);
    const roundTipMesh = new THREE.Mesh(
      shapify(roundTipPoints),
      platformMaterial
    );
    curveObject.add(roundTipMesh);

    cQuadMesh.rotateY(Math.PI / 1.3);
    cQuadMesh.translateY(-115);
    roundTipMesh.rotateY(cRotFac * Math.PI);
    roundTipMesh.translateY(-115);
    sickleMesh.rotateY(cRotFac * Math.PI);
    sickleMesh.translateY(-115);
    roundTipCurveObject.rotateY(cRotFac * Math.PI);
    // curveObject.add(roundTipCurveObject);

    return curveObject;
  },

  platformLoader: function (time) {
    //time from 0-300. 0-200 is idle
    let percent = 90;
    let tempPoints = [];
    if (time < 120) {
      percent = 99;
    } else if (time < 175) {
      percent = (time - 120) / 0.6;
    } else {
      percent = 99;
    }
    // percent = 100;

    let pointsLimit = (platformLoaderPoints.length * percent) / 100;
    let midpoint = Math.floor(platformLoaderPoints.length / 2);

    let tempRawPoints = [];
    let rawPointsLimit = parseInt(
      (platformLoaderRawPoints.length * percent) / 200
    );
    let rawMidPoint = Math.floor(platformLoaderRawPoints.length / 2);

    for (let i = parseInt(rawPointsLimit / 2); i > -1; i--) {
      tempRawPoints.push(platformLoaderRawPoints[rawMidPoint - i]);
    }

    for (let i = 0; i > parseInt(rawPointsLimit / 2); i++) {
      tempRawPoints.push(platformLoaderRawPoints[rawMidPoint + i]);
    }
    tempRawPoints.push(tempRawPoints[0]);
    tempRawPoints = [];
    for (let i = rawPointsLimit; i >= 0; i--) {
      tempRawPoints.push(platformLoaderRawPoints[rawMidPoint - i]);
    }
    for (let i = 0; i <= rawPointsLimit; i++) {
      tempRawPoints.push(platformLoaderRawPoints[rawMidPoint + 1 + i]);
    }

    let loaderGeometry;
    const curve = new THREE.CatmullRomCurve3(tempRawPoints);

    if (tempRawPoints.length > 2) {
      const points = curve.getPoints(240);
      for (let i = 0; i < pointsLimit / 2; i++) {
        tempPoints.push(platformLoaderPoints[midpoint - i]);
      }
      for (let i = parseInt(pointsLimit / 2); i < pointsLimit; i++) {
        tempPoints.push(platformLoaderPoints[midpoint + i]);
      }
      loaderGeometry = shapify(points);
    } else loaderGeometry = new THREE.BoxGeometry(1, 1, 1);
    const loaderMesh = new THREE.Mesh(loaderGeometry, platformLoaderMaterial);
    loaderMesh.translateY(-115);
    return loaderMesh;
  },

  make: function (inPoints) {
    let sm = DefaultConstants.curveSmallOffset;
    let spm = DefaultConstants.sphereSmallOffset;
    let rMajor = DefaultConstants.ringRadius;
    let sideLength = rMajor;
    sideLength *= 0.5;
    sideLength /= 20;
    let lThick = DefaultConstants.ringThickness;
    let lWide = DefaultConstants.ringWidth;
    // let lSection = sideLength * 0.2;
    let rFillet = lThick * 0.75;
    let lSupport = rFillet / 2;

    let noOfRingSegments = DefaultConstants.ringSegments;
    let noOfFilletEdges = 10;
    let filletTurnAngle = (Math.PI * 0.5) / (noOfFilletEdges + 1);
    let thetaMajor = (2 * Math.PI) / noOfRingSegments;

    lThick -= lSupport + rFillet;
    lWide -= lSupport + rFillet;

    let vertAOps, vertBOps, vertCOps, vertDOps;
    let normalAOps, normalBOps, normalCOps, normalDOps;
    let uvAOps, uvBOps, uvCOps, uvDOps;

    let cubeVerts = [];

    let innerMakeQuad = function () {
      cubeVerts.push(
        ...MeshOps.makeQuadFace(
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
    };

    for (let j = 0; j < noOfRingSegments; j++) {
      let lWideNewA = Math.abs(inPoints[j].z) - sm + spm - rFillet - lSupport;
      let lWideNewC =
        Math.abs(inPoints[(j + 1) % inPoints.length].z) -
        sm +
        spm -
        rFillet -
        lSupport;
      {
        //maybe just change lWide to inpoints
        //Front
        vertAOps = [
          (-lThick + rMajor) * Math.cos(j * thetaMajor),
          (-lThick + rMajor) * Math.sin(j * thetaMajor),
          lWideNewA + lSupport + rFillet,
        ];

        vertBOps = [
          (lThick + rMajor) * Math.cos(j * thetaMajor),
          (lThick + rMajor) * Math.sin(j * thetaMajor),
          lWideNewA + lSupport + rFillet,
        ];

        vertCOps = [
          (lThick + rMajor) * Math.cos((j + 1) * thetaMajor),
          (lThick + rMajor) * Math.sin((j + 1) * thetaMajor),
          lWideNewC + lSupport + rFillet,
        ];

        vertDOps = [
          (-lThick + rMajor) * Math.cos((j + 1) * thetaMajor),
          (-lThick + rMajor) * Math.sin((j + 1) * thetaMajor),
          lWideNewC + lSupport + rFillet,
        ];
        normalAOps = [0, 0, 1];
        normalBOps = [0, 0, 1];
        normalCOps = [0, 0, 1];
        normalDOps = [0, 0, 1];
        uvAOps = [0, 0];
        uvBOps = [1, 0];
        uvCOps = [1, 1];
        uvDOps = [0, 1];
        innerMakeQuad();

        //Right (outer surface)
        vertAOps = [
          (lThick + lSupport + rFillet + rMajor) * Math.cos(j * thetaMajor),
          (lThick + lSupport + rFillet + rMajor) * Math.sin(j * thetaMajor),
          lWideNewA,
        ];

        vertBOps = [
          (lThick + lSupport + rFillet + rMajor) * Math.cos(j * thetaMajor),
          (lThick + lSupport + rFillet + rMajor) * Math.sin(j * thetaMajor),
          -lWideNewA,
        ];

        vertCOps = [
          (lThick + lSupport + rFillet + rMajor) *
            Math.cos((j + 1) * thetaMajor),
          (lThick + lSupport + rFillet + rMajor) *
            Math.sin((j + 1) * thetaMajor),
          -lWideNewC,
        ];

        vertDOps = [
          (lThick + lSupport + rFillet + rMajor) *
            Math.cos((j + 1) * thetaMajor),
          (lThick + lSupport + rFillet + rMajor) *
            Math.sin((j + 1) * thetaMajor),
          lWideNewC,
        ];

        normalAOps = [Math.cos(j * thetaMajor), Math.sin(j * thetaMajor), 0];
        normalBOps = [Math.cos(j * thetaMajor), Math.sin(j * thetaMajor), 0];
        normalCOps = [
          Math.cos((j + 1) * thetaMajor),
          Math.sin((j + 1) * thetaMajor),
          0,
        ];
        normalDOps = [
          Math.cos((j + 1) * thetaMajor),
          Math.sin((j + 1) * thetaMajor),
          0,
        ];
        uvAOps = [0, 0];
        uvBOps = [1, 0];
        uvCOps = [1, 1];
        uvDOps = [0, 1];
        innerMakeQuad();

        //Back
        vertAOps = [
          (lThick + rMajor) * Math.cos(j * thetaMajor),
          (lThick + rMajor) * Math.sin(j * thetaMajor),
          -(lWideNewA + lSupport + rFillet),
        ];

        vertBOps = [
          (-lThick + rMajor) * Math.cos(j * thetaMajor),
          (-lThick + rMajor) * Math.sin(j * thetaMajor),
          -(lWideNewA + lSupport + rFillet),
        ];

        vertCOps = [
          (-lThick + rMajor) * Math.cos((j + 1) * thetaMajor),
          (-lThick + rMajor) * Math.sin((j + 1) * thetaMajor),
          -(lWideNewC + lSupport + rFillet),
        ];

        vertDOps = [
          (lThick + rMajor) * Math.cos((j + 1) * thetaMajor),
          (lThick + rMajor) * Math.sin((j + 1) * thetaMajor),
          -(lWideNewC + lSupport + rFillet),
        ];

        normalAOps = [0, 0, -1];
        normalBOps = [0, 0, -1];
        normalCOps = [0, 0, -1];
        normalDOps = [0, 0, -1];
        uvAOps = [0, 0];
        uvBOps = [1, 0];
        uvCOps = [1, 1];
        uvDOps = [0, 1];
        innerMakeQuad();

        //Left (inner surface)
        vertAOps = [
          (-lThick - lSupport - rFillet + rMajor) * Math.cos(j * thetaMajor),
          (-lThick - lSupport - rFillet + rMajor) * Math.sin(j * thetaMajor),
          -lWideNewA,
        ];

        vertBOps = [
          (-lThick - lSupport - rFillet + rMajor) * Math.cos(j * thetaMajor),
          (-lThick - lSupport - rFillet + rMajor) * Math.sin(j * thetaMajor),
          lWideNewA,
        ];

        vertCOps = [
          (-lThick - lSupport - rFillet + rMajor) *
            Math.cos((j + 1) * thetaMajor),
          (-lThick - lSupport - rFillet + rMajor) *
            Math.sin((j + 1) * thetaMajor),
          lWideNewC,
        ];

        vertDOps = [
          (-lThick - lSupport - rFillet + rMajor) *
            Math.cos((j + 1) * thetaMajor),
          (-lThick - lSupport - rFillet + rMajor) *
            Math.sin((j + 1) * thetaMajor),
          -lWideNewC,
        ];

        normalAOps = [-Math.cos(j * thetaMajor), -Math.sin(j * thetaMajor), 0];
        normalBOps = [-Math.cos(j * thetaMajor), -Math.sin(j * thetaMajor), 0];
        normalCOps = [
          -Math.cos((j + 1) * thetaMajor),
          -Math.sin((j + 1) * thetaMajor),
          0,
        ];
        normalDOps = [
          -Math.cos((j + 1) * thetaMajor),
          -Math.sin((j + 1) * thetaMajor),
          0,
        ];
        uvAOps = [0, 0];
        uvBOps = [1, 0];
        uvCOps = [1, 1];
        uvDOps = [0, 1];
        innerMakeQuad();
      }

      {
        //support edges
        //front left

        vertAOps = [
          (-lThick - lSupport + rMajor) * Math.cos(j * thetaMajor),
          (-lThick - lSupport + rMajor) * Math.sin(j * thetaMajor),
          lWideNewA + lSupport + rFillet,
        ];

        vertBOps = [
          (-lThick + rMajor) * Math.cos(j * thetaMajor),
          (-lThick + rMajor) * Math.sin(j * thetaMajor),
          lWideNewA + lSupport + rFillet,
        ];

        vertCOps = [
          (-lThick + rMajor) * Math.cos((j + 1) * thetaMajor),
          (-lThick + rMajor) * Math.sin((j + 1) * thetaMajor),
          lWideNewC + lSupport + rFillet,
        ];

        vertDOps = [
          (-lThick - lSupport + rMajor) * Math.cos((j + 1) * thetaMajor),
          (-lThick - lSupport + rMajor) * Math.sin((j + 1) * thetaMajor),
          lWideNewC + lSupport + rFillet,
        ];

        normalAOps = [0, 0, 1];
        normalBOps = [0, 0, 1];
        normalCOps = [0, 0, 1];
        normalDOps = [0, 0, 1];
        uvAOps = [0, 0];
        uvBOps = [1, 0];
        uvCOps = [1, 1];
        uvDOps = [0, 1];
        innerMakeQuad();

        //front right

        vertAOps = [
          (lThick + rMajor) * Math.cos(j * thetaMajor),
          (lThick + rMajor) * Math.sin(j * thetaMajor),
          lWideNewA + lSupport + rFillet,
        ];

        vertBOps = [
          (lThick + lSupport + rMajor) * Math.cos(j * thetaMajor),
          (lThick + lSupport + rMajor) * Math.sin(j * thetaMajor),
          lWideNewA + lSupport + rFillet,
        ];

        vertCOps = [
          (lThick + lSupport + rMajor) * Math.cos((j + 1) * thetaMajor),
          (lThick + lSupport + rMajor) * Math.sin((j + 1) * thetaMajor),
          lWideNewC + lSupport + rFillet,
        ];

        vertDOps = [
          (lThick + rMajor) * Math.cos((j + 1) * thetaMajor),
          (lThick + rMajor) * Math.sin((j + 1) * thetaMajor),
          lWideNewC + lSupport + rFillet,
        ];

        normalAOps = [Math.cos(j * thetaMajor), Math.sin(j * thetaMajor), 0];
        normalBOps = [Math.cos(j * thetaMajor), Math.sin(j * thetaMajor), 0];
        normalCOps = [
          Math.cos((j + 1) * thetaMajor),
          Math.sin((j + 1) * thetaMajor),
          0,
        ];
        normalDOps = [
          Math.cos((j + 1) * thetaMajor),
          Math.sin((j + 1) * thetaMajor),
          0,
        ];
        uvAOps = [0, 0];
        uvBOps = [1, 0];
        uvCOps = [1, 1];
        uvDOps = [0, 1];
        innerMakeQuad();

        //right front ("right side" when facing it)

        vertAOps = [
          (lThick + lSupport + rFillet + rMajor) * Math.cos(j * thetaMajor),
          (lThick + lSupport + rFillet + rMajor) * Math.sin(j * thetaMajor),
          -lWideNewA,
        ];

        vertBOps = [
          (lThick + lSupport + rFillet + rMajor) * Math.cos(j * thetaMajor),
          (lThick + lSupport + rFillet + rMajor) * Math.sin(j * thetaMajor),
          -lWideNewA - lSupport,
        ];

        vertCOps = [
          (lThick + lSupport + rFillet + rMajor) *
            Math.cos((j + 1) * thetaMajor),
          (lThick + lSupport + rFillet + rMajor) *
            Math.sin((j + 1) * thetaMajor),
          -lWideNewC - lSupport,
        ];

        vertDOps = [
          (lThick + lSupport + rFillet + rMajor) *
            Math.cos((j + 1) * thetaMajor),
          (lThick + lSupport + rFillet + rMajor) *
            Math.sin((j + 1) * thetaMajor),
          -lWideNewC,
        ];

        normalAOps = [Math.cos(j * thetaMajor), Math.sin(j * thetaMajor), 0];
        normalBOps = [Math.cos(j * thetaMajor), Math.sin(j * thetaMajor), 0];
        normalCOps = [
          Math.cos((j + 1) * thetaMajor),
          Math.sin((j + 1) * thetaMajor),
          0,
        ];
        normalDOps = [
          Math.cos((j + 1) * thetaMajor),
          Math.sin((j + 1) * thetaMajor),
          0,
        ];
        uvAOps = [0, 0];
        uvBOps = [1, 0];
        uvCOps = [1, 1];
        uvDOps = [0, 1];
        innerMakeQuad();

        //right back ("left side" when facing it)

        vertAOps = [
          (lThick + lSupport + rFillet + rMajor) * Math.cos(j * thetaMajor),
          (lThick + lSupport + rFillet + rMajor) * Math.sin(j * thetaMajor),
          lWideNewA + lSupport,
        ];

        vertBOps = [
          (lThick + lSupport + rFillet + rMajor) * Math.cos(j * thetaMajor),
          (lThick + lSupport + rFillet + rMajor) * Math.sin(j * thetaMajor),
          lWideNewA,
        ];

        vertCOps = [
          (lThick + lSupport + rFillet + rMajor) *
            Math.cos((j + 1) * thetaMajor),
          (lThick + lSupport + rFillet + rMajor) *
            Math.sin((j + 1) * thetaMajor),
          lWideNewC,
        ];

        vertDOps = [
          (lThick + lSupport + rFillet + rMajor) *
            Math.cos((j + 1) * thetaMajor),
          (lThick + lSupport + rFillet + rMajor) *
            Math.sin((j + 1) * thetaMajor),
          lWideNewC + lSupport,
        ];

        normalAOps = [Math.cos(j * thetaMajor), Math.sin(j * thetaMajor), 0];
        normalBOps = [Math.cos(j * thetaMajor), Math.sin(j * thetaMajor), 0];
        normalCOps = [
          Math.cos((j + 1) * thetaMajor),
          Math.sin((j + 1) * thetaMajor),
          0,
        ];
        normalDOps = [
          Math.cos((j + 1) * thetaMajor),
          Math.sin((j + 1) * thetaMajor),
          0,
        ];
        uvAOps = [0, 0];
        uvBOps = [1, 0];
        uvCOps = [1, 1];
        uvDOps = [0, 1];
        innerMakeQuad();

        //back left

        vertAOps = [
          (-lThick + rMajor) * Math.cos(j * thetaMajor),
          (-lThick + rMajor) * Math.sin(j * thetaMajor),
          -(lWideNewA + lSupport + rFillet),
        ];

        vertBOps = [
          (-lThick - lSupport + rMajor) * Math.cos(j * thetaMajor),
          (-lThick - lSupport + rMajor) * Math.sin(j * thetaMajor),
          -(lWideNewA + lSupport + rFillet),
        ];

        vertCOps = [
          (-lThick - lSupport + rMajor) * Math.cos((j + 1) * thetaMajor),
          (-lThick - lSupport + rMajor) * Math.sin((j + 1) * thetaMajor),
          -(lWideNewC + lSupport + rFillet),
        ];

        vertDOps = [
          (-lThick + rMajor) * Math.cos((j + 1) * thetaMajor),
          (-lThick + rMajor) * Math.sin((j + 1) * thetaMajor),
          -(lWideNewC + lSupport + rFillet),
        ];

        normalAOps = [0, 0, -1];
        normalBOps = [0, 0, -1];
        normalCOps = [0, 0, -1];
        normalDOps = [0, 0, -1];
        uvAOps = [0, 0];
        uvBOps = [1, 0];
        uvCOps = [1, 1];
        uvDOps = [0, 1];
        innerMakeQuad();

        //back right

        vertAOps = [
          (lThick + lSupport + rMajor) * Math.cos(j * thetaMajor),
          (lThick + lSupport + rMajor) * Math.sin(j * thetaMajor),
          -(lWideNewA + lSupport + rFillet),
        ];

        vertBOps = [
          (lThick + rMajor) * Math.cos(j * thetaMajor),
          (lThick + rMajor) * Math.sin(j * thetaMajor),
          -(lWideNewA + lSupport + rFillet),
        ];

        vertCOps = [
          (lThick + rMajor) * Math.cos((j + 1) * thetaMajor),
          (lThick + rMajor) * Math.sin((j + 1) * thetaMajor),
          -(lWideNewC + lSupport + rFillet),
        ];

        vertDOps = [
          (lThick + lSupport + rMajor) * Math.cos((j + 1) * thetaMajor),
          (lThick + lSupport + rMajor) * Math.sin((j + 1) * thetaMajor),
          -(lWideNewC + lSupport + rFillet),
        ];

        normalAOps = [0, 0, -1];
        normalBOps = [0, 0, -1];
        normalCOps = [0, 0, -1];
        normalDOps = [0, 0, -1];
        uvAOps = [0, 0];
        uvBOps = [1, 0];
        uvCOps = [1, 1];
        uvDOps = [0, 1];
        innerMakeQuad();

        //left front ("left side when facing it") inner ring

        vertAOps = [
          (-lThick - lSupport - rFillet + rMajor) * Math.cos(j * thetaMajor),
          (-lThick - lSupport - rFillet + rMajor) * Math.sin(j * thetaMajor),
          -lWideNewA - lSupport,
        ];

        vertBOps = [
          (-lThick - lSupport - rFillet + rMajor) * Math.cos(j * thetaMajor),
          (-lThick - lSupport - rFillet + rMajor) * Math.sin(j * thetaMajor),
          -lWideNewA,
        ];

        vertCOps = [
          (-lThick - lSupport - rFillet + rMajor) *
            Math.cos((j + 1) * thetaMajor),
          (-lThick - lSupport - rFillet + rMajor) *
            Math.sin((j + 1) * thetaMajor),
          -lWideNewC,
        ];

        vertDOps = [
          (-lThick - lSupport - rFillet + rMajor) *
            Math.cos((j + 1) * thetaMajor),
          (-lThick - lSupport - rFillet + rMajor) *
            Math.sin((j + 1) * thetaMajor),
          -lWideNewC - lSupport,
        ];

        normalAOps = [-Math.cos(j * thetaMajor), -Math.sin(j * thetaMajor), 0];
        normalBOps = [-Math.cos(j * thetaMajor), -Math.sin(j * thetaMajor), 0];
        normalCOps = [
          -Math.cos((j + 1) * thetaMajor),
          -Math.sin((j + 1) * thetaMajor),
          0,
        ];
        normalDOps = [
          -Math.cos((j + 1) * thetaMajor),
          -Math.sin((j + 1) * thetaMajor),
          0,
        ];
        uvAOps = [0, 0];
        uvBOps = [1, 0];
        uvCOps = [1, 1];
        uvDOps = [0, 1];
        innerMakeQuad();
        //left back ("right side when facing it") inner ring

        vertAOps = [
          (-lThick - lSupport - rFillet + rMajor) * Math.cos(j * thetaMajor),
          (-lThick - lSupport - rFillet + rMajor) * Math.sin(j * thetaMajor),
          lWideNewA,
        ];

        vertBOps = [
          (-lThick - lSupport - rFillet + rMajor) * Math.cos(j * thetaMajor),
          (-lThick - lSupport - rFillet + rMajor) * Math.sin(j * thetaMajor),
          lWideNewA + lSupport,
        ];

        vertCOps = [
          (-lThick - lSupport - rFillet + rMajor) *
            Math.cos((j + 1) * thetaMajor),
          (-lThick - lSupport - rFillet + rMajor) *
            Math.sin((j + 1) * thetaMajor),
          lWideNewC + lSupport,
        ];

        vertDOps = [
          (-lThick - lSupport - rFillet + rMajor) *
            Math.cos((j + 1) * thetaMajor),
          (-lThick - lSupport - rFillet + rMajor) *
            Math.sin((j + 1) * thetaMajor),
          lWideNewC,
        ];

        normalAOps = [-Math.cos(j * thetaMajor), -Math.sin(j * thetaMajor), 0];
        normalBOps = [-Math.cos(j * thetaMajor), -Math.sin(j * thetaMajor), 0];
        normalCOps = [
          -Math.cos((j + 1) * thetaMajor),
          -Math.sin((j + 1) * thetaMajor),
          0,
        ];
        normalDOps = [
          -Math.cos((j + 1) * thetaMajor),
          -Math.sin((j + 1) * thetaMajor),
          0,
        ];
        uvAOps = [0, 0];
        uvBOps = [1, 0];
        uvCOps = [1, 1];
        uvDOps = [0, 1];
        innerMakeQuad();
      }

      {
        //fillet rounds
        //F->R (front to outer rim)
        //loop "number of edges" times. Adapt to function.

        for (let i = 0; i < noOfFilletEdges + 1; i++) {
          // let theta = filletTurnAngle;
          vertAOps = [
            (lThick +
              lSupport +
              rFillet * Math.sin(i * filletTurnAngle) +
              rMajor) *
              Math.cos(j * thetaMajor),
            (lThick +
              lSupport +
              rFillet * Math.sin(i * filletTurnAngle) +
              rMajor) *
              Math.sin(j * thetaMajor),
            lWideNewA + lSupport + rFillet * Math.cos(i * filletTurnAngle),
          ];

          vertBOps = [
            (lThick +
              lSupport +
              rFillet * Math.sin((i + 1) * filletTurnAngle) +
              rMajor) *
              Math.cos(j * thetaMajor),
            (lThick +
              lSupport +
              rFillet * Math.sin((i + 1) * filletTurnAngle) +
              rMajor) *
              Math.sin(j * thetaMajor),
            lWideNewA +
              lSupport +
              rFillet * Math.cos((i + 1) * filletTurnAngle),
          ];

          vertCOps = [
            (lThick +
              lSupport +
              rFillet * Math.sin((i + 1) * filletTurnAngle) +
              rMajor) *
              Math.cos((j + 1) * thetaMajor),
            (lThick +
              lSupport +
              rFillet * Math.sin((i + 1) * filletTurnAngle) +
              rMajor) *
              Math.sin((j + 1) * thetaMajor),
            lWideNewC +
              lSupport +
              rFillet * Math.cos((i + 1) * filletTurnAngle),
          ];

          vertDOps = [
            (lThick +
              lSupport +
              rFillet * Math.sin(i * filletTurnAngle) +
              rMajor) *
              Math.cos((j + 1) * thetaMajor),
            (lThick +
              lSupport +
              rFillet * Math.sin(i * filletTurnAngle) +
              rMajor) *
              Math.sin((j + 1) * thetaMajor),
            lWideNewC + lSupport + rFillet * Math.cos(i * filletTurnAngle),
          ];

          normalAOps = [
            Math.sin(i * filletTurnAngle) * Math.cos(j * thetaMajor),
            0,
            Math.cos(i * filletTurnAngle),
          ];
          normalBOps = [
            Math.sin((i + 1) * filletTurnAngle) * Math.cos(j * thetaMajor),
            0,
            Math.cos((i + 1) * filletTurnAngle),
          ];
          normalCOps = [
            Math.sin((i + 1) * filletTurnAngle) *
              Math.cos((j + 1) * thetaMajor),
            Math.sin((i + 1) * filletTurnAngle) *
              Math.sin((j + 1) * thetaMajor),
            Math.cos((i + 1) * filletTurnAngle),
          ];
          normalDOps = [
            Math.sin(i * filletTurnAngle) * Math.cos((j + 1) * thetaMajor),
            Math.sin(i * filletTurnAngle) * Math.sin((j + 1) * thetaMajor),
            Math.cos(i * filletTurnAngle),
          ];

          uvAOps = [0, 0];
          uvBOps = [1, 0];
          uvCOps = [1, 1];
          uvDOps = [0, 1];
          innerMakeQuad();
        }
        //R->B

        for (let i = 0; i < noOfFilletEdges + 1; i++) {
          vertAOps = [
            (lThick +
              lSupport +
              rFillet * Math.cos(i * filletTurnAngle) +
              rMajor) *
              Math.cos(j * thetaMajor),
            (lThick +
              lSupport +
              rFillet * Math.cos(i * filletTurnAngle) +
              rMajor) *
              Math.sin(j * thetaMajor),
            -(lWideNewA + lSupport + rFillet * Math.sin(i * filletTurnAngle)),
          ];

          vertBOps = [
            (lThick +
              lSupport +
              rFillet * Math.cos((i + 1) * filletTurnAngle) +
              rMajor) *
              Math.cos(j * thetaMajor),
            (lThick +
              lSupport +
              rFillet * Math.cos((i + 1) * filletTurnAngle) +
              rMajor) *
              Math.sin(j * thetaMajor),
            -(
              lWideNewA +
              lSupport +
              rFillet * Math.sin((i + 1) * filletTurnAngle)
            ),
          ];

          vertCOps = [
            (lThick +
              lSupport +
              rFillet * Math.cos((i + 1) * filletTurnAngle) +
              rMajor) *
              Math.cos((j + 1) * thetaMajor),
            (lThick +
              lSupport +
              rFillet * Math.cos((i + 1) * filletTurnAngle) +
              rMajor) *
              Math.sin((j + 1) * thetaMajor),
            -(
              lWideNewC +
              lSupport +
              rFillet * Math.sin((i + 1) * filletTurnAngle)
            ),
          ];

          vertDOps = [
            (lThick +
              lSupport +
              rFillet * Math.cos(i * filletTurnAngle) +
              rMajor) *
              Math.cos((j + 1) * thetaMajor),
            (lThick +
              lSupport +
              rFillet * Math.cos(i * filletTurnAngle) +
              rMajor) *
              Math.sin((j + 1) * thetaMajor),
            -(lWideNewC + lSupport + rFillet * Math.sin(i * filletTurnAngle)),
          ];

          normalAOps = [
            Math.cos(i * filletTurnAngle),
            0,
            -Math.sin(i * filletTurnAngle),
          ];
          normalBOps = [
            Math.cos((i + 1) * filletTurnAngle),
            0,
            -Math.sin((i + 1) * filletTurnAngle),
          ];
          normalCOps = [
            Math.cos((i + 1) * filletTurnAngle),
            0,
            -Math.sin((i + 1) * filletTurnAngle),
          ];
          normalDOps = [
            Math.cos(i * filletTurnAngle),
            0,
            -Math.sin(i * filletTurnAngle),
          ];
          uvAOps = [0, 0];
          uvBOps = [1, 0];
          uvCOps = [1, 1];
          uvDOps = [0, 1];
          innerMakeQuad();
        }
        //B->L
        for (let i = 0; i < noOfFilletEdges + 1; i++) {
          vertAOps = [
            (-(lThick + lSupport + rFillet * Math.sin(i * filletTurnAngle)) +
              rMajor) *
              Math.cos(j * thetaMajor),
            (-(lThick + lSupport + rFillet * Math.sin(i * filletTurnAngle)) +
              rMajor) *
              Math.sin(j * thetaMajor),
            -(lWideNewA + lSupport + rFillet * Math.cos(i * filletTurnAngle)),
          ];

          vertBOps = [
            (-(
              lThick +
              lSupport +
              rFillet * Math.sin((i + 1) * filletTurnAngle)
            ) +
              rMajor) *
              Math.cos(j * thetaMajor),
            (-(
              lThick +
              lSupport +
              rFillet * Math.sin((i + 1) * filletTurnAngle)
            ) +
              rMajor) *
              Math.sin(j * thetaMajor),
            -(
              lWideNewA +
              lSupport +
              rFillet * Math.cos((i + 1) * filletTurnAngle)
            ),
          ];

          vertCOps = [
            (-(
              lThick +
              lSupport +
              rFillet * Math.sin((i + 1) * filletTurnAngle)
            ) +
              rMajor) *
              Math.cos((j + 1) * thetaMajor),
            (-(
              lThick +
              lSupport +
              rFillet * Math.sin((i + 1) * filletTurnAngle)
            ) +
              rMajor) *
              Math.sin((j + 1) * thetaMajor),
            -(
              lWideNewC +
              lSupport +
              rFillet * Math.cos((i + 1) * filletTurnAngle)
            ),
          ];

          vertDOps = [
            (-(lThick + lSupport + rFillet * Math.sin(i * filletTurnAngle)) +
              rMajor) *
              Math.cos((j + 1) * thetaMajor),
            (-(lThick + lSupport + rFillet * Math.sin(i * filletTurnAngle)) +
              rMajor) *
              Math.sin((j + 1) * thetaMajor),
            -(lWideNewC + lSupport + rFillet * Math.cos(i * filletTurnAngle)),
          ];

          normalAOps = [0, 0, -1];
          normalBOps = [0, 0, -1];
          normalCOps = [0, 0, -1];
          normalDOps = [0, 0, -1];
          uvAOps = [0, 0];
          uvBOps = [1, 0];
          uvCOps = [1, 1];
          uvDOps = [0, 1];
          innerMakeQuad();
        }
        //L->F
        for (let i = 0; i < noOfFilletEdges + 1; i++) {
          vertAOps = [
            (-(lThick + lSupport + rFillet * Math.cos(i * filletTurnAngle)) +
              rMajor) *
              Math.cos(j * thetaMajor),
            (-(lThick + lSupport + rFillet * Math.cos(i * filletTurnAngle)) +
              rMajor) *
              Math.sin(j * thetaMajor),
            lWideNewA + lSupport + rFillet * Math.sin(i * filletTurnAngle),
          ];

          vertBOps = [
            (-(
              lThick +
              lSupport +
              rFillet * Math.cos((i + 1) * filletTurnAngle)
            ) +
              rMajor) *
              Math.cos(j * thetaMajor),
            (-(
              lThick +
              lSupport +
              rFillet * Math.cos((i + 1) * filletTurnAngle)
            ) +
              rMajor) *
              Math.sin(j * thetaMajor),
            lWideNewA +
              lSupport +
              rFillet * Math.sin((i + 1) * filletTurnAngle),
          ];

          vertCOps = [
            (-(
              lThick +
              lSupport +
              rFillet * Math.cos((i + 1) * filletTurnAngle)
            ) +
              rMajor) *
              Math.cos((j + 1) * thetaMajor),
            (-(
              lThick +
              lSupport +
              rFillet * Math.cos((i + 1) * filletTurnAngle)
            ) +
              rMajor) *
              Math.sin((j + 1) * thetaMajor),
            lWideNewC +
              lSupport +
              rFillet * Math.sin((i + 1) * filletTurnAngle),
          ];

          vertDOps = [
            (-(lThick + lSupport + rFillet * Math.cos(i * filletTurnAngle)) +
              rMajor) *
              Math.cos((j + 1) * thetaMajor),
            (-(lThick + lSupport + rFillet * Math.cos(i * filletTurnAngle)) +
              rMajor) *
              Math.sin((j + 1) * thetaMajor),
            lWideNewC + lSupport + rFillet * Math.sin(i * filletTurnAngle),
          ];

          normalAOps = [
            -Math.cos(i * filletTurnAngle) * Math.cos(j * thetaMajor),
            -Math.cos(i * filletTurnAngle) * Math.sin(j * thetaMajor),
            Math.sin(i * filletTurnAngle),
          ];
          normalBOps = [
            -Math.cos((i + 1) * filletTurnAngle) * Math.cos(j * thetaMajor),
            -Math.cos((i + 1) * filletTurnAngle) * Math.sin(j * thetaMajor),
            Math.sin((i + 1) * filletTurnAngle),
          ];

          normalCOps = [
            -Math.cos((i + 1) * filletTurnAngle),
            0,
            Math.sin((i + 1) * filletTurnAngle),
          ];
          normalDOps = [
            -Math.cos(i * filletTurnAngle),
            0,
            Math.sin(i * filletTurnAngle),
          ];

          uvAOps = [0, 0];
          uvBOps = [1, 0];
          uvCOps = [1, 1];
          uvDOps = [0, 1];
          innerMakeQuad();
        }
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
    let ringGeoClone = BufferGeometryUtils.mergeVertices(cubeGeometry, 0.1);
    // let ringClone =
    // ringGeoClone.mergeVertices();
    ringGeoClone.computeVertexNormals(true);
    // cubeGeometry.computeFaceNormals(true);

    const cubez = new THREE.Mesh(ringGeoClone, material);
    cubez.material.flatShading = false;

    // scene.add(cubez);

    return cubez;
  },

  // make: function(){
  //     console.log("this is from ring buffer MAAAKE")
  //     return "tested";
  // }
};

export { RingBufferGeo };
