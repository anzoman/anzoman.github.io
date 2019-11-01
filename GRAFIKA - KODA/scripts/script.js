// Globalna spremenljivka za platno in gl kontekst
var canvas;
var gl;
var shaderProgram;

// Uporabniški vmesnik
var speedometer;
var timer = 0;
var timerDisplay;
var lapCounterDisplay;

// Objekti
var ship;
var box;
var zenska;
var shark;
var rock;
var mansion;

// Bufferji za svet
var worldVertexPositionBuffer = null;
var worldVertexTextureCoordBuffer = null;

// Bufferji za ladjo
var shipVertexPositionBuffer = [];
var shipVertexNormalBuffer = [];
var shipVertexTextureCoordBuffer = [];
var shipVertexIndexBuffer = [];

// Bufferji za škatlo
var boxUpVertexPositionBuffer;
var boxUpVertexNormalBuffer;
var boxUpVertexTextureCoordBuffer;
var boxUpVertexIndexBuffer;

// Bufferji za ženske
var zenskaVertexPositionBuffer = [];
var zenskaVertexNormalBuffer = [];
var zenskaVertexTextureCoordBuffer = [];
var zenskaVertexIndexBuffer = [];

// Bufferji za morske pse
var sharkVertexPositionBuffer = [];
var sharkVertexNormalBuffer = [];
var sharkVertexTextureCoordBuffer = [];
var sharkVertexIndexBuffer = [];

// Bufferji za čeri in skale
var rockVertexPositionBuffer = [];
var rockVertexNormalBuffer = [];
var rockVertexTextureCoordBuffer = [];
var rockVertexIndexBuffer = [];

// Bufferji za hišo
var mansionVertexPositionBuffer = [];
var mansionVertexNormalBuffer = [];
var mansionVertexTextureCoordBuffer = [];
var mansionVertexIndexBuffer = [];

// Matrika pogleda in projekcijska matrika ter sklad za matriko pogleda
var mvMatrixStack = [];
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

// Spremenljivke, ki hranijo teksture za objekte
var terrainTexture;
var shipTexture;
var boxTexture;
var ladyTexture;
var sharkTexture;
var rockTexture;
var mansionTexture;

// Spremenljivka, ki hrani stanje nalaganja tekstur
var texturesLoaded = false;

// Seznam trenutno pritisnjenih tipk
var currentlyPressedKeys = {};

// Spremenljivke za shranjevanje trenutnega položaja v svetu in hitrosti ladje
var directionAngle = -90;
var yawRate = 0;
var xPosition = 100;
var yPosition = 0.4;
var zPosition = 185;
var terainBrake = 1;

// Spremenljivke za checkpointe, čez katere mora ladja.
var checkPoints = [];
var lapcCounter = 0;
var checkPointsCoordiantes = [
  [900, 400],
  [600, 100],
  [400, 100],
  [100, 400],
  [400, 700],
  /* [600, 700],
 */
];
var nextCheckpoint = -1;

// Funkcija, ki vrne naključno mesto na progi
function getRandomPointOnTrack() {
  var randomArray = trackPoints[Math.floor(Math.random() * trackPoints.length)];
  var randomPoint = randomArray[Math.floor(Math.random() * randomArray.length)].map(x => x / 4);
  var boxIcon = document.getElementById("boxIcon");
  boxIcon.style.top = randomPoint[1] - 7;
  boxIcon.style.left = randomPoint[0] - 7;
  return randomPoint;
}

// Pozicija, na kateri ja na začetku škatla je naključno mesto na progi
var randomPoint = getRandomPointOnTrack();
var boxPosition = [randomPoint[0], 1, randomPoint[1]];

// Pomožni spremenljivki za animacijo
var lastTime = 0;
var gameInterval;

// Vrsta škatle
const boxType = {
  CHANGE_TEXTURE: 0,
  SCALE_DOWN: 1,
  SCALE_UP: 2,
  FASTER: 3,
  SLOWER: 4
};

// Funkcije za opracije z matrikami:
// Porini na sklad
function mvPushMatrix() {
  var copy = mat4.create();
  mat4.set(mvMatrix, copy);
  mvMatrixStack.push(copy);
}

