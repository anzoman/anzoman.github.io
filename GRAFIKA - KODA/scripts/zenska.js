class Zenska {

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
    gl.bindTexture(gl.TEXTURE_2D, ladyTexture);

    for (let i = 0; i < zenskaVertexPositionBuffer.length; i++) {
      // Set the vertex positions attribute for the teapot vertices.
      gl.bindBuffer(gl.ARRAY_BUFFER, zenskaVertexPositionBuffer[i]);
      gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, zenskaVertexPositionBuffer[i].itemSize, gl.FLOAT, false, 0, 0);

      // Set the texture coordinates attribute for the vertices.
      gl.bindBuffer(gl.ARRAY_BUFFER, zenskaVertexTextureCoordBuffer[i]);
      gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, zenskaVertexTextureCoordBuffer[i].itemSize, gl.FLOAT, false, 0, 0);

      // Set the normals attribute for the vertices.
      gl.bindBuffer(gl.ARRAY_BUFFER, zenskaVertexNormalBuffer[i]);
      gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, zenskaVertexNormalBuffer[i].itemSize, gl.FLOAT, false, 0, 0);

      // Set the index for the vertices.
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, zenskaVertexIndexBuffer[i]);

      // Draw the car
      setMatrixUniforms();
      gl.drawElements(gl.TRIANGLES, zenskaVertexIndexBuffer[i].numItems, gl.UNSIGNED_SHORT, 0);
    }
  }

  handleLoaded(carData) {
    carData.meshes.forEach(function (element, index) {
      let vertexNormals1 = [];
      let vertexPositions1 = [];
      let vertexTextureCoords1 = [];
      let indices1 = [];

      vertexPositions1 = vertexPositions1.concat(element.vertices)
      vertexNormals1 = vertexNormals1.concat(element.normals)
      element.faces.forEach(function (el) {
        indices1 = indices1.concat(el)
      }, this);
      element.texturecoords.forEach(function (el) {
        vertexTextureCoords1 = vertexTextureCoords1.concat(el)
      }, this);

      // Pass the normals into WebGL
      zenskaVertexNormalBuffer.push(gl.createBuffer());
      gl.bindBuffer(gl.ARRAY_BUFFER, zenskaVertexNormalBuffer[index]);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals1), gl.STATIC_DRAW);
      zenskaVertexNormalBuffer[index].itemSize = 3;
      zenskaVertexNormalBuffer[index].numItems = vertexNormals1.length / 3;

      // Pass the texture coordinates into WebGL
      zenskaVertexTextureCoordBuffer.push(gl.createBuffer());
      gl.bindBuffer(gl.ARRAY_BUFFER, zenskaVertexTextureCoordBuffer[index]);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexTextureCoords1), gl.STATIC_DRAW);
      zenskaVertexTextureCoordBuffer[index].itemSize = 2;
      zenskaVertexTextureCoordBuffer[index].numItems = vertexTextureCoords1.length / 2;

      // Pass the vertex positions into WebGL
      zenskaVertexPositionBuffer.push(gl.createBuffer());
      gl.bindBuffer(gl.ARRAY_BUFFER, zenskaVertexPositionBuffer[index]);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions1), gl.STATIC_DRAW);
      zenskaVertexPositionBuffer[index].itemSize = 3;
      zenskaVertexPositionBuffer[index].numItems = vertexPositions1.length / 3;

      // Pass the indices into WebGL
      zenskaVertexIndexBuffer.push(gl.createBuffer());
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, zenskaVertexIndexBuffer[index]);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices1), gl.STATIC_DRAW);
      zenskaVertexIndexBuffer[index].itemSize = 1;
      zenskaVertexIndexBuffer[index].numItems = indices1.length;
    }, this);
  }
}