import { vec3 } from "gl-matrix";

const geometryModelDatas = [];

function createVertexDataTorus() {
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

function createVertexDataPlane() {
    var n = 100;
    var m = 100;

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

    var du = 20 / n;
    var dv = 20 / m;
    var r = 0.3;
    var R = 0.5;
    // Counter for entries in index array.
    var iLines = 0;
    var iTris = 0;

    // Loop angle u.
    for (var i = 0, u = -10; i <= n; i++, u += du) {
        // Loop angle v.
        for (var j = 0, v = -10; j <= m; j++, v += dv) {
            var iVertex = i * (m + 1) + j;

            var x = u;
            var y = 0;
            var z = v;

            // Set vertex positions.
            vertices[iVertex * 3] = x;
            vertices[iVertex * 3 + 1] = y;
            vertices[iVertex * 3 + 2] = z;

            // Calc and set normals.
            //var nx = Math.cos(u) * Math.cos(v);
            //var ny = Math.cos(u) * Math.sin(v);
            //var nz = Math.sin(u);
            normals[iVertex * 3] = 0;
            normals[iVertex * 3 + 1] = 1;
            normals[iVertex * 3 + 2] = 0;

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

function createVertexDataPillow() {
    const m = 7;
    const n = 32;
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

    const umin = 0;
    const umax = Math.PI;
    const vmin = -1 * Math.PI;
    const vmax = Math.PI;
    const a = 0.5;
    const du = (umin + umax) / n;
    const dv = (vmin - vmax) / m;
    let iIndex = 0;
    let iTriangles = 0;

    for (let i = 0, u = 0; i <= n; i++, u += du) {
        for (let j = 0, v = 0; j <= m; j++, v += dv) {
            let iVertex = i * (m + 1) + j;
            let x = Math.cos(u);
            let z = Math.cos(v);
            let y = a * Math.sin(u) * Math.sin(v);
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

            if (j > 0 && i > 0) {
                indicesLines[iIndex++] = iVertex - 1;
                indicesLines[iIndex++] = iVertex;
            }
            if (j > 0 && i > 0) {
                indicesLines[iIndex++] = iVertex - (m + 1);
                indicesLines[iIndex++] = iVertex;
            }
            if (j > 0 && i > 0) {
                indicesTris[iTriangles++] = iVertex;
                indicesTris[iTriangles++] = iVertex - 1;
                indicesTris[iTriangles++] = iVertex - (m + 1);

                indicesTris[iTriangles++] = iVertex - 1;
                indicesTris[iTriangles++] = iVertex - (m + 1) - 1;
                indicesTris[iTriangles++] = iVertex - (m + 1);
            }
        }
    }
}

function createVertexDataRecSphere(recursionDepth = 1) {
    const vertexArray = [];
    const lineArray = [];

    // initial tetrahedron vertices
    const vectorA = [-1.0, 1.0, 1.0];
    const vectorB = [1.0, 1.0, -1.0];
    const vectorC = [1.0, -1.0, 1.0];
    const vectorD = [-1.0, -1.0, -1.0];

    // normalize initial tetrahedron vertices
    vec3.normalize(vectorA, vectorA);
    vec3.normalize(vectorB, vectorB);
    vec3.normalize(vectorC, vectorC);
    vec3.normalize(vectorD, vectorD);

    // define buffers to store the spheres' vertex positions and colors
    const vertexColors = [];

    // tesselate the tetrahedron trinagle wise
    tessellateTriangle(vertexArray, vectorA, vectorB, vectorC, recursionDepth);
    tessellateTriangle(vertexArray, vectorA, vectorB, vectorD, recursionDepth);
    tessellateTriangle(vertexArray, vectorA, vectorC, vectorD, recursionDepth);
    tessellateTriangle(vertexArray, vectorB, vectorC, vectorD, recursionDepth);

    this.vertices = new Float32Array(vertexArray);
    this.indicesLines = new Uint16Array(lineArray);
}

function calculateMedianVector(vectorOne, vectorTwo) {
    // add the two vector to create a direction vector (median)
    var c = vec3.create();
    vec3.add(vectorOne, vectorTwo, c);
    return normalize(c);
}

function normalize(vec) {
    // the normalization function return the center (vector) of the median
    vec3.normalize(vec);
    var normalizedVector = [vec[0], vec[1], vec[2]];
    return normalizedVector;
}

function tessellateTriangle(
    vertexArray,
    vectorOne,
    vectorTwo,
    vectorThree,
    depth
) {
    if (depth == 1) {
        // a recursion depth of 1 means to store the vertices and to break
        // the recursion
        vertexArray.push(vectorOne[0], vectorOne[1], vectorOne[2]);
        vertexArray.push(vectorTwo[0], vectorTwo[1], vectorTwo[2]);
        vertexArray.push(vectorThree[0], vectorThree[1], vectorThree[2]);
    } else {
        // calculate the medians...
        var vectorOne_vectorTwo = calculateMedianVector(vectorOne, vectorTwo);
        var vectorOne_vectorThree = calculateMedianVector(
            vectorOne,
            vectorThree
        );
        var vectorTwo_vectorThree = calculateMedianVector(
            vectorTwo,
            vectorThree
        );

        // ...and use them to span four new triangles which then gets tessellated again
        tessellateTriangle(
            vectorOne,
            vectorOne_vectorTwo,
            vectorOne_vectorThree,
            depth - 1
        );
        tessellateTriangle(
            vectorOne_vectorThree,
            vectorTwo_vectorThree,
            vectorThree,
            depth - 1
        );
        tessellateTriangle(
            vectorOne_vectorTwo,
            vectorTwo,
            vectorTwo_vectorThree,
            depth - 1
        );
        tessellateTriangle(
            vectorOne_vectorTwo,
            vectorOne_vectorThree,
            vectorTwo_vectorThree,
            depth - 1
        );
    }
}

geometryModelDatas.push({
    description: "torus",
    function: createVertexDataTorus,
});
geometryModelDatas.push({
    description: "plane",
    function: createVertexDataPlane,
});
geometryModelDatas.push({
    description: "pillow",
    function: createVertexDataPillow,
});

export { geometryModelDatas };
