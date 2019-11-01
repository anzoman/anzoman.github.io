let campPicture;
let currentCampShowing;
let count = 0;
let newCamps = 0;
let searchOpened = false;
let draggingCamp;
let avtokampi = [{
    identificator: `e-${++count}`,
    naziv: "KAMP NJIVICE",
    opis: `Kamp Njivice je uvrščen med NaJboljše hrvaške kampe 
        se nahaja ob morju
        obdan je s hrastovim gozdom, zaradi česar je v njem idealna senca
        na novo urejene parcele tudi do 120m2
        elektrika in voda na vsaki parceli
        edinstvene mobilne hišice ob samem morju
        Cabana bar&more prelep lounge bar na plaži`,
    cena: "50",
    kraj: "otok Krk",
    slika: "img/njivice.jpg",
    mnenja: []
},
{
    identificator: `e-${++count}`,
    naziv: "KAMP STRAŠKO",
    opis: `Doživite neverjetne sončne zahode, uživajte v kino večerih, 
        preizkusite okusne dalmatinske kulinarične specialitete 
        ali enostavno uživajte v neokrnjeni naravi otoka Paga!
        Kamp se nahaja ob morju v čudovitem zalivu, razprostira 
        se na 57 ha gozda dalmatinskega hrasta in olive ter je s tem eden 
        izmed največjih in vodilnih kampov na Jadranu ter na Hrvaškem.`,
    cena: "80",
    kraj: "otok Pag",
    slika: "img/strasko.jpg",
    mnenja: []
},
{
    identificator: `e-${++count}`,
    naziv: "KAMP STELLA",
    opis: `Če bi radi bili v središču dogajanja, ki obsega vse od teniškega turnirja 
          ATP do nešteto priložnosti za zabavo in dejavnosti, je Stella Maris najboljši kamp za vas. 
          Tukaj bodo tudi otroci lahko vsak dan počeli nekaj drugega. Kamp je bil preurejen leta 2018 
          in ima nov večji bazen, restavracijo in območje recepcije, otroška igrišča, urejene parcele 
          in mobilne hišice: vse samo nekaj korakov od plaže.`,
    cena: "40",
    kraj: "Umag",
    slika: "img/umag.jpg",
    mnenja: []
}
];
let priljubljeniAvtokampi = [];

function openNav() {
    document.getElementById("sidebar").style.width = "80%";
}

function closeNav() {
    document.getElementById("sidebar").style.width = "0";
}

function showForm() {
    $('#obrazec').show();
}

function hideForm() {
    $('#obrazec').hide();
}

function addCamp() {
    avtokamp = {
        identificator: `e-${++count}`,
        naziv: $('#naziv').val(),
        opis: $('#opis').val(),
        cena: $('#cena').val(),
        kraj: $('#kraj').val(),
        slika: campPicture,
        mnenja: []
    }

    avtokampi.push(avtokamp);
    localStorage.setItem(newCamps++, JSON.stringify(avtokamp));

    $('.grid-container div:last').before($(`<div class="${avtokamp.identificator}" onclick="showInfo(this)" draggable="true" ondragstart="drag(this.className)"></div>`));
    $(`.${avtokamp.identificator}`).append(`<a href="#prikaz"><p>${avtokamp.naziv}</p></a>`)
    $(`.${avtokamp.identificator}`).css({
        backgroundSize: 'cover',
        backgroundImage: "url(" + avtokamp.slika + ")",
        transition: 'all 0.3s ease-in-out'
    });

    hideForm();
    document.getElementById("form").reset();
}

function deleteCamp() {
    if (confirm("IZBRIŠEM KAMP?")) {
        deleteElement(currentCampShowing.identificator);
        $(`.${currentCampShowing.identificator}`).remove();
    }
}

function addCampToFavourites() {
    if (!priljubljeniAvtokampi.includes(currentCampShowing)) {
        priljubljeniAvtokampi.push(currentCampShowing);
        displayFavourites();
    }
}

function hideFavourites() {
    $('.info2').empty();
}

function removeFromFavourites(i) {
    if (confirm("Ali res želite odtraniti?")) {
        priljubljeniAvtokampi.splice(i, 1);
        document.getElementById("favtable").deleteRow(i++);
    }
    displayFavourites();
}

