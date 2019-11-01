class Ship {
  
    constructor() {
      this.speed = 0;
      this.accelerateForce = 0.0001;
      this.brakeForce = 0.0001;
      this.accelerating = false;
      this.braking = false;
      this.scaleFactor = 1; 
    }
  
    setSpeed(acceleration) {
      this.speed += acceleration;
    }
  
    getSpeed() {
      return this.speed;
    }
  
    setAcceleration(accelerateForce) {
      this.accelerateForce = accelerateForce;
    }
  
    getAcceleration() {
      return this.accelerateForce;
    }
  
    setScale(scaleFactor) {
      this.scaleFactor = scaleFactor;
    }
  
  
    draw(location, directionAngle) {
      mat4.translate(mvMatrix, location);
      mat4.rotate(mvMatrix, degToRad(directionAngle+180), [0, 1, 0]);
      // mat4.rotate(mvMatrix, degToRad(180), [0, 0, 1]);
      mat4.scale(mvMatrix, [1*this.scaleFactor, 1*this.scaleFactor, 1*this.scaleFactor]);
    
      // Activate textures
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, shipTexture);
    
  
      for (let i = 0; i < shipVertexPositionBuffer.length; i++) {
        // Set the vertex positions attribute for the teapot vertices.
        gl.bindBuffer(gl.ARRAY_BUFFER, shipVertexPositionBuffer[i]);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, shipVertexPositionBuffer[i].itemSize, gl.FLOAT, false, 0, 0);
      
        // Set the texture coordinates attribute for the vertices.
        gl.bindBuffer(gl.ARRAY_BUFFER, shipVertexTextureCoordBuffer[i]);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, shipVertexTextureCoordBuffer[i].itemSize, gl.FLOAT, false, 0, 0);
      
        // Set the normals attribute for the vertices.
        gl.bindBuffer(gl.ARRAY_BUFFER, shipVertexNormalBuffer[i]);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, shipVertexNormalBuffer[i].itemSize, gl.FLOAT, false, 0, 0);
      
        // Set the index for the vertices.
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, shipVertexIndexBuffer[i]);
  
        // Draw the ship
        setMatrixUniforms();
        gl.drawElements(gl.TRIANGLES, shipVertexIndexBuffer[i].numItems, gl.UNSIGNED_SHORT, 0);
      }
  
    }
  
    handleLoaded(shipData) {
      shipData.meshes.forEach(function(element, index) {
        let vertexNormals = [];
        let vertexPositions = [];
        let vertexTextureCoords = [];
        let indices = [];
      
        vertexPositions = vertexPositions.concat(element.vertices)
        vertexNormals = vertexNormals.concat(element.normals)
        element.faces.forEach(function(el) {
          indices = indices.concat(el)
        }, this);
        element.texturecoords.forEach(function(el) {
          vertexTextureCoords = vertexTextureCoords.concat(el)
        }, this);

        // Pass the normals into WebGL
        shipVertexNormalBuffer.push(gl.createBuffer());
        gl.bindBuffer(gl.ARRAY_BUFFER, shipVertexNormalBuffer[index]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
        shipVertexNormalBuffer[index].itemSize = 3;
        shipVertexNormalBuffer[index].numItems = vertexNormals.length / 3;
      
        // Pass the texture coordinates into WebGL
        shipVertexTextureCoordBuffer.push(gl.createBuffer());
        gl.bindBuffer(gl.ARRAY_BUFFER, shipVertexTextureCoordBuffer[index]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexTextureCoords), gl.STATIC_DRAW);
        shipVertexTextureCoordBuffer[index].itemSize = 2;
        shipVertexTextureCoordBuffer[index].numItems = vertexTextureCoords.length / 2;
      
        // Pass the vertex positions into WebGL
        shipVertexPositionBuffer.push(gl.createBuffer());
        gl.bindBuffer(gl.ARRAY_BUFFER, shipVertexPositionBuffer[index]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW);
        shipVertexPositionBuffer[index].itemSize = 3;
        shipVertexPositionBuffer[index].numItems = vertexPositions.length / 3;
      
        // Pass the indices into WebGL
        shipVertexIndexBuffer.push(gl.createBuffer());
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, shipVertexIndexBuffer[index]);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        shipVertexIndexBuffer[index].itemSize = 1;
        shipVertexIndexBuffer[index].numItems = indices.length;
      }, this);
    
    }
  
    animate(directionAngle, elapsed) {
      if (this.speed != 0) {
        xPosition -= Math.sin(degToRad(directionAngle)) * this.speed * elapsed;
        zPosition -= Math.cos(degToRad(directionAngle)) * this.speed * elapsed;
      }
    }
  }