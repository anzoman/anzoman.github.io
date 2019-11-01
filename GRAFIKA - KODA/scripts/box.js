class Box {


  constructor() {
    this.rotationSpeed = 1;
    this.rotationAngle = 0;
    this.type = -1;
    this.visible = false;
  }

  draw(location) {
    mat4.translate(mvMatrix, location);
    mat4.rotate(mvMatrix, degToRad(this.rotationAngle), [0, 1, 0]);
    mat4.scale(mvMatrix, [0.5, 0.5, 0.5]);

    // Specify the texture to map onto the faces.
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, boxTexture);

    // Draw the cube by binding the array buffer to the cube's vertices
    gl.bindBuffer(gl.ARRAY_BUFFER, boxUpVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, boxUpVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Set the texture coordinates attribute for the vertices.
    gl.bindBuffer(gl.ARRAY_BUFFER, boxUpVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, boxUpVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Set the normals attribute for vertices.
    gl.bindBuffer(gl.ARRAY_BUFFER, boxUpVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, boxUpVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxUpVertexIndexBuffer);

    // Draw the cube.
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, boxUpVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
  }

  generate() {
    this.type = Math.floor(Math.random() * 5);
  }

  getType() {
    return this.type;
  }

  getVisible() {
    return this.visible;
  }

  setVisible(visible) {
    this.visible = visible;
  }


  handleLoaded(boxData) {
    // Create a buffer for the cube's vertices.
    boxUpVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxUpVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxData.vertexPositions), gl.STATIC_DRAW);
    boxUpVertexPositionBuffer.itemSize = 3;
    boxUpVertexPositionBuffer.numItems = boxData.vertexPositions.length / 3;

    // Pass the normals into WebGL
    boxUpVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxUpVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxData.vertexNormals), gl.STATIC_DRAW);
    boxUpVertexNormalBuffer.itemSize = 3;
    boxUpVertexNormalBuffer.numItems = boxData.vertexNormals.length / 3;

    // Pass the texture coordinates into WebGL
    boxUpVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxUpVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxData.vertexTextureCoords), gl.STATIC_DRAW);
    boxUpVertexTextureCoordBuffer.itemSize = 2;
    boxUpVertexTextureCoordBuffer.numItems = boxData.vertexTextureCoords.length / 2;

    // Now send the element array to GL
    boxUpVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxUpVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxData.indices), gl.STATIC_DRAW);
    boxUpVertexIndexBuffer.itemSize = 1;
    boxUpVertexIndexBuffer.numItems = boxData.indices.length;
  }

  animate(elapsed) {
    this.rotationAngle += this.rotationSpeed;
  }
}