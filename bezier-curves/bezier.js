// Spremenljivka, ki hrani navodila za uporabo v seznamu:
const navodila = [["NAVODILA : Zgoraj so gumbi, s katerimi nastaviš način delovanja platna"],
                  ["RISANJE KRIVULJ: rišeš lahko Bezierove zlepke, če želiš zlepek prekiniti klikni na ZAKLJUČI KRIVULJO."],
                  ["OZNAČEVANJE TOČK: označiš lahko kontrolne točke in okoli njih se bo pojavil kvadratek"],
                  ["PREMIKANJE TOČK: točko premakneš tako, da se postaviš v kvadratek in jo povlečeš drugam. Izrisala se bo posodobljena krivulja."],
                  ["ODSTRANJEVANJE KRIVULJ: označi vse 4 kontrolne točke neke krivulje, ki jo želiš izbrisati in nato klikni na gumb IZBRIŠI."],
                  ["POBRIŠI PLATNO: Pobriše celotno platno."],
                  ["IZPIŠI NAVODILA: Izpiše ta navodila."],
                  ["SPREMENI BARVO: Izbereš ustrezno barvo in nato klikneš SPREMENI BARVO in barva zlepkov se bo ustrezno spremnila."]]
let instShowed;

// Spremenljivki, ki hranita platno in njegov kontekst:
let canvas;
let context;

// Spemenljivki, ki hranita matriko kontrolnih točk in matriko Bernsteinovih polinomov:
let pointMatrix;
let bernsteinMatrix;

// Spremenljivka za matriko kontrolnih točk krivulje, ki jo odstranjujemo;
let removePointMatrix;

// Spremenljivke, ki hranijo točke na platnu:
let controlPoints;  // vse kontrolne točke
let calculatedPoints;  // vse izračunane točke, ki se interpolirajo
let pointsToCheck;  // točke, pri katerih se preverja kolinearnost
let pointsToMove;  // točke, ki se jih lahko premika
let selectedPoints;  // točke, ki smo jih označili za premikanje
let selectedPoint;  // točka, ki jo trenutno premikamo
let pointsToRemove;  // točke, ki jih je treba odstraniti

// Spremenljivki, ki beležita, ali je bila točka izbrana/premaknjena;
let pointSelected;
let pointMoved;

// Spremenljivka, ki hrani trenutnega poslušalce:
let currentEventListeners;

// Spremljivka za miško:
let mouseIsDown;

// Spremenljivka za odstranjevanje krivulj:
let removeButtonIsPressed;

// Spremenljivka, ki pove, ali je treba zaključiti nek zlepek;
let newCurve;

// Inicializacijska metoda, ki se pokliče, ko se stran naloži:
function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext('2d');
    startMessage();
    bernsteinMatrix = [[1, -3, 3, -1],
                       [0, 3, -6, 3],
                       [0, 0, 3, -3],
                       [0, 0, 0, 1]];
    pointMatrix = [[], []];
    controlPoints = [];
    calculatedPoints = [];
    pointsToCheck = [];
    pointsToMove = [];
    currentEventListeners = [];
    selectedPoints = [];
    pointsToRemove = [];
    selectedPoint = "";
    pointSelected = false;
    pointMoved = false;
    mouseIsDown = false;
    removeButtonIsPressed = false;
    instShowed = false;
    newCurve = false;
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// RISANJE BEZIEROVIH KRIVULJ:
// Funkcija, ki naredi prostor zgoraj na levi strani platna, kamor se izpiše način delovanja platna:
function drawMessagePlace() {
    context.strokeStyle = "#000000";
    context.beginPath();
    context.moveTo(0, 30);
    context.lineTo(120, 30);
    context.moveTo(120, 30);
    context.lineTo(120, 0);
    context.stroke();
}

// Funkcija za pridobivanje miškinih koordinat:
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

// Funkcija za pisanje sporočila oz. načina delovanja na platno:
function writeMessage(canvas, message, color = "black", size = 20, clear = true) {
    if (clear)
        context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = size + 'pt Calibri';
    context.fillStyle = color;
    context.fillText(message, 10, 20);
}

// Funkcija, ki izpiše začetno sporočilo:
function startMessage() {
    context.clearRect(0, 0, 120, 30);
    writeMessage(canvas, "NAČIN DELOVANJA", "black", 10, false);
    drawMessagePlace();
}

