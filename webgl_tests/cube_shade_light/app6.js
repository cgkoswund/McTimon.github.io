//lighting the cube (from invent box tutorials youtube channel)


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

//make an array by repeating "pattern" n times
function repeat(n,pattern){
    return [...Array(n)].reduce(sum => sum.concat(pattern),[]);
}

const uvData = repeat(6, [
    //start at 00, move CW around
    // 0,0,
    // 0,1,
    // 1,0,

    // 1,0,
    // 0,1,
    // 1,1

    1,1,
    1,0,
    0,1,

    0,1,
    1,0,
    0,0

]);

const normalData = [
    ...repeat(6, [0, 0, 1]),    // Z+
    ...repeat(6, [-1, 0, 0]),   // X-
    ...repeat(6, [0, 0, -1]),   // Z-
    ...repeat(6, [1, 0, 0]),    // X+
    ...repeat(6, [0, 1, 0]),    // Y+
    ...repeat(6, [0, -1, 0]),   // Y-
]

console.log(normalData);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

const uvBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvData), gl.STATIC_DRAW);

const normalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);

//RESOURCE LOADING
//================
function loadTexture(url){
    const texture = gl.createTexture();
    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = e => {
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height,0 , gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        gl.generateMipmap(gl.TEXTURE_2D);
    };

    image.src = url;
    return texture;
}

const emojiDD = loadTexture(`ddx.png`);

gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, emojiDD);

//SHADER PROGRAM
//==============

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader,`
                precision mediump float;

                const vec3 lightDirection = normalize(vec3(1.0,1.0,0));
                const float ambient = 0.1;

                attribute vec3 position;
                attribute vec2 uv;
                attribute vec3 normal;

                varying vec2 vUV;
                varying float vBrightness;

                uniform mat4 matrix;
                uniform mat4 normalMatrix;

                void main(){
                    vec3 worldNormal = (normalMatrix * vec4(normal,1)).xyz;
                    float diffuse = max(0.0, dot(worldNormal, lightDirection));

                    vUV = uv;
                    vBrightness = diffuse + ambient;
                    gl_Position = matrix * vec4(position, 1);
                }
                
                `);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader,`

                precision mediump float;
                varying vec2 vUV;
                varying float vBrightness;

                uniform sampler2D textureID;

                void main(){
                    vec4 texel = texture2D(textureID, vUV);
                    texel.xyz *= vBrightness;
                    gl_FragColor = texel;
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

const uvLocation = gl.getAttribLocation(program, `uv`);
gl.enableVertexAttribArray(uvLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);

const normalLocation = gl.getAttribLocation(program, `normal`);
gl.enableVertexAttribArray(normalLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);

const uniformLocations = {
    matrix: gl.getUniformLocation(program,`matrix`),
    normalMatrix: gl.getUniformLocation(program,`normalMatrix`),
    textureID: gl.getUniformLocation(program, `textureID`)
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

const normalMatrix = glMatrix.mat4.create();


glMatrix.mat4.scale(modelMatrix,modelMatrix,[0.5,0.5,0.5]);

function animate() {
    requestAnimationFrame(animate);

    glMatrix.mat4.rotateZ(modelMatrix, modelMatrix, Math.PI/2 / 70);
    glMatrix.mat4.rotateX(modelMatrix, modelMatrix, Math.PI/2 / 90);

    glMatrix.mat4.multiply(mvMatrix,viewMatrix,modelMatrix);
    glMatrix.mat4.multiply(finalMatrix,projectionMatrix,mvMatrix);

    glMatrix.mat4.invert(normalMatrix, mvMatrix);
    glMatrix.mat4.transpose(normalMatrix, mvMatrix);

    gl.uniformMatrix4fv(uniformLocations.matrix, false, finalMatrix);
    gl.uniformMatrix4fv(uniformLocations.normalMatrix, false, normalMatrix);

    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
}

animate();