// Odstrani iz vrha sklada
function mvPopMatrix() {
  if (mvMatrixStack.length == 0) {
    throw "Invalid popMatrix!";
  }
  mvMatrix = mvMatrixStack.pop();
}

// Pretvori radiane v stopinje
function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

// Inicializacija webGL-a
function initGL(canvas) {
  var gl = null;
  try {
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch (e) { }

  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
  }
  return gl;
}

// Uniformne vrednosti v senčilnikih za matriko pogleda in za projekcijsko matriko ter matriko normale
function setMatrixUniforms() {
  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

  var normalMatrix = mat3.create();
  mat4.toInverseMat3(mvMatrix, normalMatrix);
  mat3.transpose(normalMatrix);
  gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}

// Inicializacija tekstur
function initTextures() {
  terrainTexture = gl.createTexture();
  terrainTexture.image = new Image();
  terrainTexture.image.onload = function () {
    handleTextureLoaded(terrainTexture)
  }
  terrainTexture.image.src = "./assets/newground.png";

  shipTexture = gl.createTexture();
  shipTexture.image = new Image();
  shipTexture.image.onload = function () {
    handleTextureLoaded(shipTexture);
  };  // async loading
  shipTexture.image.src = "./assets/tekstura.png";

  ladyTexture = gl.createTexture();
  ladyTexture.image = new Image();
  ladyTexture.image.onload = function () {
    handleTextureLoaded(ladyTexture);
  };  // async loading
  ladyTexture.image.src = "./assets/okolica/obleke.jpg";

  sharkTexture = gl.createTexture();
  sharkTexture.image = new Image();
  sharkTexture.image.onload = function () {
    handleTextureLoaded(sharkTexture);
  };  // async loading
  sharkTexture.image.src = "./assets/okolica/eye.jpg";

  rockTexture = gl.createTexture();
  rockTexture.image = new Image();
  rockTexture.image.onload = function () {
    handleTextureLoaded(rockTexture);
  };  // async loading
  rockTexture.image.src = "./assets/okolica/GreyBricks2.jpg";

  mansionTexture = gl.createTexture();
  mansionTexture.image = new Image();
  mansionTexture.image.onload = function () {
    handleTextureLoaded(mansionTexture);
  };  // async loading
  mansionTexture.image.src = "./assets/okolica/GreyBricks2.jpg";

  boxTexture = gl.createTexture();
  boxTexture.image = new Image();
  boxTexture.image.onload = function () {
    handleTextureLoaded(boxTexture)
  }; // async loading
  boxTexture.image.src = "./assets/crate.gif";
}

// Pohendlamo teksture
function handleTextureLoaded(texture) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Tretja tekstura uporablja linearno interpolacijo z aproksimacijo na najbčjižji mipmap
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);

  gl.bindTexture(gl.TEXTURE_2D, null);

  texturesLoaded = true;
}

// Spremeni teksturo ladje
function changeTexture() {
  shipTexture = gl.createTexture();
  shipTexture.image = new Image();
  shipTexture.image.onload = function () {
    handleTextureLoaded(shipTexture);
  };
  shipTexture.image.src = "./assets/lgm.png";
}

// Inicializacija sveta
function handleLoadedWorld(data) {
  var lines = data.split("\n");
  var vertexCount = 0;
  var vertexPositions = [];
  var vertexTextureCoords = [];
  for (var i in lines) {
    var vals = lines[i].replace(/^\s+/, "").split(/\s+/);
    if (vals.length == 5 && vals[0] != "//") {
      // It is a line describing a vertex; get X, Y and Z first
      vertexPositions.push(parseFloat(vals[0]));
      vertexPositions.push(parseFloat(vals[1]));
      vertexPositions.push(parseFloat(vals[2]));

      // And then the texture coords
      vertexTextureCoords.push(parseFloat(vals[3]));
      vertexTextureCoords.push(parseFloat(vals[4]));

      vertexCount += 1;
    }
  }

  worldVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW);
  worldVertexPositionBuffer.itemSize = 3;
  worldVertexPositionBuffer.numItems = vertexCount;

  worldVertexTextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexTextureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexTextureCoords), gl.STATIC_DRAW);
  worldVertexTextureCoordBuffer.itemSize = 2;
  worldVertexTextureCoordBuffer.numItems = vertexCount;

  document.getElementById("loadingtext").textContent = "";
}