// Funkcija za množenje matrik poljubne velikosti:
function multiplyMatrix(a, b) {
    let aNumRows = a.length;
    let aNumCols = a[0].length;
    let bNumRows = b.length;
    let bNumCols = b[0].length;
    if (aNumCols != bNumRows) {
        return undefined;
    }
    result = [];
    for (var r = 0; r < aNumRows; r++) {
        result[r] = [];
        for (var c = 0; c < bNumCols; c++) {
            result[r][c] = 0;
            for (var i = 0; i < aNumCols; i++) {
                result[r][c] += a[r][i] * b[i][c];
            }
        }
    }
    return result;
}

// Funkcija, ki izračuna koordinate točk skozi katere gre krivulja:
function calculatePoints() {
    let product = multiplyMatrix(pointMatrix, bernsteinMatrix);
    for (let t = 0; t <= 1; t = t + 0.001) {
        calculatedPoints.push(multiplyMatrix(product, [[1], [t], [t ** 2], [t ** 3]]));
    }
}

// Funkcija, ki po potrebi premakne prvo točko nove krivulje in s tem zagotovi zveznost 1. stopnje C:
function moveFirstPointIfNecessary(currentPosition) {
    if (!checkIfPointsAreColinear(pointsToCheck[0], pointsToCheck[1], currentPosition)) {
        let p = calculateLineBetweenPointAndNewPoint(pointsToCheck[0], pointsToCheck[1], currentPosition);
        let ppx = pointMatrix[0].pop();
        let ppy = pointMatrix[1].pop();
        pointMatrix[0].push(p[0]);
        pointMatrix[1].push(p[1]);
        context.fillStyle = "#ff2626";
        context.beginPath();
        context.arc(p[0], p[1], 2, 0, Math.PI * 2, true);
        context.fill();
        pointMoved = true;
        pointsToMove.push([p[0], p[1]]);
    }
    pointsToCheck = [];
}

// Funkcija, ki izračuna in vrne koordinate nove premaknjene točke: 
function calculateLineBetweenPointAndNewPoint(p1, p2, p3) {
    let k = (p2[1] - p1[1]) / (p2[0] - p1[0]);
    let kn = - (1 / k);
    let x = (k * p1[0] - kn * p3[0] + p3[1] - p1[1]) / (k - kn);
    let y = k * (x - p1[0]) + p1[1];
    return [x, y];
}

// Funkcija za preverjanje kolinearnosti treh točk s pomočjo determinante (če je 0 so kolinearne):
function checkIfPointsAreColinear(p1, p2, p3) {
    let determinant = [p2[0] - p1[0], p2[1] - p1[1],
    p3[0] - p1[0], p3[1] - p1[1]];
    let result = (determinant[0][0] * determinant[1][1]) - (determinant[0][1] * determinant[1][0]);
    return result == 0;
}

// Funcija za izris na platno:
function drawCurve() {
    if (pointMatrix[0].length == 4) {
        pointsToCheck.push([pointMatrix[0][2], pointMatrix[1][2]]);
        pointsToCheck.push([pointMatrix[0][3], pointMatrix[1][3]]);
        calculatePoints();
        drawCubicBezierCurve();
        controlPoints.push(pointMatrix);
        pointMatrix = [[pointMatrix[0][3]], [pointMatrix[1][3]]];
    }
}

// Funkcija za izris trenutne Bezierove krivulje:
function drawCubicBezierCurve(fillStyle="#0000ff", fillColor="#000000") {
    for (i = 0; i < calculatedPoints.length - 1; i++) {
        p1 = calculatedPoints[i];
        p2 = calculatedPoints[i + 1];

        if (i % 100 == 1 || i == calculatedPoints.length - 2) {
            context.fillStyle = fillStyle;
            context.beginPath();
            context.fillRect(p1[0][0] - 2, p1[1][0] - 2, 4, 4);
            context.fill();
        }

        context.beginPath();
        context.moveTo(p1[0][0], p1[1][0]);
        context.lineTo(p2[0][0], p2[1][0]);
        context.strokeStyle = fillColor;
        context.stroke();
    }
}

// Funkcija, ki izračuna točke, ki jih je potrebno odstraniti:
function calculatePointsToRemove() {
    let product = multiplyMatrix(removePointMatrix, bernsteinMatrix);
    for (let t = 0; t <= 1; t = t + 0.001) {
        pointsToRemove.push(multiplyMatrix(product, [[1], [t], [t ** 2], [t ** 3]]));
    }
}

