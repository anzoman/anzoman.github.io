class Mansion {

  constructor() {
    this.scaleFactor = 1;
  }

  setScale(scaleFactor) {
    this.scaleFactor = scaleFactor;
  }

  draw(location, directionAngle) {
    mat4.translate(mvMatrix, location);
    //mat4.rotate(mvMatrix, degToRad(directionAngle+180), [0, 1, 0]);
    // mat4.rotate(mvMatrix, degToRad(180), [0, 0, 1]);
    mat4.scale(mvMatrix, [1 * this.scaleFactor, 1 * this.scaleFactor, 1 * this.scaleFactor]);

    // Activate textures
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, mansionTexture);

    for (let i = 0; i < mansionVertexPositionBuffer.length; i++) {
      // Set the vertex positions attribute for the teapot vertices.
      gl.bindBuffer(gl.ARRAY_BUFFER, mansionVertexPositionBuffer[i]);
      gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mansionVertexPositionBuffer[i].itemSize, gl.FLOAT, false, 0, 0);

      // Set the texture coordinates attribute for the vertices.
      gl.bindBuffer(gl.ARRAY_BUFFER, mansionVertexTextureCoordBuffer[i]);
      gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mansionVertexTextureCoordBuffer[i].itemSize, gl.FLOAT, false, 0, 0);

      // Set the normals attribute for the vertices.
      gl.bindBuffer(gl.ARRAY_BUFFER, mansionVertexNormalBuffer[i]);
      gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mansionVertexNormalBuffer[i].itemSize, gl.FLOAT, false, 0, 0);

      // Set the index for the vertices.
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mansionVertexIndexBuffer[i]);

      // Draw the car
      setMatrixUniforms();
      gl.drawElements(gl.TRIANGLES, mansionVertexIndexBuffer[i].numItems, gl.UNSIGNED_SHORT, 0);
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
      mansionVertexNormalBuffer.push(gl.createBuffer());
      gl.bindBuffer(gl.ARRAY_BUFFER, mansionVertexNormalBuffer[index]);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals2), gl.STATIC_DRAW);
      mansionVertexNormalBuffer[index].itemSize = 3;
      mansionVertexNormalBuffer[index].numItems = vertexNormals2.length / 3;

      // Pass the texture coordinates into WebGL
      mansionVertexTextureCoordBuffer.push(gl.createBuffer());
      gl.bindBuffer(gl.ARRAY_BUFFER, mansionVertexTextureCoordBuffer[index]);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexTextureCoords2), gl.STATIC_DRAW);
      mansionVertexTextureCoordBuffer[index].itemSize = 2;
      mansionVertexTextureCoordBuffer[index].numItems = vertexTextureCoords2.length / 2;

      // Pass the vertex positions into WebGL
      mansionVertexPositionBuffer.push(gl.createBuffer());
      gl.bindBuffer(gl.ARRAY_BUFFER, mansionVertexPositionBuffer[index]);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions2), gl.STATIC_DRAW);
      mansionVertexPositionBuffer[index].itemSize = 3;
      mansionVertexPositionBuffer[index].numItems = vertexPositions2.length / 3;

      // Pass the indices into WebGL
      mansionVertexIndexBuffer.push(gl.createBuffer());
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mansionVertexIndexBuffer[index]);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices2), gl.STATIC_DRAW);
      mansionVertexIndexBuffer[index].itemSize = 1;
      mansionVertexIndexBuffer[index].numItems = indices2.length;
    }, this);
  }
}