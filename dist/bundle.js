var vertexGlsl = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;

    //Projektions-Matrix
    uniform mat4 uPMatrix;
    //Model-View-Matrix
    uniform mat4 uMVMatrix;

    varying vec4 vColor;

    void main() {
        
        gl_Position = uPMatrix * uMVMatrix * vec4(aPosition, 1.0);

        vColor = vec4(aNormal.x, aNormal.y, aNormal.z, 1.0);
        vColor = (vColor + 1.0) / 2.0;

    }
`;

//Fragment Shader dienen unter anderem der Einfärbung
var fragmentGlsl = `
    precision mediump float;
    varying vec4 vColor;

    void main(){
        //vierdimensionaler Vektor vec4(1, 1, 1, 1, 1)
        //RGB + Alpha Kanal
        gl_FragColor = vColor;
    }
`;

/**
 * Common utilities
 * @module glMatrix
 */
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};

/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */

function create() {
  var out = new ARRAY_TYPE(16);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }

  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */

function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Generates a orthogonal projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
 * which matches WebGL/OpenGL's clip volume.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function orthoNO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}
/**
 * Alias for {@link mat4.orthoNO}
 * @function
 */

var ortho = orthoNO;

function createVertexData() {
    var n = 16;
    var m = 32;

    // Positions.
    this.vertices = new Float32Array(3 * (n + 1) * (m + 1));
    var vertices = this.vertices;
    // Normals.
    this.normals = new Float32Array(3 * (n + 1) * (m + 1));
    var normals = this.normals;
    // Index data.
    this.indicesLines = new Uint16Array(2 * 2 * n * m);
    var indicesLines = this.indicesLines;
    this.indicesTris = new Uint16Array(3 * 2 * n * m);
    var indicesTris = this.indicesTris;

    var du = (2 * Math.PI) / n;
    var dv = (2 * Math.PI) / m;
    var r = 0.3;
    var R = 0.5;
    // Counter for entries in index array.
    var iLines = 0;
    var iTris = 0;

    // Loop angle u.
    for (var i = 0, u = 0; i <= n; i++, u += du) {
        // Loop angle v.
        for (var j = 0, v = 0; j <= m; j++, v += dv) {
            var iVertex = i * (m + 1) + j;

            var x = (R + r * Math.cos(u)) * Math.cos(v);
            var y = (R + r * Math.cos(u)) * Math.sin(v);
            var z = r * Math.sin(u);

            // Set vertex positions.
            vertices[iVertex * 3] = x;
            vertices[iVertex * 3 + 1] = y;
            vertices[iVertex * 3 + 2] = z;

            // Calc and set normals.
            var nx = Math.cos(u) * Math.cos(v);
            var ny = Math.cos(u) * Math.sin(v);
            var nz = Math.sin(u);
            normals[iVertex * 3] = nx;
            normals[iVertex * 3 + 1] = ny;
            normals[iVertex * 3 + 2] = nz;

            // if(i>14){
            // continue;
            // }

            // Set index.
            // Line on beam.
            if (j > 0 && i > 0) {
                indicesLines[iLines++] = iVertex - 1;
                indicesLines[iLines++] = iVertex;
            }
            // Line on ring.
            if (j > 0 && i > 0) {
                indicesLines[iLines++] = iVertex - (m + 1);
                indicesLines[iLines++] = iVertex;
            }

            // Set index.
            // Two Triangles.
            if (j > 0 && i > 0) {
                indicesTris[iTris++] = iVertex;
                indicesTris[iTris++] = iVertex - 1;
                indicesTris[iTris++] = iVertex - (m + 1);
                //
                indicesTris[iTris++] = iVertex - 1;
                indicesTris[iTris++] = iVertex - (m + 1) - 1;
                indicesTris[iTris++] = iVertex - (m + 1);
            }
        }
    }
}

//const gl = initContext("gl_context");
let gl;

// The shader program object is also used to
// store attribute and uniform locations.
let prog;

// Array of model objects.
const models = [];

const camera = {
    // Initial position of the camera.
    eye: [0, 1, 4],
    // Point to look at.
    center: [0, 0, 0],
    // Roll and pitch of the camera.
    up: [0, 1, 0],
    // Opening angle given in radian.
    // radian = degree*2*PI/360.
    fovy: (60.0 * Math.PI) / 180,
    // Camera near plane dimensions:
    // value for left right top bottom in projection.
    lrtb: 2.0,
    // View matrix.
    vMatrix: create(),
    // Projection matrix.
    pMatrix: create(),
    // Projection types: ortho, perspective, frustum.
    projectionType: "ortho",
    // Angle to Z-Axis for camera when orbiting the center
    // given in radian.
    zAngle: 0,
    // Distance in XZ-Plane from center when orbiting.
    distance: 4,
};

function start() {
    init();
    render();
}

function init() {
    initWebGL();
    initShaderProgram();
    initUniforms();
    initModels();
    initEventHandler();
    initPipline();
}

function initWebGL() {
    // Get canvas and WebGL context.
    canvas = document.getElementById("gl_context");
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
}

/**
 * Init pipeline parameters that will not change again.
 * If projection or viewport change, their setup must
 * be in render function.
 */
function initPipline() {
    gl.clearColor(0.95, 0.95, 0.95, 1);

    // Backface culling.
    gl.frontFace(gl.CCW);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    // Depth(Z)-Buffer.
    gl.enable(gl.DEPTH_TEST);

    // Polygon offset of rastered Fragments.
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(0.5, 0);

    // Set viewport.
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

    // Init camera.
    // Set projection aspect ratio.
    camera.aspect = gl.viewportWidth / gl.viewportHeight;
}

function initShaderProgram() {
    // Init vertex shader.
    const vs = initShader(gl.VERTEX_SHADER, vertexGlsl);
    // Init fragment shader.
    const fs = initShader(gl.FRAGMENT_SHADER, fragmentGlsl);
    // Link shader into a shader program.
    prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "aPosition");
    gl.linkProgram(prog);
    gl.useProgram(prog);
}

/**
 * Create and init shader from source.
 *
 * @parameter shaderType: openGL shader type.
 * @parameter SourceTagId: Id of HTML Tag with shader source.
 * @returns shader object.
 */
function initShader(shaderType, shaderSource) {
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log("Error: " + gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

function initUniforms() {
    // Projection Matrix.
    prog.pMatrixUniform = gl.getUniformLocation(prog, "uPMatrix");

    // Model-View-Matrix.
    prog.mvMatrixUniform = gl.getUniformLocation(prog, "uMVMatrix");
}

function initModels() {
    // fill-style
    const fs = "fillwireframe";
    createModel("torus", fs);
}

/**
 * Create model object, fill it and push it in models array.
 *
 * @parameter geometryname: string with name of geometry.
 * @parameter fillstyle: wireframe, fill, fillwireframe.
 */
function createModel(geometryname, fillstyle) {
    const model = {};
    model.fillstyle = fillstyle;
    initDataAndBuffers(model);
    // Create and initialize Model-View-Matrix.
    model.mvMatrix = create();

    models.push(model);
}

/**
 * Init data and buffers for model object.
 *
 * @parameter model: a model object to augment with data.
 * @parameter geometryname: string with name of geometry.
 */
function initDataAndBuffers(model, geometryname) {
    // Provide model object with vertex data arrays.
    // Fill data arrays for Vertex-Positions, Normals, Index data:
    // vertices, normals, indicesLines, indicesTris;
    // Pointer this refers to the window.
    //this[geometryname]["createVertexData"].apply(model);
    createVertexData.apply(model);

    // Setup position vertex buffer object.
    model.vboPos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.vboPos);
    gl.bufferData(gl.ARRAY_BUFFER, model.vertices, gl.STATIC_DRAW);
    // Bind vertex buffer to attribute variable.
    prog.positionAttrib = gl.getAttribLocation(prog, "aPosition");
    gl.enableVertexAttribArray(prog.positionAttrib);

    // Setup normal vertex buffer object.
    model.vboNormal = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.vboNormal);
    gl.bufferData(gl.ARRAY_BUFFER, model.normals, gl.STATIC_DRAW);
    // Bind buffer to attribute variable.
    prog.normalAttrib = gl.getAttribLocation(prog, "aNormal");
    gl.enableVertexAttribArray(prog.normalAttrib);

    // Setup lines index buffer object.
    model.iboLines = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboLines);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indicesLines, gl.STATIC_DRAW);
    model.iboLines.numberOfElements = model.indicesLines.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // Setup triangle index buffer object.
    model.iboTris = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboTris);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indicesTris, gl.STATIC_DRAW);
    model.iboTris.numberOfElements = model.indicesTris.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

function initEventHandler() {
    window.onkeydown = function (evt) {
        const key = evt.which ? evt.which : evt.keyCode;
        const c = String.fromCharCode(key);
        // console.log(evt);

        // Change projection of scene.
        switch (c) {
            case "O":
                camera.projectionType = "ortho";
                camera.lrtb = 2;
                break;
        }

        // Render the scene again on any key pressed.
        render();
    };
}

/**
 * Run the rendering pipeline.
 */
function render() {
    // Clear framebuffer and depth-/z-buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    setProjection();

    identity(camera.vMatrix);

    // Loop over models.
    for (let i = 0; i < models.length; i++) {
        // Update modelview for model.
        copy(models[i].mvMatrix, camera.vMatrix);

        // Set uniforms for model.
        gl.uniformMatrix4fv(prog.mvMatrixUniform, false, models[i].mvMatrix);
        console.log(models[i]);
        draw(models[i]);
    }
}

function setProjection() {
    // Set projection Matrix.
    switch (camera.projectionType) {
        case "ortho":
            const v = camera.lrtb;
            ortho(camera.pMatrix, -v, v, -v, v, -10, 10);
            break;
    }
    // Set projection uniform.
    gl.uniformMatrix4fv(prog.pMatrixUniform, false, camera.pMatrix);
}

function draw(model) {
    // Setup position VBO.
    gl.bindBuffer(gl.ARRAY_BUFFER, model.vboPos);
    gl.vertexAttribPointer(prog.positionAttrib, 3, gl.FLOAT, false, 0, 0);

    // Setup normal VBO.
    gl.bindBuffer(gl.ARRAY_BUFFER, model.vboNormal);
    gl.vertexAttribPointer(prog.normalAttrib, 3, gl.FLOAT, false, 0, 0);

    // Setup rendering tris.
    const fill = model.fillstyle.search(/fill/) != -1;
    if (fill) {
        gl.enableVertexAttribArray(prog.normalAttrib);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboTris);
        gl.drawElements(
            gl.TRIANGLES,
            model.iboTris.numberOfElements,
            gl.UNSIGNED_SHORT,
            0
        );
    }

    // Setup rendering lines.
    const wireframe = model.fillstyle.search(/wireframe/) != -1;
    if (wireframe) {
        gl.disableVertexAttribArray(prog.normalAttrib);
        gl.vertexAttrib3f(prog.normalAttrib, 0, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboLines);
        gl.drawElements(
            gl.LINES,
            model.iboLines.numberOfElements,
            gl.UNSIGNED_SHORT,
            0
        );
    }
}

start();
//
//function createVertexData(callback) {
//    const vertexDataObject = {
//        vertices: [],
//        indices: [],
//        indicesTriangles: [],
//    };
//    callback(vertexDataObject);
//    return vertexDataObject;
//}
//
////const colors = new Float32Array([]);
//
//console.log(mat4.identity);
//
//const pillow = function (vertexDataObject) {
//    const m = 7;
//    const n = 32;
//    const vertices = new Float32Array(3 * (n + 1) * (m + 1));
//    const indices = new Uint16Array(2 * 2 * n * m);
//
//    const umin = 0;
//    const umax = Math.PI;
//    const vmin = -1 * Math.PI;
//    const vmax = Math.PI;
//    const a = 0.5;
//    const du = (umin + umax) / n;
//    const dv = (vmin - vmax) / m;
//    let iIndex = 0;
//
//    for (let i = 0, u = 0; i <= n; i++, u += du) {
//        for (let j = 0, v = 0; j <= m; j++, v += dv) {
//            let iVertex = i * (m + 1) + j;
//            let x = Math.cos(u);
//            let z = Math.cos(v);
//            let y = a * Math.sin(u) * Math.sin(v);
//            vertices[iVertex * 3] = x;
//            vertices[iVertex * 3 + 1] = y;
//            vertices[iVertex * 3 + 2] = z;
//
//            if (j > 0 && i > 0) {
//                indices[iIndex++] = iVertex - 1;
//                indices[iIndex++] = iVertex;
//            }
//            if (j > 0 && i > 0) {
//                indices[iIndex++] = iVertex - (m + 1);
//                indices[iIndex++] = iVertex;
//            }
//        }
//    }
//    vertexDataObject.vertices = vertices;
//    vertexDataObject.indices = indices;
//};
//
//const pillowColor = function (vertexDataObject) {
//    const m = 7;
//    const n = 32;
//    const vertices = new Float32Array(3 * (n + 1) * (m + 1));
//    const indices = new Uint16Array(2 * 2 * n * m);
//    const indicesTriangles = new Uint16Array(3 * 2 * n * m);
//
//    const umin = 0;
//    const umax = Math.PI;
//    const vmin = -1 * Math.PI;
//    const vmax = Math.PI;
//    const a = 0.5;
//    const du = (umin + umax) / n;
//    const dv = (vmin - vmax) / m;
//    let iIndex = 0;
//    let iTriangles = 0;
//
//    for (let i = 0, u = 0; i <= n; i++, u += du) {
//        for (let j = 0, v = 0; j <= m; j++, v += dv) {
//            let iVertex = i * (m + 1) + j;
//            let x = Math.cos(u);
//            let z = Math.cos(v);
//            let y = a * Math.sin(u) * Math.sin(v);
//            vertices[iVertex * 3] = x;
//            vertices[iVertex * 3 + 1] = y;
//            vertices[iVertex * 3 + 2] = z;
//
//            if (j > 0 && i > 0) {
//                indices[iIndex++] = iVertex - 1;
//                indices[iIndex++] = iVertex;
//            }
//            if (j > 0 && i > 0) {
//                indices[iIndex++] = iVertex - (m + 1);
//                indices[iIndex++] = iVertex;
//            }
//            if (j > 0 && i > 0) {
//                indicesTriangles[iTriangles++] = iVertex;
//                indicesTriangles[iTriangles++] = iVertex - 1;
//                indicesTriangles[iTriangles++] = iVertex - (m + 1);
//
//                indicesTriangles[iTriangles++] = iVertex - 1;
//                indicesTriangles[iTriangles++] = iVertex - (m + 1) - 1;
//                indicesTriangles[iTriangles++] = iVertex - (m + 1);
//            }
//        }
//    }
//    vertexDataObject.vertices = vertices;
//    vertexDataObject.indices = indices;
//    vertexDataObject.indicesTriangles = indicesTriangles;
//};
//
//const dinis = function (vertexDataObject) {
//    const n = 32;
//    const m = 7;
//    const c = 0.17;
//    const vertices = new Float32Array(3 * (n + 1) * (m + 1));
//    const indices = new Uint16Array(2 * 2 * n * m);
//    const indicesTriangles = new Uint16Array(3 * 2 * n * m);
//
//    const du = (4 * Math.PI) / n;
//    const dv = (2 - 0.01) / n;
//    const a = 3;
//    const b = 0.6;
//
//    let iIndex = 0;
//    let iTriangles = 0;
//
//    for (let i = 0, u = 0; i <= n; i++, u += du) {
//        for (let j = 0, v = 0.01; j <= m; j++, v += dv) {
//            let iVertex = i * (m + 1) + j;
//            let x = a * Math.cos(u) * Math.sin(v) * c;
//            let z = a * Math.sin(u) * Math.sin(v) * c;
//            let y =
//                (a * (Math.cos(v) + Math.log(Math.tan(v * 0.5))) + b * u) * c;
//
//            vertices[iVertex * 3] = x;
//            vertices[iVertex * 3 + 1] = y;
//            vertices[iVertex * 3 + 2] = z;
//
//            if (j > 0 && i > 0) {
//                indices[iIndex++] = iVertex - 1;
//                indices[iIndex++] = iVertex;
//            }
//
//            if (j > 0 && i > 0) {
//                indices[iIndex++] = iVertex - (m + 1);
//                indices[iIndex++] = iVertex;
//            }
//            if (j > 0 && i > 0) {
//                indicesTriangles[iTriangles++] = iVertex;
//                indicesTriangles[iTriangles++] = iVertex - 1;
//                indicesTriangles[iTriangles++] = iVertex - (m + 1);
//
//                indicesTriangles[iTriangles++] = iVertex - 1;
//                indicesTriangles[iTriangles++] = iVertex - (m + 1) - 1;
//                indicesTriangles[iTriangles++] = iVertex - (m + 1);
//            }
//        }
//    }
//    vertexDataObject.vertices = vertices;
//    vertexDataObject.indices = indices;
//    vertexDataObject.indicesTriangles = indicesTriangles;
//};
//
//const vertexDataPillow = createVertexData(pillow);
//const vertexDataDinis = createVertexData(dinis);
//const vertexDataPillowColor = createVertexData(pillowColor);
//
//const gl = initContext("gl_context");
//const gl2 = initContext("gl_context_02");
//const gl3 = initContext("gl_context_03");
//const gl4 = initContext("gl_context_04");
//const initObject = initWebGl(gl);
//const initObject2 = initWebGl(gl2);
//const initObject3 = initWebGl(gl3);
//gl.useProgram(initObject.program);
//gl2.useProgram(initObject2.program);
//gl3.useProgram(initObject3.program);
//
//initBuffer(
//    gl,
//    vertexDataPillow.vertices,
//    gl.ARRAY_BUFFER,
//    initObject.program,
//    "pos",
//    3
//);
//initBuffer(
//    gl2,
//    vertexDataDinis.vertices,
//    gl2.ARRAY_BUFFER,
//    initObject2.program,
//    "pos",
//    3
//);
//initBuffer(
//    gl3,
//    vertexDataPillowColor.vertices,
//    gl3.ARRAY_BUFFER,
//    initObject3.program,
//    "pos",
//    3
//);
////initBuffer(gl, colors, gl.ARRAY_BUFFER, initObject.program, "col", 4);
//
//const ibo = gl.createBuffer();
//gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
//gl.bufferData(
//    gl.ELEMENT_ARRAY_BUFFER,
//    vertexDataPillow.indices,
//    gl.STATIC_DRAW
//);
//ibo.numberOfElements = vertexDataPillow.indices.length;
//
//const ibo2 = gl2.createBuffer();
//gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, ibo2);
//gl2.bufferData(
//    gl2.ELEMENT_ARRAY_BUFFER,
//    vertexDataDinis.indices,
//    gl2.STATIC_DRAW
//);
//ibo2.numberOfElements = vertexDataDinis.indices.length;
//gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, null);
//
//const ibo2Color = gl2.createBuffer();
//gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, ibo2Color);
//gl2.bufferData(
//    gl2.ELEMENT_ARRAY_BUFFER,
//    vertexDataDinis.indicesTriangles,
//    gl2.STATIC_DRAW
//);
//ibo2Color.numberOfElements = vertexDataDinis.indicesTriangles.length;
//gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, null);
//
//const ibo3 = gl3.createBuffer();
//gl3.bindBuffer(gl3.ELEMENT_ARRAY_BUFFER, ibo3);
//gl3.bufferData(
//    gl3.ELEMENT_ARRAY_BUFFER,
//    vertexDataPillowColor.indices,
//    gl3.STATIC_DRAW
//);
//ibo3.numberOfElements = vertexDataPillowColor.indices.length;
//gl3.bindBuffer(gl3.ELEMENT_ARRAY_BUFFER, null);
//
//const ibo3Color = gl3.createBuffer();
//gl3.bindBuffer(gl3.ELEMENT_ARRAY_BUFFER, ibo3Color);
//gl3.bufferData(
//    gl3.ELEMENT_ARRAY_BUFFER,
//    vertexDataPillowColor.indicesTriangles,
//    gl3.STATIC_DRAW
//);
//ibo3Color.numberOfElements = vertexDataPillowColor.indicesTriangles.length;
//gl3.bindBuffer(gl3.ELEMENT_ARRAY_BUFFER, null);
//
//gl.clearColor(0.95, 0.95, 0.95, 1);
//gl.clear(gl.COLOR_BUFFER_BIT);
//gl.frontFace(gl.CCW);
//gl.enable(gl.CULL_FACE);
//gl.cullFace(gl.BACK);
//gl.drawElements(gl.LINE_STRIP, ibo.numberOfElements, gl.UNSIGNED_SHORT, 0);
//
//gl2.clearColor(0.95, 0.95, 0.95, 1);
//gl2.clear(gl2.COLOR_BUFFER_BIT);
//gl2.frontFace(gl2.CCW);
//gl2.enable(gl2.CULL_FACE);
//gl2.cullFace(gl2.BACK);
//const colAttribute2 = gl2.getAttribLocation(initObject2.program, "col");
//gl2.vertexAttrib4f(colAttribute2, 0.5, 0.8, 0, 1);
//gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, ibo2Color);
//gl2.drawElements(
//    gl2.TRIANGLES,
//    ibo2Color.numberOfElements,
//    gl2.UNSIGNED_SHORT,
//    0
//);
//gl2.vertexAttrib4f(colAttribute2, 0, 0, 0, 1);
//gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, ibo2);
//gl2.drawElements(gl2.LINES, ibo2.numberOfElements, gl2.UNSIGNED_SHORT, 0);
//
//gl3.clearColor(0.95, 0.95, 0.95, 1);
//gl3.clear(gl3.COLOR_BUFFER_BIT);
//gl3.frontFace(gl3.CCW);
//gl3.enable(gl3.CULL_FACE);
//gl3.cullFace(gl3.BACK);
//
//const colAttribute = gl3.getAttribLocation(initObject3.program, "col");
//gl3.vertexAttrib4f(colAttribute, 0.5, 0.2, 0, 1);
//gl3.bindBuffer(gl3.ELEMENT_ARRAY_BUFFER, ibo3Color);
//gl3.drawElements(
//    gl3.TRIANGLES,
//    ibo3Color.numberOfElements,
//    gl3.UNSIGNED_SHORT,
//    0
//);
//gl3.vertexAttrib4f(colAttribute, 1.0, 1.0, 1.0, 1);
//gl3.bindBuffer(gl3.ELEMENT_ARRAY_BUFFER, ibo3);
//gl3.drawElements(gl3.LINES, ibo3.numberOfElements, gl3.UNSIGNED_SHORT, 0);
//
//gl4.clearColor(0.95, 0.95, 0.95, 1);
//gl4.clear(gl4.COLOR_BUFFER_BIT);
//gl4.frontFace(gl4.CCW);
//gl4.enable(gl4.CULL_FACE);
//gl4.cullFace(gl4.BACK);
//gl4.drawElements(gl4.LINES, ibo2.numberOfElements, gl2.UNSIGNED_SHORT, 0);