// Funkcija, ki odstrani Bezierovo krivuljo:
function removeCubicBezierCurve() {
    for (i = 0; i < pointsToRemove.length - 1; i++) {
        p1 = pointsToRemove[i];
        p2 = pointsToRemove[i + 1];

        if (i % 100 == 1 || i == pointsToRemove.length - 2) {
            context.fillStyle = "#ffffff";
            context.beginPath();
            context.fillRect(p1[0][0] - 3, p1[1][0] - 3, 6, 6);
            context.fill();
        }

        context.beginPath();
        context.moveTo(p1[0][0], p1[1][0]);
        context.lineTo(p2[0][0], p2[1][0]);
        context.lineWidth = 2;
        context.strokeStyle = "#ffffff";
        context.stroke();
    }
    context.lineWidth = 1;
}

// Funkcija, ki označi Bezierovo krivuljo, ki je na vrsti za odstranjevanje:
function tagCubicBezierCurve() {
    for (i = 0; i < pointsToRemove.length - 1; i++) {
        p1 = pointsToRemove[i];
        p2 = pointsToRemove[i + 1];

        context.beginPath();
        context.moveTo(p1[0][0], p1[1][0]);
        context.lineTo(p2[0][0], p2[1][0]);
        context.lineWidth = 3;
        context.strokeStyle = "#000000";
        context.stroke();

        context.beginPath();
        context.moveTo(p1[0][0], p1[1][0]);
        context.lineTo(p2[0][0], p2[1][0]);
        context.lineWidth = 1;
        context.strokeStyle = "#ffffff";
        context.stroke();
    }
    context.lineWidth = 1;
}

// Funkcija, ki izriše vse Bezierove krivulje:
function drawAllCurves(fillCol="#000000") {
    for (var i = 0; i < controlPoints.length; i++) {
        calculatedPoints = [];
        if (controlPoints[i].length == 0) {
            continue;
        }
        pointMatrix = [[controlPoints[i][0][0], controlPoints[i][0][1], controlPoints[i][0][2], controlPoints[i][0][3]],
                       [controlPoints[i][1][0], controlPoints[i][1][1], controlPoints[i][1][2], controlPoints[i][1][3]]];
        
        context.fillStyle = "#ff2626";
        context.beginPath();
        context.arc(controlPoints[i][0][0], controlPoints[i][1][0], 2, 0, Math.PI * 2, true);
        context.fill();
        context.beginPath();
        context.arc(controlPoints[i][0][1], controlPoints[i][1][1], 2, 0, Math.PI * 2, true);
        context.fill();
        context.beginPath();
        context.arc(controlPoints[i][0][2], controlPoints[i][1][2], 2, 0, Math.PI * 2, true);
        context.fill();
        context.beginPath();
        context.arc(controlPoints[i][0][3], controlPoints[i][1][3], 2, 0, Math.PI * 2, true);
        context.fill();

        calculatePoints();
        drawCubicBezierCurve("#0000ff", fillCol);
    }
}

// Funkcija, ki odstrani označeno Bezierovo krivuljo:
function removeTaggedCubicBezierCurve() {
    for (i = 0; i < pointsToRemove.length - 1; i++) {
        p1 = pointsToRemove[i];
        p2 = pointsToRemove[i + 1];

        context.fillStyle = "#ffffff";
        context.beginPath();
        context.fillRect(p1[0][0] - 3, p1[1][0] - 3, 6, 6);
        context.fill();

        context.beginPath();
        context.moveTo(p1[0][0], p1[1][0]);
        context.lineTo(p2[0][0], p2[1][0]);
        context.lineWidth = 4.5;
        context.strokeStyle = "#ffffff";
        context.stroke();
    }
    context.lineWidth = 1;
}

// Funkcija za dodajanje novih točk;
function insertPoints(evt) {
    var mousePosition = getMousePos(canvas, evt);

    pointMatrix[0].push(mousePosition.x);
    pointMatrix[1].push(mousePosition.y);

    pointMoved = false;

    if (pointsToCheck.length == 2) {
        moveFirstPointIfNecessary([mousePosition.x, mousePosition.y]);
    }

    if (!pointMoved) {
        context.fillStyle = "#ff2626";
        context.beginPath();
        context.arc(mousePosition.x, mousePosition.y, 2, 0, Math.PI * 2, true);
        context.fill();
        pointsToMove.push([mousePosition.x, mousePosition.y]);
    }

    drawCurve();
}

