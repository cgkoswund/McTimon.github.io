//moving camera n beyond (from invent box tutorials youtube channel)


const canvas  = document.querySelector('canvas');
const gl =  canvas.getContext('webgl');

if(!gl){
    throw new Error('WebGL not supported');
}

const vertexData = [//box vertices per face triangle
    //f,r,b,l,top,bot

    //front t1
    1,1,1,
    1,1,-1,
    1,-1,1,

    //front t2
    1,-1,1,
    1,1,-1,
    1,-1,-1,

    //right t1
    -1,1,1,
    -1,1,-1,
    1,1,1,

    //right t2
    1,1,1,
    -1,1,-1,
    1,1,-1,

    //back t1
    -1,-1,1,
    -1,-1,-1,
    -1,1,1,
    
    //back t2
    -1,1,1,
    -1,-1,-1,
    -1,1,-1,

    //left t1
    1,-1,1,
    1,-1,-1,
    -1,-1,1,

    //left t2
    -1,-1,1,
    1,-1,-1,
    -1,-1,-1,

    //top t1
    -1,-1,1,
    -1,1,1,
    1,-1,1,


    //top t2
    1,-1,1,
    -1,1,1,
    1,1,1,

    //bot t1
    -1,-1,-1,
    -1,1,-1,
    1,-1,-1,

    //bot t2
    1,-1,-1,
    -1,1,-1,
    1,1,-1,
];

console.log(vertexData);

// const colourData = [
//     1,0,0, //vertex 1 colour
//     0,1,0, //vertex 2 colour
//     0,0,1, //vertex 3 colour
// ];

function randomColour(){
    return [Math.random(),Math.random(),Math.random()];
}

let colourData = [];

for (let face = 0; face < 6; face++){
    let faceColour = randomColour();
    for(let vertex = 0; vertex < 6; vertex++){
        colourData.push(...faceColour);
    }
}

console.log(colourData);



const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

const colourBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colourData), gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader,`
                precision mediump float;
                attribute vec3 position;
                attribute vec3 colour;
                varying vec3 vColour;

                uniform mat4 matrix;

                void main(){
                    vColour = colour;
                    gl_Position = matrix * vec4(position, 1);
                }
                
                `);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader,`

                precision mediump float;
                varying vec3 vColour;

                void main(){
                    gl_FragColor = vec4(vColour,1);
                }

`);

gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program,vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

const colourLocation = gl.getAttribLocation(program, `colour`);
gl.enableVertexAttribArray(colourLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer);
gl.vertexAttribPointer(colourLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);

const uniformLocations = {
    matrix: gl.getUniformLocation(program,`matrix`),
}

const modelMatrix = glMatrix.mat4.create();
const viewMatrix = glMatrix.mat4.create();

const projectionMatrix = glMatrix.mat4.create();
glMatrix.mat4.perspective(projectionMatrix,
    75*Math.PI/180,
    canvas.width/canvas.height,
    1e-4,
    1e+4 
    );

    const mvMatrix = glMatrix.mat4.create();
    const finalMatrix = glMatrix.mat4.create();

glMatrix.mat4.translate(modelMatrix,modelMatrix, [.2, .5 , -2]);
glMatrix.mat4.translate(viewMatrix,viewMatrix, [-.1, 0.5 , 1]);
glMatrix.mat4.invert(viewMatrix,viewMatrix);


glMatrix.mat4.scale(modelMatrix,modelMatrix,[0.5,0.5,0.5]);

function animate() {
    requestAnimationFrame(animate);

    glMatrix.mat4.rotateZ(modelMatrix, modelMatrix, Math.PI/2 / 70);
    glMatrix.mat4.rotateX(modelMatrix, modelMatrix, Math.PI/2 / 90);

    glMatrix.mat4.multiply(mvMatrix,viewMatrix,modelMatrix);
    glMatrix.mat4.multiply(finalMatrix,projectionMatrix,mvMatrix);
    // glMatrix.mat4.multiply(finalMatrix,projectionMatrix,modelMatrix);

    gl.uniformMatrix4fv(uniformLocations.matrix, false, finalMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
}

animate();