// Naloži svet
function loadWorld() {
  var request = new XMLHttpRequest();
  request.open("GET", "./assets/world.txt");
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      handleLoadedWorld(request.responseText);
    }
  }
  request.send();
}

// Naloži ladjo
function loadShip() {
  var request = new XMLHttpRequest();
  request.open("GET", "./assets/ladje/ship.json");
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      ship.handleLoaded(JSON.parse(request.responseText));
    }
  }
  request.send();
}

// Naloži škatlo
function loadBox() {
  var request = new XMLHttpRequest();
  request.open("GET", "./assets/powerup.json");
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      box.handleLoaded(JSON.parse(request.responseText));
    }
  }
  request.send();
}

// Naloži ženske
function loadBabe() {
  var request = new XMLHttpRequest();
  request.open("GET", "./assets/okolica/bikini-beach-girl.json");
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      zenska.handleLoaded(JSON.parse(request.responseText));
    }
  }
  request.send();
}

// Naloži morske pse
function loadShark() {
  var request = new XMLHttpRequest();
  request.open("GET", "./assets/okolica/shark-man.json");
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      shark.handleLoaded(JSON.parse(request.responseText));
    }
  }
  request.send();
}

// Naloži skale
function loadRock() {
  var request = new XMLHttpRequest();
  request.open("GET", "./assets/okolica/simple-rock.json");
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      rock.handleLoaded(JSON.parse(request.responseText));
    }
  }
  request.send();
}

// Naloži hišo
function loadMansion() {
  var request = new XMLHttpRequest();
  request.open("GET", "./assets/okolica/medieval-house-2.json");
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      mansion.handleLoaded(JSON.parse(request.responseText));
    }
  }
  request.send();
}

// Naloži drugo vrsto plovila
function loadNewShip() {
  var request = new XMLHttpRequest();
  request.open("GET", "./assets/ladje/boat.json");
  console.log(request);
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      ship.handleLoaded(JSON.parse(request.responseText));
    }
  }
  request.send();
}

function drawWorld(location, directionAngle) {
  // Premaknemo pozicijo risanja tja, kamor želimo začeti z risanjem
  // mat4.rotate(mvMatrix, degToRad(22.5), [1, 0, 0]);
  // mat4.rotate(mvMatrix, degToRad(-directionAngle), [0, 1, 0]);
  mat4.translate(mvMatrix, location);

  // Aktivacija tekstur
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, terrainTexture);
  gl.uniform1i(shaderProgram.samplerUniform, 0);

  // Nastavimo koordinate teskture glede na ogljišča
  gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexTextureCoordBuffer);
  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, worldVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

  // Draw the world by binding the array buffer to the world's vertices
  // array, setting attributes, and pushing it to GL.
  gl.bindBuffer(gl.ARRAY_BUFFER, worldVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, worldVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  // Narišemo sceno
  setMatrixUniforms();
  gl.drawArrays(gl.TRIANGLES, 0, worldVertexPositionBuffer.numItems);
}