// Funckcija, ki doda poslušalca, ki spremlje dodajanje novih točk na platno in kliče ustrezne funkcije:
function addInsertPointsListener() {
    canvas.addEventListener('click', insertPoints, false);
    currentEventListeners.push("insert");
}

// OZNAČEVANJE IN PREMIKANJE VOZLIŠČ:
// Funkcija, ki najde točko, ki smo jo kliknili:
function findClickedPoint(x, y) {
    for (i = 0; i < pointsToMove.length; i++) {
        pm = pointsToMove[i];
        if (x == pm[0] && y == pm[1] || (x > pm[0] - 3 && x < pm[0] + 3 && y > pm[1] - 3 && y < pm[1] + 3)) {
            context.rect(pm[0] - 4, pm[1] - 4, 8, 8);
            context.stroke();
            pointSelected = true;
            selectedPoints.push([pm[0], pm[1]]);
            return [pm[0], pm[1]];
        }
    }
}

// Funkcija za premikanje kontrolnih točk krivulje:
function selectVertices(evt) {
    var mousePosition = getMousePos(canvas, evt);
    findClickedPoint(mousePosition.x, mousePosition.y);
}

// Funkcija, ki doda poslušalca za premikanje kontrolnih točk krivulje:
function selectVerticesListner() {
    canvas.addEventListener('click', selectVertices, false);
    currentEventListeners.push("select vertices");
}

// Funkcija, ki najde izbrano točko;
function findSelectedPoint(x, y) {
    selectedPoint = "";
    for (i = 0; i < selectedPoints.length; i++) {
        sp = selectedPoints[i];
        if (x == sp[0] && y == sp[1] || (x > sp[0] - 3 && x < sp[0] + 3 && y > sp[1] - 3 && y < sp[1] + 3)) {
            selectedPoint = [sp[0], sp[1]];
        }
    }
}

// Funkcija, ki preveri, če je kliknjena točka med izbranimi:
function checkIfPointIsSelected(evt) {
    var mousePosition = getMousePos(canvas, evt);
    var point = findSelectedPoint(mousePosition.x, mousePosition.y);
}

// Poslušalec za preverjanje izbranih točk, ki smo jih kliknili za premik:
function clickForMovementListener() {
    canvas.addEventListener('mousedown', checkIfPointIsSelected, false);
    currentEventListeners.push("movement");
}

// Funkcija za nasltavljanje miškine spremenljivke:
function setMouseDown() {
    mouseIsDown = true;
}

// Poslušalec, ki ustezno nastavi vrednost miškinih spremenljivk:
function mouseDownListener() {
    canvas.addEventListener("mousedown", setMouseDown, false);
    currentEventListeners.push("mousedown");

}

// Funkcija za nasltavljanje miškine spremenljivke:
function setMouseUp() {
    mouseIsDown = false;
}

// Poslušalec, ki ustezno nastavi vrednost miškinih spremenljivk:
function mouseUpListener() {
    canvas.addEventListener("mouseup", setMouseUp, false);
    currentEventListeners.push("mouseup");
}

// Funckija, ki omogoča vlečenje točk po platnu z miško:
function dragPoint(evt) {
    var mousePosition = getMousePos(canvas, evt);
    if (selectedPoint != "") {
        if (mouseIsDown) {
            document.getElementById("canvas").style.cursor = "cell";
        } else {
            document.getElementById("canvas").style.cursor = "default";
            
            context.clearRect(selectedPoint[0] - 5, selectedPoint[1] - 5, 10, 10);

            context.fillStyle = "#ff2626";
            context.beginPath();
            context.arc(mousePosition.x, mousePosition.y, 2, 0, Math.PI * 2, true);
            context.fill();
            context.beginPath();
            context.rect(mousePosition.x - 4, mousePosition.y - 4, 8, 8);
            context.stroke();

            findMovedPointAndSetNewCoordinatesAndDrawNewCurve(mousePosition.x, mousePosition.y);
            selectedPoint = "";
        }
    }
}

