let MeshXTriOps = {
    makePokedFace : function(vertA,vertB,vertC,vertD,normalA,normalB,normalC,normalD,uvA,uvB,uvC,uvD){
        let sixVertsArray = [];
        let vertX = [
           (vertA[0]+vertB[0]+vertC[0]+vertD[0])/4,//supposed to be extremes/2 but user might mess up order
           ((vertA[1]+vertB[1]+vertC[1]+vertD[1])/4),
           (vertA[2]+vertB[2]+vertC[2]+vertD[2])/4
      
      ]
        // let ringVerts = [];

        let vert = {
            pos: vertA, 
            norm: normalA, 
            uv: uvA
         }
         sixVertsArray.push(vert);
         
         vert = {
            pos: vertX, 
            norm: normalC, 
            uv: uvC
         }
         sixVertsArray.push(vert);

         vert = {
            pos: vertB, 
            norm: normalB, 
            uv: uvB
         }
         sixVertsArray.push(vert);
         ///////////////////////////////////////
         vert = {
            pos: vertB, 
            norm: normalC, 
            uv: uvC 
         }
         sixVertsArray.push(vert);
         
         vert = {
            pos: vertX, 
            norm: normalA, 
            uv: uvA 
         }
         sixVertsArray.push(vert);

         vert = {
            pos: vertC, 
            norm: normalD, 
            uv: uvD 
         }
         sixVertsArray.push(vert);

         ///////////////////////////////////////
         vert = {
            pos: vertC, 
            norm: normalC, 
            uv: uvC 
         }
         sixVertsArray.push(vert);

         vert = {
            pos: vertX, 
            norm: normalA, 
            uv: uvA 
         }
         sixVertsArray.push(vert);

         vert = {
            pos: vertD, 
            norm: normalD, 
            uv: uvD 
         }
         sixVertsArray.push(vert);
         ///////////////////////////////////////
         vert = {
            pos: vertD, 
            norm: normalC, 
            uv: uvC 
         }
         sixVertsArray.push(vert);
         
         vert = {
            pos: vertX, 
            norm: normalA, 
            uv: uvA 
         }
         sixVertsArray.push(vert);

         vert = {
            pos: vertA, 
            norm: normalD, 
            uv: uvD 
         }
         sixVertsArray.push(vert);

         ///////////////////////////////////////

        return sixVertsArray;
    },
    makeInvertedQuadFace : function(vertA,vertB,vertC,vertD,normalA,normalB,normalC,normalD,uvA,uvB,uvC,uvD){
        let sixVertsArray = [];
        // let ringVerts = [];



        let vert = {
            pos: vertB, 
            norm: normalB, 
            uv: uvB
         }
         sixVertsArray.push(vert);

          vert = {
            pos: vertA, 
            norm: normalA, 
            uv: uvA
         }
         sixVertsArray.push(vert);

         vert = {
            pos: vertC, 
            norm: normalC, 
            uv: uvC
         }
         sixVertsArray.push(vert);
         ///////////////////////////////////////
         vert = {
            pos: vertC, 
            norm: normalC, 
            uv: uvC 
         }
         sixVertsArray.push(vert);


         vert = {
            pos: vertA, 
            norm: normalA, 
            uv: uvA 
         }
         sixVertsArray.push(vert);

         vert = {
            pos: vertD, 
            norm: normalD, 
            uv: uvD 
         }
         sixVertsArray.push(vert);

         ///////////////////////////////////////

        return sixVertsArray;
    },
    mirror: function(){},
    mirrorAndDuplicate: function(){},
    duplicate: function(){},
    rotate: function(){},
    

}

export {MeshXTriOps};