function displayFavourites() {
    hideFavourites();
    $('.info2').append(`<table id="favtable">
                            <thead>
                                <h2 style="text-align: center;">PRILJUBLJENI AVTOKAMPI</h2>
                                <caption></caption>
                                <hr>
                                <tr>
                                    <th>AVTOKAMP</th>
                                    <th>LOKACIJA</th>
                                    <th>CENA</th>
                                </tr>
                            </thead>
                        </table>`);
    for (let i = 0; i < priljubljeniAvtokampi.length; i++) {
        let kamp = priljubljeniAvtokampi[i];
        $('#favtable tbody').append(
            `<tr>
                <td>${kamp.naziv}</td>
                <td>${kamp.kraj}</td>
                <td>${kamp.cena}</td>
                <td><span id='${i}' style='font-size:20px; cursor: pointer; z-index: 800;' onclick='removeFromFavourites(this.id)'>&#10060;</span></td>
            </tr>`);
    }
}

function openSearch() {
    if (!searchOpened) {
        $('#navbar').after(`<div id="search"><form>
        Išči po imenu kampa: <input type="search" id="ime">
        Išči po maksimalni ceni: <input type="range" min="1" max="100" value="50" class="slider" data-show-value="true" id="cena" onchange="updatePointsInput(this.value)">
        <input type="number" data-type="range" name="points" id="points" value="50" min="0" max="100" data-show-value="true" onfocusout="updateSliderInput(this.value)">
        <button type="button" onclick="search()">IŠČI</button>
        <button type="button" class="cancel" onclick="openSearch()">ZAPRI</button>
        <hr>
        </form></div>`);
        searchOpened = true;
    } else {
        $('#search').remove();
        searchOpened = false;
        displayCamps();
    }
}

function updatePointsInput(value) {
    document.getElementById('points').value = value;
}

function updateSliderInput(value) {
    document.getElementById('cena').value = value;
}

function search() {
    let ime = $('#ime').val();
    let cena = parseInt($('#cena').val());
    searchResult = [];
    for (let i = 0; i < avtokampi.length; i++) {
        if (parseInt(avtokampi[i].cena) <= cena && avtokampi[i].naziv.toUpperCase().includes(ime.toUpperCase())) {
            searchResult.push(avtokampi[i]);
        }
    }
    $('.grid-container').find('*').not('.d').not('.plus').remove();
    for (let i = 0; i < searchResult.length; i++) {
        let kamp = searchResult[i];
        $('.grid-container div:last').before($(`<div class="${kamp.identificator}" onclick="showInfo(this)"></div>`));
        $(`.${kamp.identificator}`).append(`<a href="#prikaz"><p>${kamp.naziv}</p></a>`)
        $(`.${kamp.identificator}`).css({
            backgroundSize: 'cover',
            backgroundImage: "url(" + kamp.slika + ")",
            transition: 'all 0.3s ease-in-out'
        });
    }
}

function displayCamps() {
    $('.grid-container').find('*').not('.d').not('.plus').remove();
    for (let i = 0; i < avtokampi.length; i++) {
        let kamp = avtokampi[i];
        $('.grid-container div:last').before($(`<div class="${kamp.identificator}" onclick="showInfo(this)"></div>`));
        $(`.${kamp.identificator}`).append(`<a href="#prikaz"><p>${kamp.naziv}</p></a>`)
        $(`.${kamp.identificator}`).css({
            backgroundSize: 'cover',
            backgroundImage: "url(" + kamp.slika + ")",
            transition: 'all 0.3s ease-in-out'
        });
    }
}

function findElement(className) {
    for (let i = 0; i < avtokampi.length; i++) {
        if (avtokampi[i].identificator === className) {
            return avtokampi[i];
        }
    }
}

function deleteElement(id) {
    for (let i = 0; i < avtokampi.length; i++) {
        if (avtokampi[i].identificator === id) {
            avtokampi.splice(i, 1);
            clearInfo();
            break;
        }
    }
}

function clearInfo() {
    $('.info1').empty();
}

