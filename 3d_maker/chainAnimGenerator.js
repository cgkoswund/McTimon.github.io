
import {GearGenerator} from './GearGenerator.js';
/*

-generate current point on curve
-pick previous and next points and calc respective angles
-return angles for current point so it can be applied to mesh
-take speed as input to move points along

*/

//curve


let curvePoints = [];
let calculateChainLength = function(rearTeethCount, frontTeethCount){
//chain length = arcL + arcR + 2L
//arcL = 2*Pi*rL*thetaL/360
//arcR = 2*Pi*rR*thetaR/360
//L = squareRoot(sprocketCentreInterval^2 - abs(rR-rL)^2)

let rL = GearGenerator.radius(rearTeethCount);
let rR = GearGenerator.radius(frontTeethCount);
// console.log(rL);
// console.log(rR);
const aMax = Math.atan(Math.abs(rR-rL)/GearGenerator.sprocketCentreInterval);
let thetaL = Math.PI - 2*aMax;
let thetaR = Math.PI + 2*aMax;
let L = Math.sqrt(GearGenerator.sprocketCentreInterval**2 - Math.abs(rR-rL)**2);
// console.log(L);
let arcL = 2*Math.PI*rL*thetaL/(2*Math.PI);
let arcR = 2*Math.PI*rR*thetaR/(2*Math.PI);
let chainLength = arcL + arcR + 2*L;
return [chainLength,arcL,arcR,L];
//arcL = 2*Pi*rL*thetaL/360
//arcR = 2*Pi*rR*thetaR/360
//L = squareRoot(sprocketCentreInterval^2 - abs(rR-rL)^2)
}
let ChainAnimGenerator = {
    points: function(rearTeethCount, frontTeethCount){
        let chainParams = calculateChainLength(rearTeethCount,frontTeethCount);
        const singleChainLength = GearGenerator.chainLinkLength;
        const chainLength = chainParams[0];
        const noOfLinks = Math.floor(chainLength/singleChainLength);
        const arcL = chainParams[1];
        const arcR = chainParams[2];
        const L = chainParams[3];
        const arcLRatio = arcL/chainLength;
        const arcRatio = arcR/chainLength;
        const LRatio = L/chainLength;

        for(let i = 0; i < Math.ceil(arcLRatio*noOfLinks);i++){}//position arcL links
        for(let i = 0; i < Math.ceil(LRatio*noOfLinks);i++){}//position L lower links
        for(let i = 0; i < Math.ceil(arcRatio*noOfLinks);i++){}//position arcR links
        for(let i = 0; i < Math.ceil(LRatio*noOfLinks);i++){}//position L above links

        // console.log(noOfLinks);
        chainParams.push(noOfLinks);
        // console.log("Single chain length: ");
        // console.log(singleChainLength);
        
        

        //iterator drives animation in 4 parts: arcL, L(lower), arcR, L(above)
        return chainParams;
    }

    
}

export {ChainAnimGenerator};