class Shark {

  constructor() {
    this.scaleFactor = 1;
  }

  setScale(scaleFactor) {
    this.scaleFactor = scaleFactor;
  }

  draw(location, directionAngle) {
    mat4.translate(mvMatrix, location);
    mat4.rotate(mvMatrix, degToRad(directionAngle + 180), [0, 1, 0]);
    // mat4.rotate(mvMatrix, degToRad(180), [0, 0, 1]);
    mat4.scale(mvMatrix, [1 * this.scaleFactor, 1 * this.scaleFactor, 1 * this.scaleFactor]);

    // Activate textures
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sharkTexture);

    for (let i = 0; i < sharkVertexPositionBuffer.length; i++) {
      // Set the vertex positions attribute for the teapot vertices.
      gl.bindBuffer(gl.ARRAY_BUFFER, sharkVertexPositionBuffer[i]);
      gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sharkVertexPositionBuffer[i].itemSize, gl.FLOAT, false, 0, 0);

      // Set the texture coordinates attribute for the vertices.
      gl.bindBuffer(gl.ARRAY_BUFFER, sharkVertexTextureCoordBuffer[i]);
      gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, sharkVertexTextureCoordBuffer[i].itemSize, gl.FLOAT, false, 0, 0);

      // Set the normals attribute for the vertices.
      gl.bindBuffer(gl.ARRAY_BUFFER, sharkVertexNormalBuffer[i]);
      gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sharkVertexNormalBuffer[i].itemSize, gl.FLOAT, false, 0, 0);

      // Set the index for the vertices.
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sharkVertexIndexBuffer[i]);

      // Draw the car
      setMatrixUniforms();
      gl.drawElements(gl.TRIANGLES, sharkVertexIndexBuffer[i].numItems, gl.UNSIGNED_SHORT, 0);
    }
  }

  handleLoaded(carData) {
    carData.meshes.forEach(function (element, index) {
      let vertexNormals2 = [];
      let vertexPositions2 = [];
      let vertexTextureCoords2 = [];
      let indices2 = [];

      vertexPositions2 = vertexPositions2.concat(element.vertices)
      vertexNormals2 = vertexNormals2.concat(element.normals)
      element.faces.forEach(function (el) {
        indices2 = indices2.concat(el)
      }, this);
      element.texturecoords.forEach(function (el) {
        vertexTextureCoords2 = vertexTextureCoords2.concat(el)
      }, this);

      // Pass the normals into WebGL
      sharkVertexNormalBuffer.push(gl.createBuffer());
      gl.bindBuffer(gl.ARRAY_BUFFER, sharkVertexNormalBuffer[index]);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals2), gl.STATIC_DRAW);
      sharkVertexNormalBuffer[index].itemSize = 3;
      sharkVertexNormalBuffer[index].numItems = vertexNormals2.length / 3;

      // Pass the texture coordinates into WebGL
      sharkVertexTextureCoordBuffer.push(gl.createBuffer());
      gl.bindBuffer(gl.ARRAY_BUFFER, sharkVertexTextureCoordBuffer[index]);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexTextureCoords2), gl.STATIC_DRAW);
      sharkVertexTextureCoordBuffer[index].itemSize = 2;
      sharkVertexTextureCoordBuffer[index].numItems = vertexTextureCoords2.length / 2;

      // Pass the vertex positions into WebGL
      sharkVertexPositionBuffer.push(gl.createBuffer());
      gl.bindBuffer(gl.ARRAY_BUFFER, sharkVertexPositionBuffer[index]);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions2), gl.STATIC_DRAW);
      sharkVertexPositionBuffer[index].itemSize = 3;
      sharkVertexPositionBuffer[index].numItems = vertexPositions2.length / 3;

      // Pass the indices into WebGL
      sharkVertexIndexBuffer.push(gl.createBuffer());
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sharkVertexIndexBuffer[index]);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices2), gl.STATIC_DRAW);
      sharkVertexIndexBuffer[index].itemSize = 1;
      sharkVertexIndexBuffer[index].numItems = indices2.length;
    }, this);
  }
}