// Nariši sceno
function drawScene() {
  // set the rendering environment to full canvas size
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // If buffers are empty we stop loading the application.
  if (worldVertexTextureCoordBuffer == null || worldVertexPositionBuffer == null) {
    return;
  }

  gl.uniform3f(shaderProgram.ambientColorUniform, 0.7, 0.7, 0.7);

  var lightingDirection = [10.0, -4.0, -8.0];
  var adjustedLD = vec3.create();
  vec3.normalize(lightingDirection, adjustedLD);
  vec3.scale(adjustedLD, -1);
  gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);

  gl.uniform3f(shaderProgram.directionalColorUniform, 0.8, 0.8, 0.8);

  // Nastavitev perspektive za pogled na svet - naš pogled je pod kotom 45 stopinj z razmerjem 
  // med višino in širino 640:480, želimo pa videti objekte, ki so med 0.1 in 100 enotami stran od kamere
  mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  mat4.identity(mvMatrix);

  // setMatrixUniforms();

  drawWorld([-xPosition, -yPosition - 3, -zPosition - 5], directionAngle);

  // Ladja
  mvPushMatrix();
  ship.draw([xPosition, yPosition, zPosition - 10], directionAngle);
  ship.setScale(0.3);
  mvPopMatrix();

  // Ženske
  mvPushMatrix();
  zenska.draw([220, 0.4, 90], directionAngle);
  zenska.setScale(0.2);
  mvPopMatrix();

  mvPushMatrix();
  zenska.draw([140, 0.4, 40], directionAngle);
  zenska.setScale(0.2);
  mvPopMatrix();

  mvPushMatrix();
  zenska.draw([90, 0.4, 40], directionAngle);
  zenska.setScale(0.2);
  mvPopMatrix();

  mvPushMatrix();
  zenska.draw([30, 0.4, 100], directionAngle);
  zenska.setScale(0.2);
  mvPopMatrix();

  mvPushMatrix();
  zenska.draw([100, 0.4, 185], directionAngle);
  zenska.setScale(0.2);
  mvPopMatrix();

  // Morski psi
  mvPushMatrix();
  shark.draw([140, 0.4, 130], directionAngle);
  shark.setScale(1);
  mvPopMatrix();

  mvPushMatrix();
  shark.draw([150, 0.4, 160], directionAngle);
  shark.setScale(2.5);
  mvPopMatrix();

  mvPushMatrix();
  shark.draw([120, 0.4, 100], directionAngle);
  shark.setScale(1);
  mvPopMatrix();

  mvPushMatrix();
  shark.draw([130, 0.4, 110], directionAngle);
  shark.setScale(1);
  mvPopMatrix();

  mvPushMatrix();
  shark.draw([135, 0.4, 130], directionAngle);
  shark.setScale(1.5);
  mvPopMatrix();

  mvPushMatrix();
  shark.draw([155, 0.4, 105], directionAngle);
  shark.setScale(1.5);
  mvPopMatrix();

  mvPushMatrix();
  shark.draw([90, 0.4, 130], directionAngle);
  shark.setScale(2);
  mvPopMatrix();

  mvPushMatrix();
  shark.draw([80, 0.4, 90], directionAngle);
  shark.setScale(3);
  mvPopMatrix();

  mvPushMatrix();
  shark.draw([150, 0.4, 140], directionAngle);
  shark.setScale(1);
  mvPopMatrix();

  mvPushMatrix();
  shark.draw([160, 0.4, 100], directionAngle);
  shark.setScale(1);
  mvPopMatrix();

  mvPushMatrix();
  shark.draw([210, 0.4, 75], directionAngle);
  shark.setScale(1);
  mvPopMatrix();

  mvPushMatrix();
  shark.draw([210, 0.4, 55], directionAngle);
  shark.setScale(1);
  mvPopMatrix();

  // Skale
  mvPushMatrix();
  rock.draw([110, 0.4, 140], directionAngle);
  rock.setScale(1);
  mvPopMatrix();

  mvPushMatrix();
  rock.draw([70, 0.4, 170], directionAngle);
  rock.setScale(1.5);
  mvPopMatrix();

  mvPushMatrix();
  rock.draw([35, 0.4, 55], directionAngle);
  rock.setScale(3);
  mvPopMatrix();

  mvPushMatrix();
  rock.draw([220, 0.4, 10], directionAngle);
  rock.setScale(1);
  mvPopMatrix();

  mvPushMatrix();
  rock.draw([220, 0.4, 40], directionAngle);
  rock.setScale(2);
  mvPopMatrix();

  // Hiša
  mvPushMatrix();
  mansion.draw([180, 0.4, 120], directionAngle);
  mansion.setScale(2);
  mvPopMatrix();

  mvPushMatrix();
  mansion.draw([70, 0.4, 120], directionAngle);
  mansion.setScale(1.5);
  mvPopMatrix();

  // Škatla
  if (box.getVisible()) {
    box.draw(boxPosition);
  }
}

// Animacija - kličemo vsakič pred ponovnim izrisom scene
function animate() {
  var timeNow = new Date().getTime();
  if (lastTime != 0) {
    var elapsed = timeNow - lastTime;
    if (lapcCounter > 0) {
      timer += elapsed / 1000;
    }

    ship.animate(directionAngle, elapsed);

    box.animate(elapsed);

    // Normal steering direction when moving forward
    // Reverse steering direction when moving backwards    
    if (ship.getSpeed() > 0 || ship.accelerating)
      directionAngle += yawRate * elapsed;
    else if (ship.getSpeed() < 0 || ship.braking)
      directionAngle -= yawRate * elapsed;

    // Or Default
    // directionAngle += yawRate * elapsed;

  }
  lastTime = timeNow;
}