function showInfo(item) {
    clearInfo()
    let className = item.className;
    let element = findElement(className);
    currentCampShowing = element;
    $('.info1').append(`<button style='background-color: red;
                                        color: white;
                                        padding: 14px 20px;
                                        margin: 8px 0;
                                        border: none;
                                        cursor: pointer;
                                        opacity: 0.9;
                                        border-radius: 25px;
                                        float: right;
                                        margin: 5px;' onclick="deleteCamp()">IZBRIŠI</button>`);
    $('.info1').append(`<button style='background-color: blue;
                                        color: white;
                                        padding: 14px 20px;
                                        margin: 8px 0;
                                        border: none;
                                        cursor: pointer;
                                        opacity: 0.9;
                                        border-radius: 25px;
                                        float: right;
                                        margin: 5px;' onclick="displayOppinions()">MNENJE</button>`);
    $('.info1').append(`<button style='background-color: #4CAF50;
                                        color: white;
                                        padding: 14px 20px;
                                        margin: 8px 0;
                                        border: none;
                                        cursor: pointer;
                                        opacity: 0.9;
                                        border-radius: 25px;
                                        float: right;
                                        margin: 5px;' onclick="addCampToFavourites()">MED PRILJUBLJENE</button>`);
    $('.info1').append(`<hr>`);
    $('.info1').append(`<b>AVTOKAMP: ${element.naziv}</b>`);
    $('.info1').append(`<hr>`);
    $('.info1').append(`<p>KRAJ: ${element.kraj}</p>
                       <p>OPIS: ${element.opis}</p>
                       <p>CENA: ${element.cena} €</p>
                       <hr>
                       <img src="${element.slika}"><hr>`);
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            campPicture = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(campId) {
    draggingCamp = findElement(campId);
}

function drop(ev) {
    ev.preventDefault();
    if (!priljubljeniAvtokampi.includes(draggingCamp)) {
        priljubljeniAvtokampi.push(draggingCamp);
        displayFavourites();
    }
}

function newOppinion() {
    $('.info2').empty();
    $('.info2').append(`<div id="newOppinion">
                                <h2 style="text-align: center;">DODAJ SVOJE MNENJE</h2><br>
                                <hr>
                                <textarea id="mnenje" rows="4" cols="50" name="comment" form="form" placeholder="Tu napišite Vaše mnenje o kampu." required></textarea>
                                <button type="button" onclick="addOppinion()">ODDAJ MNENJE</button>
                                <button type="button" class="cancel" onclick="displayOppinions()">PREKLIČI</button>
                        </div>`);
}

function addOppinion() {
    currentCampShowing.mnenja.push($('#mnenje').val());
    displayOppinions();
}

function displayOppinions() {
    $('.info2').empty();
    $('.info2').append(`<table id="opptable">
                            <thead>
                                <h2 style="text-align: center;">${currentCampShowing.naziv} - MNENJA</h2>
                                <caption></caption>
                                <hr>
                                <tr>
                                    <th>MNENJE</th>
                                </tr>
                            </thead>
                        </table>`);
    for (let i = 0; i < currentCampShowing.mnenja.length; i++) {
        let mnenje = currentCampShowing.mnenja[i];
        $('#opptable tbody').append(
            `<tr>
                <td>${mnenje}</td>
            </tr>`);
    }
    $('.info2').append(`<button style='background-color: #4CAF50;
    color: white;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    cursor: pointer;
    opacity: 0.9;
    border-radius: 25px;
    margin: 10px;' onclick="newOppinion()">DODAJ MNENJE</button>`);
}

let music = ["audio/plovi.ogg", "audio/istrijanko.ogg"];
let currentSongIndex = 0;
let currentSong = music[currentSongIndex];

function switchSong() {
    currentSongIndex++;
    if (currentSongIndex == music.length) {
        currentSongIndex = 0;
    }
    currentSong = music[currentSongIndex];
    document.getElementById('mysong').src = currentSong;
}

function loadData() {
    $.each(localStorage, function (key, value) {
        let kamp = JSON.parse(value);
        avtokampi.push(kamp);
        $('.grid-container div:last').before($(`<div class="${kamp.identificator}" onclick="showInfo(this)"></div>`));
        $(`.${kamp.identificator}`).append(`<a href="#prikaz"><p>${kamp.naziv}</p></a>`)
        $(`.${kamp.identificator}`).css({
            backgroundSize: 'cover',
            backgroundImage: "url(" + kamp.slika + ")",
            transition: 'all 0.3s ease-in-out'
        });
    });
}

function clearStorage() {
    localStorage.clear();
    location.reload();
}