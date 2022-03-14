
import * as THREE from "../ThreeJSr138/build/three.module.js"
import {MeshOps} from "./MeshOps.js"
import * as BufferGeometryUtils from "../ThreeJSr138/examples/jsm/utils/BufferGeometryUtils.js"
import {DefaultConstants} from "./DefaultConstants.js"

let RingBufferGeo = {

    make: function(){

        let rMajor =  DefaultConstants.ringRadius;
        let sideLength = rMajor;
        sideLength *= .5;
        sideLength /=20;
        let lThick = DefaultConstants.ringThickness;
        let lWide = DefaultConstants.ringWidth;
        // let lSection = sideLength * 0.2;
        let rFillet = lThick*0.75;
        let lSupport=rFillet/2;
        
        
        let noOfRingSegments = 100;
        let noOfFilletEdges = 10;
        let filletTurnAngle = Math.PI*0.5/(noOfFilletEdges + 1);
        let thetaMajor = 2*Math.PI/noOfRingSegments;

        lThick -= (lSupport + rFillet);
        lWide -= (lSupport + rFillet);

        let vertAOps, vertBOps, vertCOps, vertDOps;
        let normalAOps, normalBOps, normalCOps, normalDOps;
        let uvAOps, uvBOps, uvCOps, uvDOps;

        let cubeVerts = [];

        let innerMakeQuad = function(){

            cubeVerts.push(...MeshOps.makeQuadFace(
                vertAOps, vertBOps, vertCOps, vertDOps,
                normalAOps, normalBOps, normalCOps, normalDOps,
                uvAOps, uvBOps, uvCOps, uvDOps
            ));

        }

        for(let j = 0;j<noOfRingSegments;j++){

        {
        //Front
        vertAOps=[(-lThick+rMajor)*Math.cos(j*thetaMajor), 
                    (-lThick+rMajor)*Math.sin(j*thetaMajor),  
                    lWide + lSupport + rFillet]

        vertBOps=[ (lThick+rMajor)*Math.cos(j*thetaMajor), 
                    (lThick+rMajor)*Math.sin(j*thetaMajor),  
                    lWide + lSupport + rFillet]

        vertCOps=[ (lThick+rMajor)*Math.cos((j+1)*thetaMajor), 
                    (lThick+rMajor)*Math.sin((j+1)*thetaMajor),  
                    lWide + lSupport + rFillet]

        vertDOps=[(-lThick+rMajor)*Math.cos((j+1)*thetaMajor), 
                    (-lThick+rMajor)*Math.sin((j+1)*thetaMajor),  
                    lWide + lSupport + rFillet]
        normalAOps=[ 0,  0,  1]
        normalBOps=[ 0,  0,  1]
        normalCOps=[ 0,  0,  1]
        normalDOps=[ 0,  0,  1]
        uvAOps=[0, 0]
        uvBOps=[1, 0]
        uvCOps=[1, 1]
        uvDOps=[0, 1]
        innerMakeQuad();


        //Right (outer surface)
        vertAOps=[ (lThick + lSupport + rFillet+rMajor)*Math.cos(j*thetaMajor), 
            (lThick + lSupport + rFillet+rMajor)*Math.sin(j*thetaMajor),  
                    lWide]

        vertBOps=[ (lThick + lSupport + rFillet+rMajor)*Math.cos(j*thetaMajor), 
            (lThick + lSupport + rFillet+rMajor)*Math.sin(j*thetaMajor), 
                     -lWide]

        vertCOps=[ (lThick + lSupport + rFillet+rMajor)*Math.cos((j+1)*thetaMajor), 
            (lThick + lSupport + rFillet+rMajor)*Math.sin((j+1)*thetaMajor), 
                    -lWide]

        vertDOps=[ (lThick + lSupport + rFillet+rMajor)*Math.cos((j+1)*thetaMajor),
            (lThick + lSupport + rFillet+rMajor)*Math.sin((j+1)*thetaMajor),  
                     lWide]

        normalAOps=[ Math.cos(j*thetaMajor),  Math.sin(j*thetaMajor),  0]
        normalBOps=[ Math.cos(j*thetaMajor),  Math.sin(j*thetaMajor),  0]
        normalCOps=[ Math.cos((j+1)*thetaMajor),  Math.sin((j+1)*thetaMajor),  0]
        normalDOps=[ Math.cos((j+1)*thetaMajor),  Math.sin((j+1)*thetaMajor),  0]
        uvAOps=[0, 0]
        uvBOps=[1, 0]
        uvCOps=[1, 1]
        uvDOps=[0, 1]
        innerMakeQuad();

        //Back
        vertAOps=[ (lThick+rMajor)*Math.cos(j*thetaMajor), 
            (lThick+rMajor)*Math.sin(j*thetaMajor),
             -(lWide + lSupport + rFillet)]
             
        vertBOps=[(-lThick+rMajor)*Math.cos(j*thetaMajor), 
             (-lThick+rMajor)*Math.sin(j*thetaMajor),
             -(lWide + lSupport + rFillet)]
             
        vertCOps=[(-lThick+rMajor)*Math.cos((j+1)*thetaMajor), 
            (-lThick+rMajor)*Math.sin((j+1)*thetaMajor),
             -(lWide + lSupport + rFillet)]
             
        vertDOps=[ (lThick+rMajor)*Math.cos((j+1)*thetaMajor), 
            (lThick+rMajor)*Math.sin((j+1)*thetaMajor),
             -(lWide + lSupport + rFillet)]
             
        normalAOps=[ 0,  0,  -1]
        normalBOps=[ 0,  0,  -1]
        normalCOps=[ 0,  0,  -1]
        normalDOps=[ 0,  0,  -1]
        uvAOps=[0, 0]
        uvBOps=[1, 0]
        uvCOps=[1, 1]
        uvDOps=[0, 1]
        innerMakeQuad();

        //Left (inner surface)
        vertAOps=[(-lThick - lSupport - rFillet+rMajor)*Math.cos(j*thetaMajor),
            (-lThick - lSupport - rFillet+rMajor)*Math.sin(j*thetaMajor), 
             -lWide]

        vertBOps=[(-lThick - lSupport - rFillet+rMajor)*Math.cos(j*thetaMajor),
            (-lThick - lSupport - rFillet+rMajor)*Math.sin(j*thetaMajor),  
            lWide]

        vertCOps=[(-lThick - lSupport - rFillet+rMajor)*Math.cos((j+1)*thetaMajor), 
            (-lThick - lSupport - rFillet+rMajor)*Math.sin((j+1)*thetaMajor),  
            lWide]

        vertDOps=[(-lThick - lSupport - rFillet+rMajor)*Math.cos((j+1)*thetaMajor), 
            (-lThick - lSupport - rFillet+rMajor)*Math.sin((j+1)*thetaMajor), 
            -lWide]

        normalAOps=[ -Math.cos(j*thetaMajor),  -Math.sin(j*thetaMajor),  0]
        normalBOps=[ -Math.cos(j*thetaMajor),  -Math.sin(j*thetaMajor),  0]
        normalCOps=[ -Math.cos((j+1)*thetaMajor),  -Math.sin((j+1)*thetaMajor),  0]
        normalDOps=[ -Math.cos((j+1)*thetaMajor),  -Math.sin((j+1)*thetaMajor),  0]
        uvAOps=[0, 0]
        uvBOps=[1, 0]
        uvCOps=[1, 1]
        uvDOps=[0, 1]
        innerMakeQuad();
        }

        {//support edges
            //front left

        vertAOps=[(-lThick - lSupport+rMajor)*Math.cos(j*thetaMajor), 
            (-lThick - lSupport+rMajor)*Math.sin(j*thetaMajor),  
            lWide + lSupport + rFillet]

        vertBOps=[ (-lThick+rMajor)*Math.cos(j*thetaMajor), 
            (-lThick +rMajor)*Math.sin(j*thetaMajor),  
            lWide + lSupport + rFillet]

        vertCOps=[ (-lThick+rMajor)*Math.cos((j+1)*thetaMajor), 
            (-lThick+rMajor)*Math.sin((j+1)*thetaMajor),  
            lWide + lSupport + rFillet]

        vertDOps=[(-lThick - lSupport+rMajor)*Math.cos((j+1)*thetaMajor), 
            (-lThick - lSupport+rMajor)*Math.sin((j+1)*thetaMajor),  
            lWide + lSupport + rFillet]

        normalAOps=[ 0,  0,  1]
        normalBOps=[ 0,  0,  1]
        normalCOps=[ 0,  0,  1]
        normalDOps=[ 0,  0,  1]
        uvAOps=[0, 0]
        uvBOps=[1, 0]
        uvCOps=[1, 1]
        uvDOps=[0, 1]
        innerMakeQuad();

            //front right

        vertAOps=[(lThick +rMajor)*Math.cos(j*thetaMajor), 
            (lThick +rMajor)*Math.sin(j*thetaMajor),  
            lWide + lSupport + rFillet]

        vertBOps=[ (lThick+ lSupport+rMajor)*Math.cos(j*thetaMajor), 
            (lThick + lSupport+rMajor)*Math.sin(j*thetaMajor),  
            lWide + lSupport + rFillet]

        vertCOps=[ (lThick+ lSupport+rMajor)*Math.cos((j+1)*thetaMajor), 
            (lThick+ lSupport+rMajor)*Math.sin((j+1)*thetaMajor),  
            lWide + lSupport + rFillet]

        vertDOps=[(lThick +rMajor)*Math.cos((j+1)*thetaMajor), 
            (lThick +rMajor)*Math.sin((j+1)*thetaMajor),  
            lWide + lSupport + rFillet]

        normalAOps=[ Math.cos(j*thetaMajor),  Math.sin(j*thetaMajor),  0]
        normalBOps=[ Math.cos(j*thetaMajor),  Math.sin(j*thetaMajor),  0]
        normalCOps=[ Math.cos((j+1)*thetaMajor),  Math.sin((j+1)*thetaMajor),  0]
        normalDOps=[ Math.cos((j+1)*thetaMajor),  Math.sin((j+1)*thetaMajor),  0]
        uvAOps=[0, 0]
        uvBOps=[1, 0]
        uvCOps=[1, 1]
        uvDOps=[0, 1]
        innerMakeQuad();

        //right front ("right side" when facing it)

        vertAOps=[ (lThick + lSupport + rFillet+rMajor)*Math.cos(j*thetaMajor), 
            (lThick + lSupport + rFillet+rMajor)*Math.sin(j*thetaMajor),  
                    -lWide]

        vertBOps=[ (lThick + lSupport + rFillet+rMajor)*Math.cos(j*thetaMajor), 
            (lThick + lSupport + rFillet+rMajor)*Math.sin(j*thetaMajor), 
                     -lWide-lSupport]

        vertCOps=[ (lThick + lSupport + rFillet+rMajor)*Math.cos((j+1)*thetaMajor), 
            (lThick + lSupport + rFillet+rMajor)*Math.sin((j+1)*thetaMajor), 
                    -lWide-lSupport]

        vertDOps=[ (lThick + lSupport + rFillet+rMajor)*Math.cos((j+1)*thetaMajor),
            (lThick + lSupport + rFillet+rMajor)*Math.sin((j+1)*thetaMajor),  
                     -lWide]
        
        normalAOps=[ Math.cos(j*thetaMajor),  Math.sin(j*thetaMajor),  0]
        normalBOps=[ Math.cos(j*thetaMajor),  Math.sin(j*thetaMajor),  0]
        normalCOps=[ Math.cos((j+1)*thetaMajor),  Math.sin((j+1)*thetaMajor),  0]
        normalDOps=[ Math.cos((j+1)*thetaMajor),  Math.sin((j+1)*thetaMajor),  0]
        uvAOps=[0, 0]
        uvBOps=[1, 0]
        uvCOps=[1, 1]
        uvDOps=[0, 1]
        innerMakeQuad();

        //right back ("left side" when facing it)

        vertAOps=[ (lThick + lSupport + rFillet+rMajor)*Math.cos(j*thetaMajor), 
            (lThick + lSupport + rFillet+rMajor)*Math.sin(j*thetaMajor),  
                    lWide+lSupport]

        vertBOps=[ (lThick + lSupport + rFillet+rMajor)*Math.cos(j*thetaMajor), 
            (lThick + lSupport + rFillet+rMajor)*Math.sin(j*thetaMajor), 
                     lWide]

        vertCOps=[ (lThick + lSupport + rFillet+rMajor)*Math.cos((j+1)*thetaMajor), 
            (lThick + lSupport + rFillet+rMajor)*Math.sin((j+1)*thetaMajor), 
                    lWide]

        vertDOps=[ (lThick + lSupport + rFillet+rMajor)*Math.cos((j+1)*thetaMajor),
            (lThick + lSupport + rFillet+rMajor)*Math.sin((j+1)*thetaMajor),  
                     lWide+lSupport]

        normalAOps=[ Math.cos(j*thetaMajor),  Math.sin(j*thetaMajor),  0]
        normalBOps=[ Math.cos(j*thetaMajor),  Math.sin(j*thetaMajor),  0]
        normalCOps=[ Math.cos((j+1)*thetaMajor),  Math.sin((j+1)*thetaMajor),  0]
        normalDOps=[ Math.cos((j+1)*thetaMajor),  Math.sin((j+1)*thetaMajor),  0]
        uvAOps=[0, 0]
        uvBOps=[1, 0]
        uvCOps=[1, 1]
        uvDOps=[0, 1]
        innerMakeQuad();


            //back left
            // vertAOps=[-(lThick+0)+rMajor, 0*lSection+2*j*lSection, -(lWide + lSupport + rFillet)]
            // vertBOps=[-(lThick+lSupport)+rMajor, 0*lSection+2*j*lSection, -(lWide + lSupport + rFillet)]
            // vertCOps=[-(lThick+lSupport)+rMajor, 2*lSection+2*j*lSection, -(lWide + lSupport + rFillet)]
            // vertDOps=[-(lThick+0)+rMajor, 2*lSection+2*j*lSection, -(lWide + lSupport + rFillet)]

            vertAOps=[ (-lThick+rMajor)*Math.cos(j*thetaMajor), 
                (-lThick+rMajor)*Math.sin(j*thetaMajor),
                 -(lWide + lSupport + rFillet)]
                 
            vertBOps=[(-lThick-lSupport+rMajor)*Math.cos(j*thetaMajor), 
                 (-lThick-lSupport+rMajor)*Math.sin(j*thetaMajor),
                 -(lWide + lSupport + rFillet)]
                 
            vertCOps=[(-lThick-lSupport+rMajor)*Math.cos((j+1)*thetaMajor), 
                (-lThick-lSupport+rMajor)*Math.sin((j+1)*thetaMajor),
                 -(lWide + lSupport + rFillet)]
                 
            vertDOps=[ (-lThick+rMajor)*Math.cos((j+1)*thetaMajor), 
                (-lThick+rMajor)*Math.sin((j+1)*thetaMajor),
                 -(lWide + lSupport + rFillet)]

            normalAOps=[ 0,  0,  -1]
            normalBOps=[ 0,  0,  -1]
            normalCOps=[ 0,  0,  -1]
            normalDOps=[ 0,  0,  -1]
            uvAOps=[0, 0]
            uvBOps=[1, 0]
            uvCOps=[1, 1]
            uvDOps=[0, 1]
            innerMakeQuad();

            //back right
            // vertAOps=[ (lThick+lSupport)+rMajor, 0*lSection+2*j*lSection, -(lWide + lSupport + rFillet)]
            // vertBOps=[(lThick+0)+rMajor, 0*lSection+2*j*lSection, -(lWide + lSupport + rFillet)]
            // vertCOps=[(lThick+0)+rMajor, 2*lSection+2*j*lSection, -(lWide + lSupport + rFillet)]
            // vertDOps=[ (lThick+lSupport)+rMajor, 2*lSection+2*j*lSection, -(lWide + lSupport + rFillet)]
            
            vertAOps=[ (lThick+lSupport+rMajor)*Math.cos(j*thetaMajor), 
                (lThick+lSupport+rMajor)*Math.sin(j*thetaMajor),
                 -(lWide + lSupport + rFillet)]
                 
            vertBOps=[(lThick+rMajor)*Math.cos(j*thetaMajor), 
                 (lThick+rMajor)*Math.sin(j*thetaMajor),
                 -(lWide + lSupport + rFillet)]
                 
            vertCOps=[(lThick+rMajor)*Math.cos((j+1)*thetaMajor), 
                (lThick+rMajor)*Math.sin((j+1)*thetaMajor),
                 -(lWide + lSupport + rFillet)]
                 
            vertDOps=[ (lThick+lSupport+rMajor)*Math.cos((j+1)*thetaMajor), 
                (lThick+lSupport+rMajor)*Math.sin((j+1)*thetaMajor),
                 -(lWide + lSupport + rFillet)]

            normalAOps=[ 0,  0,  -1]
            normalBOps=[ 0,  0,  -1]
            normalCOps=[ 0,  0,  -1]
            normalDOps=[ 0,  0,  -1]
            uvAOps=[0, 0]
            uvBOps=[1, 0]
            uvCOps=[1, 1]
            uvDOps=[0, 1]
            innerMakeQuad();

            //left front ("left side when facing it") inner ring
            // vertAOps=[-(lThick + lSupport + rFillet)+rMajor, 0*lSection+2*j*lSection, -(lWide+lSupport)]
            // vertBOps=[-(lThick + lSupport + rFillet)+rMajor, 0*lSection+2*j*lSection,  -(lWide+0)]
            // vertCOps=[-(lThick + lSupport + rFillet)+rMajor, 2*lSection+2*j*lSection,  -(lWide+0)]
            // vertDOps=[-(lThick + lSupport + rFillet)+rMajor, 2*lSection+2*j*lSection, -(lWide+lSupport)]


            vertAOps=[(-lThick - lSupport - rFillet+rMajor)*Math.cos(j*thetaMajor),
                (-lThick - lSupport - rFillet+rMajor)*Math.sin(j*thetaMajor), 
                 -lWide-lSupport]
    
            vertBOps=[(-lThick - lSupport - rFillet+rMajor)*Math.cos(j*thetaMajor),
                (-lThick - lSupport - rFillet+rMajor)*Math.sin(j*thetaMajor),  
                -lWide]
    
            vertCOps=[(-lThick - lSupport - rFillet+rMajor)*Math.cos((j+1)*thetaMajor), 
                (-lThick - lSupport - rFillet+rMajor)*Math.sin((j+1)*thetaMajor),  
                -lWide]
    
            vertDOps=[(-lThick - lSupport - rFillet+rMajor)*Math.cos((j+1)*thetaMajor), 
                (-lThick - lSupport - rFillet+rMajor)*Math.sin((j+1)*thetaMajor), 
                -lWide-lSupport]

            normalAOps=[ -Math.cos(j*thetaMajor),  -Math.sin(j*thetaMajor),  0]
            normalBOps=[ -Math.cos(j*thetaMajor),  -Math.sin(j*thetaMajor),  0]
            normalCOps=[ -Math.cos((j+1)*thetaMajor),  -Math.sin((j+1)*thetaMajor),  0]
            normalDOps=[ -Math.cos((j+1)*thetaMajor),  -Math.sin((j+1)*thetaMajor),  0]
            uvAOps=[0, 0]
            uvBOps=[1, 0]
            uvCOps=[1, 1]
            uvDOps=[0, 1]
            innerMakeQuad();
            //left back ("right side when facing it") inner ring
            // vertAOps=[-(lThick + lSupport + rFillet)+rMajor, 0*lSection+2*j*lSection, (lWide+0)]
            // vertBOps=[-(lThick + lSupport + rFillet)+rMajor, 0*lSection+2*j*lSection,  (lWide+lSupport)]
            // vertCOps=[-(lThick + lSupport + rFillet)+rMajor, 2*lSection+2*j*lSection,  (lWide+lSupport)]
            // vertDOps=[-(lThick + lSupport + rFillet)+rMajor, 2*lSection+2*j*lSection, (lWide+0)]

            vertAOps=[(-lThick - lSupport - rFillet+rMajor)*Math.cos(j*thetaMajor),
                (-lThick - lSupport - rFillet+rMajor)*Math.sin(j*thetaMajor), 
                 lWide]
    
            vertBOps=[(-lThick - lSupport - rFillet+rMajor)*Math.cos(j*thetaMajor),
                (-lThick - lSupport - rFillet+rMajor)*Math.sin(j*thetaMajor),  
                lWide+lSupport]
    
            vertCOps=[(-lThick - lSupport - rFillet+rMajor)*Math.cos((j+1)*thetaMajor), 
                (-lThick - lSupport - rFillet+rMajor)*Math.sin((j+1)*thetaMajor),  
                lWide+lSupport]
    
            vertDOps=[(-lThick - lSupport - rFillet+rMajor)*Math.cos((j+1)*thetaMajor), 
                (-lThick - lSupport - rFillet+rMajor)*Math.sin((j+1)*thetaMajor), 
                lWide]

            normalAOps=[ -Math.cos(j*thetaMajor),  -Math.sin(j*thetaMajor),  0]
            normalBOps=[ -Math.cos(j*thetaMajor),  -Math.sin(j*thetaMajor),  0]
            normalCOps=[ -Math.cos((j+1)*thetaMajor),  -Math.sin((j+1)*thetaMajor),  0]
            normalDOps=[ -Math.cos((j+1)*thetaMajor),  -Math.sin((j+1)*thetaMajor),  0]
            uvAOps=[0, 0]
            uvBOps=[1, 0]
            uvCOps=[1, 1]
            uvDOps=[0, 1]
            innerMakeQuad();


        }

        {//fillet rounds
            //F->R (front to outer rim)
                //loop "number of edges" times. Adapt to function.

            for(let i=0;i< noOfFilletEdges+1;i++){
                    // let theta = filletTurnAngle;
                    vertAOps=[((lThick + lSupport+rFillet*(Math.sin(i*filletTurnAngle)))+rMajor)*Math.cos(j*thetaMajor), 
                        ((lThick + lSupport+rFillet*(Math.sin(i*filletTurnAngle)))+rMajor)*Math.sin(j*thetaMajor),  
                        lWide + lSupport + rFillet*(Math.cos(i*filletTurnAngle))]

                    vertBOps=[ ((lThick + lSupport + rFillet*(Math.sin((i+1)*filletTurnAngle)) )+rMajor)*Math.cos(j*thetaMajor), 
                        ((lThick + lSupport + rFillet*(Math.sin((i+1)*filletTurnAngle)) )+rMajor)*Math.sin(j*thetaMajor),  
                        lWide + lSupport + rFillet*(Math.cos((i+1)*filletTurnAngle))]

                    vertCOps=[ ((lThick + lSupport+ rFillet*(Math.sin((i+1)*filletTurnAngle)))+rMajor)*Math.cos((j+1)*thetaMajor),
                        ((lThick + lSupport+ rFillet*(Math.sin((i+1)*filletTurnAngle)))+rMajor)*Math.sin((j+1)*thetaMajor),  
                         lWide + lSupport + rFillet*(Math.cos((i+1)*filletTurnAngle))]

                    vertDOps=[((lThick + lSupport +rFillet*(Math.sin(i*filletTurnAngle)))+rMajor)*Math.cos((j+1)*thetaMajor), 
                        ((lThick + lSupport +rFillet*(Math.sin(i*filletTurnAngle)))+rMajor)*Math.sin((j+1)*thetaMajor),  
                        lWide + lSupport + rFillet*(Math.cos(i*filletTurnAngle)) ]

                    normalAOps=[ (Math.sin(i*filletTurnAngle))*Math.cos(j*thetaMajor),  0,  (Math.cos(i*filletTurnAngle))]
                    normalBOps=[ (Math.sin((i+1)*filletTurnAngle))*Math.cos(j*thetaMajor),  0,  (Math.cos((i+1)*filletTurnAngle))]
                    normalCOps=[ (Math.sin((i+1)*filletTurnAngle))*Math.cos((j+1)*thetaMajor),  (Math.sin((i+1)*filletTurnAngle))*Math.sin((j+1)*thetaMajor),  (Math.cos((i+1)*filletTurnAngle))]
                    normalDOps=[ (Math.sin(i*filletTurnAngle))*Math.cos((j+1)*thetaMajor),  (Math.sin(i*filletTurnAngle))*Math.sin((j+1)*thetaMajor),  (Math.cos(i*filletTurnAngle))]

                    uvAOps=[0, 0]
                    uvBOps=[1, 0]
                    uvCOps=[1, 1]
                    uvDOps=[0, 1]
                    innerMakeQuad();
                }
            //R->B
                
            for(let i=0;i< noOfFilletEdges+1;i++){
                    vertAOps=[ (lThick + lSupport + rFillet*(Math.cos(i*filletTurnAngle))+rMajor)*Math.cos(j*thetaMajor), 
                        (lThick + lSupport + rFillet*(Math.cos(i*filletTurnAngle))+rMajor)*Math.sin(j*thetaMajor),  
                        -(lWide + lSupport+rFillet*(Math.sin(i*filletTurnAngle)))]

                    vertBOps=[ (lThick + lSupport + rFillet*(Math.cos((i+1)*filletTurnAngle))+rMajor)*Math.cos(j*thetaMajor), 
                        (lThick + lSupport + rFillet*(Math.cos((i+1)*filletTurnAngle))+rMajor)*Math.sin(j*thetaMajor), 
                        -(lWide + lSupport+rFillet*(Math.sin((i+1)*filletTurnAngle)))]

                    vertCOps=[ (lThick + lSupport + rFillet*(Math.cos((i+1)*filletTurnAngle))+rMajor)*Math.cos((j+1)*thetaMajor), 
                        (lThick + lSupport + rFillet*(Math.cos((i+1)*filletTurnAngle))+rMajor)*Math.sin((j+1)*thetaMajor), 
                        -(lWide + lSupport+rFillet*(Math.sin((i+1)*filletTurnAngle)))]

                    vertDOps=[ (lThick + lSupport + rFillet*(Math.cos(i*filletTurnAngle))+rMajor)*Math.cos((j+1)*thetaMajor), 
                        (lThick + lSupport + rFillet*(Math.cos(i*filletTurnAngle))+rMajor)*Math.sin((j+1)*thetaMajor),  
                        -(lWide + lSupport+rFillet*(Math.sin(i*filletTurnAngle)))]

                    normalAOps=[ (Math.cos(i*filletTurnAngle)),  0,  -(Math.sin(i*filletTurnAngle))]
                    normalBOps=[ (Math.cos((i+1)*filletTurnAngle)),  0,  -(Math.sin((i+1)*filletTurnAngle))]
                    normalCOps=[ (Math.cos((i+1)*filletTurnAngle)),  0,  -(Math.sin((i+1)*filletTurnAngle))]
                    normalDOps=[ (Math.cos(i*filletTurnAngle)),  0,  -(Math.sin(i*filletTurnAngle))]
                    uvAOps=[0, 0]
                    uvBOps=[1, 0]
                    uvCOps=[1, 1]
                    uvDOps=[0, 1]
                    innerMakeQuad();
                }
            //B->L
            for(let i=0;i< noOfFilletEdges+1;i++){
                vertAOps=[(-(lThick + lSupport +rFillet*(Math.sin(i*filletTurnAngle)))+rMajor)*Math.cos(j*thetaMajor), 
                    (-(lThick + lSupport +rFillet*(Math.sin(i*filletTurnAngle)))+rMajor)*Math.sin(j*thetaMajor), 
                    -(lWide + lSupport + rFillet*(Math.cos(i*filletTurnAngle)))]

                vertBOps=[(-(lThick + lSupport +rFillet*(Math.sin((i+1)*filletTurnAngle)))+rMajor)*Math.cos((j)*thetaMajor),
                    (-(lThick + lSupport +rFillet*(Math.sin((i+1)*filletTurnAngle)))+rMajor)*Math.sin((j)*thetaMajor), 
                    -(lWide + lSupport + rFillet*(Math.cos((i+1)*filletTurnAngle)))]

                vertCOps=[(-(lThick + lSupport +rFillet*(Math.sin((i+1)*filletTurnAngle)))+rMajor)*Math.cos((j+1)*thetaMajor), 
                    (-(lThick + lSupport +rFillet*(Math.sin((i+1)*filletTurnAngle)))+rMajor)*Math.sin((j+1)*thetaMajor), 
                    -(lWide + lSupport + rFillet*(Math.cos((i+1)*filletTurnAngle)))]

                vertDOps=[(-(lThick + lSupport +rFillet*(Math.sin(i*filletTurnAngle)))+rMajor)*Math.cos((j+1)*thetaMajor),
                    (-(lThick + lSupport +rFillet*(Math.sin(i*filletTurnAngle)))+rMajor)*Math.sin((j+1)*thetaMajor), 
                    -(lWide + lSupport + rFillet*(Math.cos(i*filletTurnAngle)))]

                normalAOps=[ 0,0,-1]
                normalBOps=[ 0,0,-1]
                normalCOps=[ 0,0,-1]
                normalDOps=[ 0,0,-1]
                uvAOps=[0, 0]
                uvBOps=[1, 0]
                uvCOps=[1, 1]
                uvDOps=[0, 1]
                innerMakeQuad();
            }
            //L->F
            for(let i=0;i< noOfFilletEdges+1;i++){
                vertAOps=[(-(lThick + lSupport + rFillet*(Math.cos(i*filletTurnAngle)))+rMajor)*Math.cos(j*thetaMajor), 
                    (-(lThick + lSupport + rFillet*(Math.cos(i*filletTurnAngle)))+rMajor)*Math.sin(j*thetaMajor), 
                    (lWide + lSupport +rFillet*(Math.sin(i*filletTurnAngle)))]

                vertBOps=[(-(lThick + lSupport + rFillet*(Math.cos((i+1)*filletTurnAngle)))+rMajor)*Math.cos(j*thetaMajor), 
                    (-(lThick + lSupport + rFillet*(Math.cos((i+1)*filletTurnAngle)))+rMajor)*Math.sin(j*thetaMajor),  
                    (lWide + lSupport +rFillet*(Math.sin((i+1)*filletTurnAngle)))]

                vertCOps=[(-(lThick + lSupport + rFillet*(Math.cos((i+1)*filletTurnAngle)))+rMajor)*Math.cos((j+1)*thetaMajor), 
                    (-(lThick + lSupport + rFillet*(Math.cos((i+1)*filletTurnAngle)))+rMajor)*Math.sin((j+1)*thetaMajor),  
                    (lWide + lSupport +rFillet*(Math.sin((i+1)*filletTurnAngle)))]

                vertDOps=[(-(lThick + lSupport + rFillet*(Math.cos(i*filletTurnAngle)))+rMajor)*Math.cos((j+1)*thetaMajor), 
                    (-(lThick + lSupport + rFillet*(Math.cos(i*filletTurnAngle)))+rMajor)*Math.sin((j+1)*thetaMajor), 
                    (lWide + lSupport +rFillet*(Math.sin(i*filletTurnAngle)))]

                normalAOps=[ -(Math.cos(i*filletTurnAngle))*Math.cos(j*thetaMajor),   -(Math.cos(i*filletTurnAngle))*Math.sin(j*thetaMajor),  (Math.sin(i*filletTurnAngle))]
                normalBOps=[ -(Math.cos((i+1)*filletTurnAngle))*Math.cos(j*thetaMajor),  -(Math.cos((i+1)*filletTurnAngle))*Math.sin(j*thetaMajor),  (Math.sin((i+1)*filletTurnAngle))]

                normalCOps=[ -(Math.cos((i+1)*filletTurnAngle)),  0,  (Math.sin((i+1)*filletTurnAngle))]
                normalDOps=[ -(Math.cos(i*filletTurnAngle)),  0,  (Math.sin(i*filletTurnAngle))]

                uvAOps=[0, 0]
                uvBOps=[1, 0]
                uvCOps=[1, 1]
                uvDOps=[0, 1]
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
        
        for(const vertex of cubeVerts){
            positions.push(...vertex.pos);
            // normals.push(...vertex.norm);
            uvs.push(...vertex.uv);
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
        
        
        const loader = new THREE.TextureLoader();
          const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/star.png');
        
        const material_z = new THREE.MeshPhongMaterial({color: 0xcccc00, map:texture});
        const material = new THREE.MeshStandardMaterial( { color: 0xfefefe, roughness:0.6 } );

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


            return cubez;
    },

    // make: function(){
    //     console.log("this is from ring buffer MAAAKE")
    //     return "tested";
    // }

}

export {RingBufferGeo};