// Funkcija, ki doda poslušalca za premikanje točk:
function addDraggingPointListener() {
    canvas.addEventListener('mousemove', dragPoint, false);
    currentEventListeners.push("drag");
}

// Funkcija, ki glede na matrike popravi kontrolne točke in izriše novo krivuljo:
function findMovedPointAndSetNewCoordinatesAndDrawNewCurve(x, y) {
    pointsToMove = [];
    calculatedPoints = [];
    curvePoints = [];
    for (var i = 0; i < controlPoints.length; i++) {

        removePointMatrix = [[controlPoints[i][0][0], controlPoints[i][0][1], controlPoints[i][0][2], controlPoints[i][0][3]],
                             [controlPoints[i][1][0], controlPoints[i][1][1], controlPoints[i][1][2], controlPoints[i][1][3]]];
        calculatePointsToRemove();
        removeCubicBezierCurve();

        if (selectedPoint[0] == controlPoints[i][0][0] && selectedPoint[1] == controlPoints[i][1][0]) {
            controlPoints[i][0][0] = x;
            controlPoints[i][1][0] = y; 
        } else if (selectedPoint[0] == controlPoints[i][0][1] && selectedPoint[1] == controlPoints[i][1][1]) {
            controlPoints[i][0][1] = x;
            controlPoints[i][1][1] = y;
        } else if (selectedPoint[0] == controlPoints[i][0][2] && selectedPoint[1] == controlPoints[i][1][2]) {
            controlPoints[i][0][2] = x;
            controlPoints[i][1][2] = y;
        } else if (selectedPoint[0] == controlPoints[i][0][3] && selectedPoint[1] == controlPoints[i][1][3]) {
            controlPoints[i][0][3] = x;
            controlPoints[i][1][3] = y;
        }
        pointsToMove.push([controlPoints[i][0][0], controlPoints[i][1][0]], [controlPoints[i][0][1], controlPoints[i][1][1]],
                          [controlPoints[i][0][2], controlPoints[i][1][2]], [controlPoints[i][0][3], controlPoints[i][1][3]]);

        pointMatrix = [[controlPoints[i][0][0], controlPoints[i][0][1], controlPoints[i][0][2], controlPoints[i][0][3]],
                       [controlPoints[i][1][0], controlPoints[i][1][1], controlPoints[i][1][2], controlPoints[i][1][3]]];
        
        context.rect(x - 4, y - 4, 8, 8);
        context.strokeStyle == "#ffffff";
        context.lineWidth = 2;
        context.stroke();

        calculatePoints();
        drawCubicBezierCurve();
    }
    context.lineWidth = 1;
}

// BRISANJE ZLEPKOV KRIVULJ:
// Funkcija, ki najde krivuljo, ki smo jo kliknili:
function findClickedCurve() {
    for (var i = 0; i < controlPoints.length; i++) {
        if (controlPoints[i].length == 0) {
            continue;
        }
        let first = false; let second = false; let third = false; let fourth = false;
        for (var j = 0; j < selectedPoints.length; j ++) {
            if (selectedPoints[j][0] == controlPoints[i][0][0] && selectedPoints[j][1] == controlPoints[i][1][0]) {
                first = true;
            } else if (selectedPoints[j][0] == controlPoints[i][0][1] && selectedPoints[j][1] == controlPoints[i][1][1]) {
                second = true;
            } else if (selectedPoints[j][0] == controlPoints[i][0][2] && selectedPoints[j][1] == controlPoints[i][1][2]) {
                third = true;
            } else if (selectedPoints[j][0] == controlPoints[i][0][3] && selectedPoints[j][1] == controlPoints[i][1][3]) {
                fourth = true;
            }
        }
        if (first && second && third && fourth) {
            removePointMatrix = [[controlPoints[i][0][0], controlPoints[i][0][1], controlPoints[i][0][2], controlPoints[i][0][3]],
                                 [controlPoints[i][1][0], controlPoints[i][1][1], controlPoints[i][1][2], controlPoints[i][1][3]]];
            pointsToRemove = [];
            calculatePointsToRemove();
            removeCubicBezierCurve();
            tagCubicBezierCurve();
            if (removeButtonIsPressed) {
                removeButtonIsPressed = false;
                removeTaggedCubicBezierCurve();
                for (var k = 0; k < selectedPoints.length; k ++) {
                    context.fillStyle = "#ffffff";
                    context.fillRect(selectedPoints[k][0] - 6, selectedPoints[k][1] - 6, 12, 12);
                    context.fill();
                }
                controlPoints[i] = [];
                
                context.clearRect(0, 0, canvas.width, canvas.height)
                drawAllCurves();
                drawRemoveButton();
                context.clearRect(0, 0, 120, 30);
                writeMessage(canvas, "BRISANJE", "brown", 15, false);
                drawMessagePlace();
            }
        }
    }
}

