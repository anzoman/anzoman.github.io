// Spremenljivke za platno, kontekst, število žogic in seznam žogic ter področje v katerem so odbijajoče se žogice:
let canvas;
let contex;
let steviloZog = 0;
let zogice = [];
let področje = {
    x: 0,
    y: 0,
    width: 1200,
    height: 500
  };

// Inicializacija platna in konteksta:
function init() {
    canvas = document.getElementById("canvas");
    contex = canvas.getContext('2d');
}

// Določanje števila žogic iz vnosnega polja:
function dolociSteviloZogic() {
    steviloZog = document.getElementById("input").value;
    skreirajZoge();
}

// Funkcijo strat pokličem ob pritisku na gumb:
function start() {
    cancelAnimationFrame(animate);
    zogice = [];
    dolociSteviloZogic();
    requestAnimationFrame(animate);
}

// Funkcija, ki zgenerira naključne koordinate znotraj platna:
function generateRandomCoordinates() {
    var x = Math.floor(Math.random() * področje.width - 5) + 5;
    var y = Math.floor(Math.random() * področje.height - 5) + 5;
    return [x, y];
}

// Funkcija, ki zgenerira naključno hitrost žogici (med 1 in 6):
function generateRandomSpeed() {
    return Math.floor(Math.random() * 6 + 1);
}

// Funkcija, ki ustvari želeno število žog in jih doda v seznam (žoga je predstavljena kot nek slovar):
function skreirajZoge() {
    for(let i = 0; i < steviloZog; i++) {
        let point = generateRandomCoordinates();
        let element = {x: point[0], 
                       y: point[1], 
                       r: 7,
                       vx: generateRandomSpeed(),
                       vy: generateRandomSpeed(),
                       color: "#ffffff"}
        zogice.push(element);
    }
}

// Funkcija za zaznavanje kolizije (vzamem po dve zogici in preverim ce je razdalja med njima manjša od vsote polmerov - to pomeni trk):
function detectColision() {
    for (var i = 0; i < zogice.length - 1; i++) {
        for (var j = i; j < zogice.length - 1; j++) {
            var dx = zogice[j + 1].x - zogice[i].x;
            var dy = zogice[j + 1].y - zogice[i].y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < zogice[j + 1].r + zogice[i].r) {
                zogice[i].color = "#ff0000";
                zogice[j + 1].color = "#ff0000";
            }
        }
    }
}

// Funkcija, ki izriše žogice in ji mustrezno spreminja koordinate glede na hitrost ter odboj od robov platna:
function animate() {

  contex.fillStyle = "#000000";
  contex.fillRect(področje.x, področje.y, področje.width, področje.height);

  for (var i = 0; i < zogice.length; i++) {
    contex.beginPath();
    contex.fillStyle = zogice[i].color;
    contex.arc(zogice[i].x, zogice[i].y, zogice[i].r, 0, Math.PI * 2, true);
    contex.fill()


    if (zogice[i].x - zogice[i].r + zogice[i].vx < področje.x || zogice[i].x + zogice[i].r + zogice[i].vx > področje.x + področje.width) {
      zogice[i].vx = -zogice[i].vx;
    }

    if (zogice[i].y + zogice[i].r + zogice[i].vy > področje.y + področje.height || zogice[i].y - zogice[i].r + zogice[i].vy < področje.y) {
      zogice[i].vy = -zogice[i].vy;
    }

    zogice[i].x += zogice[i].vx
    zogice[i].y += zogice[i].vy
  }

  detectColision();

  requestAnimationFrame(animate);
}

