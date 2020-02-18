function uniCharCode(event) {
    var char = event.which || event.keyCode;
    // document.getElementById("heading").style.color = "red";
    // document.getElementById("heading").innerHTML = char;

    if(char === 38){//up arrow press
    glMatrix.mat4.translate(viewMatrix,viewMatrix, [0, 0 , 0.1]);
    }

    if(char === 40){//down arrow press
    glMatrix.mat4.translate(viewMatrix,viewMatrix, [0, 0 , -0.1]);
    }

    if(char === 37){//left arrow press
        glMatrix.mat4.rotateY(modelMatrix, modelMatrix, -0.03);
    // glMatrix.mat4.translate(viewMatrix,viewMatrix, [0, 0 , -0.1]);
    }

    if(char === 39){//right arrow press
        glMatrix.mat4.rotateY(modelMatrix, modelMatrix, 0.03);
    // glMatrix.mat4.translate(viewMatrix,viewMatrix, [0, 0 , -0.1]);
    }
  }

  function revert(event){
    // document.getElementById("heading").style.color = "black";
  }

  //left - 37
  //up   - 38
  //right- 39
  //down - 40

  

var x;
var y;
var cartX;
var cartY;
var xRot;
var yRot;

document.addEventListener('mousemove', onMouseMove, false);

function onMouseMove(e){
    x = e.clientX;
    y = e.clientY;

    cartX = x-(document.documentElement.clientWidth/2);
    cartY = (document.documentElement.clientHeight/2)-y;


    xRot = (-1)*0.79 * cartX * 2/ document.documentElement.clientWidth;
    yRot = 0.79 * cartY * 2/ document.documentElement.clientHeight;
    // document.getElementById("heading").innerHTML = "("+cartX+","+cartY+")";
    // document.getElementById("heading").style.color = "red";

    var xRotBuffMat = glMatrix.mat4.create(); 
    var yRotBuffMat = glMatrix.mat4.create(); 
    
    glMatrix.mat4.fromXRotation(xRotBuffMat, yRot);
    glMatrix.mat4.fromYRotation(yRotBuffMat, xRot);
    glMatrix.mat4.multiply(modelMatrix,xRotBuffMat,yRotBuffMat);
    glMatrix.mat4.scale(modelMatrix,modelMatrix,[1.5,1.5,1.5]);

    //extremes are .79 rad in each direction
}

function getMouseX() {
    return x;
}

function getMouseY() {
    return y;
}

