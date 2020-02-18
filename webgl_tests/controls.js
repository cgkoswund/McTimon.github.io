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
    document.getElementById("heading").style.color = "black";
  }

  //left - 37
  //up   - 38
  //right- 39
  //down - 40