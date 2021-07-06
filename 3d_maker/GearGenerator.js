const carWidth = 0.05;


const GearGenerator = {//shared parameters
    extrudeSettings: {
        steps: 2,
        depth: carWidth/2,
        bevelEnabled: true,
        bevelThickness: carWidth/6,
        bevelSize: carWidth/6,
        bevelOffset: -carWidth/2,
        bevelSegments: 2
    },

    radius: function(teethCount){
        let radius = 2*teethCount/42;
        return radius
    },

    carWidth : carWidth,
    carHeight : 0.15,
    carLength : 0.4,
    sprocketCentreInterval: 2 + 5 + 5,
    wheelRadius  :.1,
    wheelThickness : .05,
    wheelSegments : 16,
    noOfLinks : 134,
    radiusRMax: 5
};

var leftGearPoints = function(teethCount,radiusToTeethRatio,attackAngle,chainLinkHeight){
    const d = 0;
    return gearPoints(teethCount,radiusToTeethRatio,attackAngle,chainLinkHeight, d);
};
let rightGearPoints = function(teethCount,radiusToTeethRatio,attackAngle,chainLinkHeight){
    const d = GearGenerator.sprocketCentreInterval;
    return gearPoints(teethCount,radiusToTeethRatio,attackAngle,chainLinkHeight, d);;
};

let gearPoints = function(teethCount,radiusToTeethRatio,attackAngle,chainLinkHeight, d){

    let radiusR = GearGenerator.radiusRMax;
    const steps = 6;
    let handleOffsetScale = 1.15;
    let rad = Math.PI*2/steps;
    let radiusGearNew=GearGenerator.radius(teethCount);
    let generatedPoints = [];

    for(let i = 0; i<steps+1;i++){
        generatedPoints.push([handleOffsetScale*radiusGearNew*Math.cos(rad*(i-0.5))+d,
        handleOffsetScale*radiusGearNew*Math.sin(rad*(i-0.5))+radiusR,
        radiusGearNew*Math.cos(rad*(i))+d,
        radiusGearNew*Math.sin(rad*(i))+radiusR]);
    }

    return generatedPoints;
};



export {leftGearPoints,rightGearPoints,GearGenerator};