function drawRemoveButton() {
    context.fillStyle = "#ff99ff";
    context.fillRect(150, 15, 100, 20);
    context.font = '10pt Calibri';
    context.fillStyle = "#000000";
    context.fillText("IZBRIŠI", 170, 30);
    context.rect(150, 15, 100, 20);
    context.stroke();
}

function removeButtonClicked(x, y) {
    if (x > 150 && x < 250 && y > 15 && y < 35) {
        context.fillStyle = "#ff9933";
        context.fillRect(150, 15, 100, 20);
        context.fillStyle = "#000000";
        context.fillText("IZBRIŠI", 170, 30);
        context.rect(150, 15, 100, 20);
        context.stroke();
        removeButtonIsPressed = true;
    }
}

function buttonClicked(evt) {
    var mousePosition = getMousePos(canvas, evt);
    removeButtonClicked(mousePosition.x, mousePosition.y);
    findClickedCurve();
}

// Funkcija, ki doda poslušalca za premikanje točk:
function addButtonClickedListener() {
    canvas.addEventListener('click', buttonClicked, false)
    currentEventListeners.push("remove")
}

// Funkcija, ki odstrani podanega poslušalca:
function removeListener(listener) {
    switch (listener) {
        case "insert":
            canvas.removeEventListener("click", insertPoints);
            break;
        case "select vertices":
            canvas.removeEventListener("click", selectVertices);
            break;
        case "remove":
            canvas.removeEventListener("click", buttonClicked);
            break;
        case "drag":
            canvas.removeEventListener("mousemove", dragPoint);
            break;
        case "mouseup":
            canvas.removeEventListener("mouseup", setMouseUp);
            break;
        case "mousedown":
            canvas.removeEventListener("mousedown", setMouseDown);
            break;
        default:
            canvas.removeEventListener("mousedown", checkIfPointIsSelected);
    }
}

// Funckija, ki odstrani vse poslušalce;
function removeAllListeners() {
    for (var i = 0; i < currentEventListeners.length; i++) {
        removeListener(currentEventListeners[i]);
    }
    currentEventListeners = [];
}

// Funkcija, ki se omogoča izris na platno ob kliku gumba za izris:
function draw() {
    checkIfInstShowed();
    pointMatrix = [[], []];
    context.clearRect(0, 0, 120, 30);
    writeMessage(canvas, "RISANJE", "red", 15, false);
    drawMessagePlace();
    removeAllListeners();
    addInsertPointsListener();
}

function select() {
    checkIfInstShowed();
    context.clearRect(0, 0, 120, 30);
    writeMessage(canvas, "OZNAČEVANJE", "blue", 10, false);
    drawMessagePlace();
    removeAllListeners();
    selectVerticesListner();
}

function move() {
    checkIfInstShowed();
    context.clearRect(0, 0, 120, 30);
    writeMessage(canvas, "PREMIKANJE", "green", 10, false);
    drawMessagePlace();
    removeAllListeners();
    clickForMovementListener();
    mouseDownListener();
    mouseUpListener();
    addDraggingPointListener();
}

function removeCurves() {
    checkIfInstShowed();
    context.clearRect(0, 0, 120, 30);
    writeMessage(canvas, "BRISANJE", "brown", 15, false);
    drawMessagePlace();
    removeAllListeners();
    drawRemoveButton();
    selectVerticesListner();
    addButtonClickedListener();
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    init();
}

function changeColor() {
    var colorFill = document.getElementById("myColor").value;
    drawAllCurves(colorFill);
}

function endCurve() {
    init()
}

function checkIfInstShowed() {
    if (instShowed) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        instShowed = false;
    }
}

function showInstructions() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = '16pt Cambria';
    context.fillStyle = "0000ff";
    for (var i = 0; i < navodila.length; i++) {
        context.fillText(navodila[i], 10, 70 + i * 50); 
    }
    instShowed = true;
}

