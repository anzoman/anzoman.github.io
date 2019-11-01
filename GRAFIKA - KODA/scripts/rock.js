class Rock {

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
    gl.bindTexture(gl.TEXTURE_2D, rockTexture);

    for (let i = 0; i < rockVertexPositionBuffer.length; i++) {
      // Set the vertex positions attribute for the teapot vertices.
      gl.bindBuffer(gl.ARRAY_BUFFER, rockVertexPositionBuffer[i]);
      gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, rockVertexPositionBuffer[i].itemSize, gl.FLOAT, false, 0, 0);

      // Set the texture coordinates attribute for the vertices.
      gl.bindBuffer(gl.ARRAY_BUFFER, rockVertexTextureCoordBuffer[i]);
      gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, rockVertexTextureCoordBuffer[i].itemSize, gl.FLOAT, false, 0, 0);

      // Set the normals attribute for the vertices.
      gl.bindBuffer(gl.ARRAY_BUFFER, rockVertexNormalBuffer[i]);
      gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, rockVertexNormalBuffer[i].itemSize, gl.FLOAT, false, 0, 0);

      // Set the index for the vertices.
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rockVertexIndexBuffer[i]);

      // Draw the car
      setMatrixUniforms();
      gl.drawElements(gl.TRIANGLES, rockVertexIndexBuffer[i].numItems, gl.UNSIGNED_SHORT, 0);
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
      rockVertexNormalBuffer.push(gl.createBuffer());
      gl.bindBuffer(gl.ARRAY_BUFFER, rockVertexNormalBuffer[index]);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals2), gl.STATIC_DRAW);
      rockVertexNormalBuffer[index].itemSize = 3;
      rockVertexNormalBuffer[index].numItems = vertexNormals2.length / 3;

      // Pass the texture coordinates into WebGL
      rockVertexTextureCoordBuffer.push(gl.createBuffer());
      gl.bindBuffer(gl.ARRAY_BUFFER, rockVertexTextureCoordBuffer[index]);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexTextureCoords2), gl.STATIC_DRAW);
      rockVertexTextureCoordBuffer[index].itemSize = 2;
      rockVertexTextureCoordBuffer[index].numItems = vertexTextureCoords2.length / 2;

      // Pass the vertex positions into WebGL
      rockVertexPositionBuffer.push(gl.createBuffer());
      gl.bindBuffer(gl.ARRAY_BUFFER, rockVertexPositionBuffer[index]);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions2), gl.STATIC_DRAW);
      rockVertexPositionBuffer[index].itemSize = 3;
      rockVertexPositionBuffer[index].numItems = vertexPositions2.length / 3;

      // Pass the indices into WebGL
      rockVertexIndexBuffer.push(gl.createBuffer());
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rockVertexIndexBuffer[index]);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices2), gl.STATIC_DRAW);
      rockVertexIndexBuffer[index].itemSize = 1;
      rockVertexIndexBuffer[index].numItems = indices2.length;
    }, this);
  }
}