//point cloud (from invent box tutorials youtube channel)


const canvas  = document.querySelector('canvas');
const gl =  canvas.getContext('webgl');

if(!gl){
    throw new Error('WebGL not supported');
}

function spherePointCloud(pointCount) {
    let points = [];
    for (let i = 0; i < pointCount; i++) {

        const r = () => Math.random() - 0.5; //so range is from -.5 to +.5
        const inputPoint = [r(),r(),r()];
        const outputPoint = glMatrix.vec3.normalize(glMatrix.vec3.create(), inputPoint);

        points.push(...outputPoint);
        
    }

    return points;
}

const vertexData = spherePointCloud(1e2/3);

console.log(vertexData);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.DYNAMIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader,`
                precision mediump float;
                attribute vec3 position;

                varying vec3 vColour;

                uniform mat4 matrix;

                void main(){
                    vColour = vec3(position.xy,1);
                    gl_Position = matrix * vec4(position, 1);
                    gl_PointSize = 10.0;
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

glMatrix.mat4.translate(modelMatrix,modelMatrix, [0, 0 , 0]);
glMatrix.mat4.translate(viewMatrix,viewMatrix, [-.1, 0 , 3]);
glMatrix.mat4.invert(viewMatrix,viewMatrix);


glMatrix.mat4.scale(modelMatrix,modelMatrix,[1.5,1.5,1.5]);

function animate() {
    requestAnimationFrame(animate);

    glMatrix.mat4.rotateY(modelMatrix, modelMatrix, 0.03);
    // glMatrix.mat4.rotateX(modelMatrix, modelMatrix, Math.PI/2 / 90);

    glMatrix.mat4.multiply(mvMatrix,viewMatrix,modelMatrix);
    glMatrix.mat4.multiply(finalMatrix,projectionMatrix,mvMatrix);
    // glMatrix.mat4.multiply(finalMatrix,projectionMatrix,modelMatrix);

    gl.uniformMatrix4fv(uniformLocations.matrix, false, finalMatrix);
    gl.drawArrays(gl.POINTS, 0, vertexData.length / 3);
}

animate();