// Funkcije za upravjanje s tipkovnico
// Kličemo ko je tipka pritisnjena
function handleKeyDown(event) {
  // storing the pressed state for individual key
  currentlyPressedKeys[event.keyCode] = true;
}

// Kličemo, ko spustimo tipko
function handleKeyUp(event) {
  // reseting the pressed state for individual key
  currentlyPressedKeys[event.keyCode] = false;
}

//
// Handlanje tipk tipkovnice
// Pokličemo vedno preden izrišemo sceno. Funkcija posodobi pomožne spremenljivke
function handleKeys() {

  if (ship.getSpeed() != 0 && (currentlyPressedKeys[37] || currentlyPressedKeys[65])) {
    // Left cursor key or A
    yawRate = 0.05;
  } else if (ship.getSpeed() != 0 && (currentlyPressedKeys[39] || currentlyPressedKeys[68])) {
    // Right cursor key or D
    yawRate = -0.05;
  } else {
    yawRate = 0;
  }

  if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) {
    if (isShipOnTrack(xPosition * 4, (zPosition - 10) * 4) <= 20 || ship.getSpeed() <= 0.0075)
      terainBrake = 0;
    else
      terainBrake = 0.00014;
    // Up cursor key or W
    if (ship.getSpeed() <= 0.025)
      ship.setSpeed(ship.getAcceleration() - terainBrake);
    ship.accelerating = true;
  } else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) {
    if (isShipOnTrack(xPosition * 4, (zPosition - 10) * 4) <= 20 || ship.getSpeed() >= -0.0025)
      terainBrake = 0;
    else
      terainBrake = 0.00014;
    // Down cursor key
    if (ship.getSpeed() > -0.005)
      ship.setSpeed(-ship.getAcceleration() + terainBrake);
    ship.braking = true;
  } else {
    // hitrost = 0;
    ship.accelerating = false;
    ship.braking = false;
  }

  if (!ship.accelerating && ship.getSpeed() > 0.0001) {
    ship.setSpeed(-ship.brakeForce);
  }
  else if (!ship.braking && ship.getSpeed() < -0.0001) {
    ship.setSpeed(ship.brakeForce);
  }
  else if (!ship.accelerating && !ship.braking) {
    ship.speed = 0;
  }
}

// Funkcija, ki preveri, če je ladja na naši progi
function isShipOnTrack(xA, yA) {
  let distances = trackPoints.map(list => {
    return Math.min.apply(null, list.map(mat => {
      let bx = mat[0];
      let by = mat[1];
      return Math.sqrt(Math.pow(bx - xA, 2) + Math.pow(by - yA, 2));
    }));
  });
  return Math.min.apply(null, distances);
}

// Funkcija, ki poskrbi za checkpointe na progi
function handleTrack() {
  var shipIcon = document.getElementById("shipIcon");
  shipIcon.style.top = zPosition - 10;
  shipIcon.style.left = xPosition - 5;

  if (xPosition < 1 || xPosition > 254 || zPosition < 12 || zPosition > 254) {
    if (nextCheckpoint == 0) {
      xPosition = 150;
      zPosition = 185;
    } else {
      var checkp;
      if (nextCheckpoint == -1) {
        var checkp = checkPointsCoordiantes[checkPointsCoordiantes.length - 1];
      } else {
        var checkp = checkPointsCoordiantes[nextCheckpoint - 1];
      }
      xPosition = checkp[0] / 4;
      zPosition = checkp[1] / 4 + 10;
    }
  }
}

// Funckija, ki reagira na trke
function handleCollision() {
  if (Math.sqrt(Math.pow(xPosition - randomPoint[0], 2) + Math.pow(zPosition - randomPoint[1] - 10, 2)) < 2) {
    randomPoint = getRandomPointOnTrack();
    boxPosition = [randomPoint[0], 1, randomPoint[1]];
    box.generate();
  }
}

