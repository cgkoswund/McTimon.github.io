const canvas  = document.querySelector('canvas');
const gl =  canvas.getContext('webgl');

if(!gl){
    throw new Error('WebGL not supported');
}

alert("Everything's peachy here");

const vertexData = [
    0,1,0, //vertex 1 location
    0.577,-1,0, //vertex 2 location
    -0.577,-1,0, //vertex 3 location
];

console.log(vertexData);

const colourData = [
    1,0,0, //vertex 1 colour
    0,1,0, //vertex 2 colour
    0,0,1, //vertex 3 colour
];

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

const uniformLocations = {
    matrix: gl.getUniformLocation(program,`matrix`),
}

const matrix = glMatrix.mat4.create();
glMatrix.mat4.translate(matrix,matrix, [.2, .5 , 0]);
glMatrix.mat4.scale(matrix,matrix,[0.25,0.25,0.25]);

gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);

gl.drawArrays(gl.TRIANGLES, 0, 3);