// Funkcija, ki poskrbi za checkpointe na progi
function handleCheckpoints() {
  if (nextCheckpoint == -1) {
    if (isShipOnCheckpoint([600, 700])) {
      nextCheckpoint++;
      lapcCounter++;
      if (lapcCounter < 4) {
        lapCounterDisplay.innerText = lapcCounter;
      }
      if (lapcCounter == 4) {
        clearInterval(gameInterval);;
        window.location = "end-win.html";
      }
    }
  } else if (isShipOnCheckpoint(checkPointsCoordiantes[nextCheckpoint])) {
    if (nextCheckpoint == -1) {
    } else {

    }
    nextCheckpoint++;
    if (nextCheckpoint == checkPoints.length) {
      nextCheckpoint = -1;
    }
  } else {
  }
  if (nextCheckpoint != -1) {
    checkPoints[nextCheckpoint].classList.add("activeCheckpoint");
  }
  if (nextCheckpoint > 0) {
    checkPoints[nextCheckpoint - 1].classList.remove("activeCheckpoint");
  } else if (nextCheckpoint == -1) {
    checkPoints[checkPoints.length - 1].classList.remove("activeCheckpoint");
  }

  // Funckija, ki pogleda, če je ladja na checkpointu
  function isShipOnCheckpoint(cp) {
    // console.log(Math.sqrt(Math.pow(cp[0]/4 - xPosition, 2) + Math.pow(cp[1]/4 - zPosition + 10 , 2)));
    return Math.sqrt(Math.pow(cp[0] / 4 - xPosition, 2) + Math.pow(cp[1] / 4 - zPosition + 10, 2)) < 10;
  }
}

// start - pokličemo, po tem ko se ustvari platno
function start() {
  speedometer = document.getElementById("speedometer");
  timerDisplay = document.getElementById("timer");
  lapCounterDisplay = document.getElementById("lapCounterNumber");

  canvas = document.getElementById("glcanvas");

  gl = initGL(canvas);      // Initialize the GL context

  // Only continue if WebGL is available and working
  if (gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
    gl.clearDepth(1.0);                                     // Clear everything
    gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
    gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things

    // Initialize the shaders; this is where all the lighting for the
    // vertices and so forth is established.
    initShaders();

    // Next, load and set up the textures we'll be using.
    initTextures();

    // Inicializacija objektov v svetu
    ship = new Ship();
    box = new Box();
    zenska = new Zenska();
    shark = new Shark();
    rock = new Rock();
    mansion = new Mansion();

    loadWorld();
    loadShip();
    loadBox();
    loadBabe();
    loadShark();
    loadRock();
    loadMansion();

    box.setVisible(true);

    let i = 0;
    checkPoints = checkPointsCoordiantes.map(x => {
      var checkpoint = document.createElement("div");
      checkpoint.setAttribute("class", "checkpoint");
      checkpoint.setAttribute("seqN", i++);
      checkpoint.style.left = x[0] / 4 - 5;
      checkpoint.style.top = x[1] / 4 - 5;
      document.querySelector("#minimap").appendChild(checkpoint);
      return checkpoint;
    });

    // Bind keyboard handling functions to document handlers
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    // Set up to draw the scene periodically.
    gameInterval = setInterval(function () {
      if (texturesLoaded) { // only draw scene and animate when textures are loaded.
        requestAnimationFrame(animate);
        handleKeys();
        drawScene();
        handleTrack();
        handleCollision();
        handleCheckpoints();

        if (timer > 120) {
          window.location = "end-lose.html";
        }

        this.speedometer.innerHTML = "<span>" + Math.abs(Math.floor(5000 * ship.getSpeed())) / 100 + "<br/>mph</span>";
        this.timerDisplay.innerHTML = "<span>" + "ČAS: " + Math.floor(timer) + "s</span>";

        switch (box.getType()) {
          case boxType.CHANGE_TEXTURE: {
            changeTexture();
            loadNewShip();
            break;
          } case boxType.SCALE_DOWN:
            ship.setScale(0.2);
            break;
          case boxType.SCALE_UP:
            ship.setScale(1.5);
            break;
          case boxType.FASTER:
            ship.setAcceleration(0.0005);
            break;
          case boxType.SLOWER:
            ship.setAcceleration(0.00001);
            break;
          default:
            break;
        }
      }
    }, 15);
  }
}
