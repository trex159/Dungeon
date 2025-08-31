// Variablen
let Name = "";
let Stärke = 0;
let Beruf = "";
let Spezies = "";
let LiveLevel = 0;
let PlayerLevel = 0;
let MonsterLevel = 0;
let Monster = 0;
let Monstername = "";
let freeSieg = 0;
let gegname = "";
let entsch = "";

// Hilfsfunktionen
function rnd(max) {
    return Math.floor(Math.random() * (max + 1));
}

// In-Game Dialog System
function showDialog(message, options = {}) {
    return new Promise((resolve) => {
        const overlay = document.getElementById("dialog-overlay");
        const box = document.getElementById("dialog-box");
        const msg = document.getElementById("dialog-message");
        const inputArea = document.getElementById("dialog-input-area");
        const btnArea = document.getElementById("dialog-btn-area");
        const input = document.getElementById("dialog-input");
        const okBtn = document.getElementById("dialog-ok-btn");
        const closeBtn = document.getElementById("dialog-close-btn");

        msg.innerHTML = message.replace(/\n/g, "<br>");
        inputArea.style.display = options.input ? "" : "none";
        btnArea.style.display = options.input ? "none" : "";
        overlay.style.display = "flex";

        if (options.input) {
            input.value = "";
            input.focus();
            okBtn.onclick = () => {
                overlay.style.display = "none";
                resolve(input.value);
            };
            input.onkeydown = (e) => {
                if (e.key === "Enter") okBtn.click();
            };
        } else {
            closeBtn.onclick = () => {
                overlay.style.display = "none";
                resolve();
            };
        }
    });
}

// Überschreibe alert/prompt
function alert(text) {
    return showDialog(text);
}
function prompt(text) {
    return showDialog(text, { input: true });
}

// Aktueller Status anzeigen
function akt() {
    document.getElementById("lbl1").innerHTML =
        "Name: " + Name + "<br>" +
        "Stärke: " + Stärke + "<br>" +
        "Beruf: " + Beruf + "<br>" +
        "Spezies: " + Spezies + "<br>" +
        "Erfahrung: " + PlayerLevel + "<br>" +
        "Leben: " + LiveLevel;
    if (LiveLevel === 0) tot();
}

// Gegenstände
// Stärkende Flasche
async function geg1() {
    gegname = "Flasche der Starken";
    entsch = await prompt("Du hast eine Stärkende Flasche gefunden, sie macht dich um 3 Stärker oder gibt dir ein Leben dazu. gebe 1 ein um die Stärke zu bekommen. Gebe 2 ein um das Leben zu bekommen.");
    if (entsch === "1") {
        Stärke += 3;
        akt();
        await alert("Du bist nun Stärker");
    } else if (entsch === "2") {
        LiveLevel += 1;
        akt();
        await alert("Du hast nun ein Leben mehr");
    } else {
        await alert("Eingabe ungültig, Angebot ist verfallen");
    }
}

// Grüne Kröte
async function geg2() {
    Stärke -= 1;
    LiveLevel += 1;
    akt();
    await alert("Du hast eine grüne Kröte gefunden, dank ihr hast du nun einen kleinen Bonus: Du hast nun 1 Stärke weniger aber 1 leben mehr!");
}

// Giftiger Kuchen
async function geg3() {
    await alert("Du hast einer alten Oma über die 'Straße der Bestien' geholfen zum dank bekommst du einen Kuchen.");
    await alert("Der Kuchen war giftig!");
    LiveLevel -= 1;
    akt();
}

// Kostenlos Gewinnen Gutschein
async function geg4() {
    freeSieg += 1;
    akt();
    await alert("Du hast einen 'kostenlos Gewinnen Gutschein' gefunden.");
}

// Startbutton
async function cmd1_Click() {
    await alert("Das Spiel dauert so lange, bis Du oder der Endboss besiegt wurde!");
    Name = await prompt("Geben Sie ihren Namen ein:");
    Stärke = 1;
    Beruf = "KEINER";
    Spezies = "KEINE";
    LiveLevel = 1;
    PlayerLevel = 1;
    document.getElementById("cmd1").disabled = true;
    document.getElementById("cmd2").disabled = false;
    document.getElementById("cmd5").disabled = false;
    document.getElementById("cmd6").disabled = false;
    document.getElementById("cmd7").disabled = false;
    freeSieg = 6;
    document.getElementById("cmd5").innerText = "-- Gewinnen -- Noch (" + freeSieg + ") mal.";
    akt();
}

// Buttons
async function cmd2_Click() {
    document.getElementById("cmd2").disabled = true;
    document.getElementById("cmd3").disabled = false;
    document.getElementById("cmd4").disabled = false;
    MonsterLevel = 0; Monster = 0;
    document.getElementById("cmd1").disabled = true;
    if (freeSieg === 0) {
        document.getElementById("cmd5").innerText = "Gewinne verbraucht...";
        document.getElementById("cmd5").disabled = true;
    } else {
        document.getElementById("cmd5").disabled = false;
        document.getElementById("cmd5").innerText = "-- Gewinnen -- Noch (" + freeSieg + ") mal.";
    }
    if (Stärke >= 30) { Endboss(); return; }
    if (Stärke <= 15) { await anfang(); }
    if (Stärke >= 16) { await ende(); }
}

function cmd3_Click() {
    document.getElementById("cmd5").disabled = true;
    document.getElementById("cmd2").disabled = false;
    document.getElementById("cmd3").disabled = true;
    if (MonsterLevel > Stärke) monsterwin();
    else Playerwin_real();
}

async function cmd4_Click() {
    let Fast = rnd(10);

    // Spezies und Beruf Modifikatoren
    if (Spezies === "Halbling" || Spezies === "Zwerg" || Spezies === "Troll") Fast -= 1;
    if (Spezies === "Vampier" && Beruf === "Dieb") {
        Fast += 3;
    } else if (Spezies === "Vampier" || Beruf === "Dieb" || Spezies === "Elf") {
         Fast += 1;
    }

    // Monster Modifikatoren
    if (Monstername === "riese" || Monstername === "Endboss") Fast += 3;
    if (Monstername === "Gesichtsloser") Fast -= 2;
    if (Monstername === "Anwalt" && Beruf !== "Anwalt") {
         Fast = 0;
         await alert("Niemand entkommt dem Gesetz! Flucht wird sofort mit lebenslänglich Gefängniss bestraft.");
         monsterwin();
    }

    if (Fast >= 5) {
        await alert("Flucht gelungen!");
        document.getElementById("cmd2").disabled = false;
        document.getElementById("cmd3").disabled = true;
        document.getElementById("cmd4").disabled = true;
        document.getElementById("cmd5").disabled = true;
    } else {
        await alert("Flucht misslungen");
        document.getElementById("cmd4").disabled = true;
    }
    document.getElementById("cmd1").disabled = true;
}

async function cmd5_Click() {
    freeSieg -= 1;
    document.getElementById("cmd5").innerText = "-- Gewinnen -- Noch (" + freeSieg + ") mal.";
    document.getElementById("cmd5").disabled = true;
    Playerwin();
}

async function cmd6_Click() {
    let rndSpezies = rnd(7);
    if (rndSpezies === 1) Spezies = "Mensch";
    if (rndSpezies === 2) { Stärke += 1; Spezies = "Troll"; }
    if (rndSpezies === 3) Spezies = "Halbling";
    if (rndSpezies === 4) { LiveLevel += 1; Spezies = "Werwolf"; }
    if (rndSpezies === 5) Spezies = "Zwerg";
    if (rndSpezies === 6) Spezies = "Fee";
    if (rndSpezies === 7) Spezies = "Elf";
    if (!Spezies || Spezies.toLowerCase() === "keine") Spezies = "Vampier";
    await alert("Du bist jetzt " + Spezies + ".");
    akt();
    document.getElementById("cmd6").disabled = true;
}

async function cmd7_Click() {
    let rndBeruf = rnd(7);
    if (rndBeruf === 1) Beruf = "Dieb";
    else Beruf = "Arbeitslos";
    if (rndBeruf === 2) { Stärke += 1; Beruf = "Krieger"; }
    if (rndBeruf === 3) { LiveLevel *= 2; Beruf = "Artzt"; }
    if (rndBeruf === 4) { LiveLevel += 1; Beruf = "König"; }
    if (rndBeruf === 5) Beruf = "Hofnarr";
    if (rndBeruf === 6) { Beruf = "Händler"; }
    if (rndBeruf === 7) { Beruf = "Anwalt"; }
    await alert("Du bist jetzt " + Beruf + ".");
    akt();
    document.getElementById("cmd7").disabled = true;
}

// Spielergebnisse
function Playerwin_real() {
    PlayerLevel += 1;
    Playerwin();
}

function Playerwin() {
    alert("Sieg!");
    Stärke += 1;
    akt();
    document.getElementById("cmd2").disabled = false;
    document.getElementById("cmd3").disabled = true;
    document.getElementById("cmd4").disabled = true;
    document.getElementById("cmd1").disabled = true;
    if (Monstername === "Endboss") {
        alert("Du hast das Spiel durchgespielt!");
        document.getElementById("cmd1").disabled = false;
        document.getElementById("cmd2").disabled = true;
        document.getElementById("cmd3").disabled = true;
        document.getElementById("cmd4").disabled = true;
        document.getElementById("cmd5").disabled = true;
        document.getElementById("lbl1").innerHTML = "Du hast gewonnen! <br> Drücke Start um neu zu beginnen. <br> Dein Endlevel war: " + PlayerLevel;
    }
}

function monsterwin() {
    alert("Kampf verloren");
    LiveLevel -= 1;
    PlayerLevel -= 1;
    if (PlayerLevel < 0) PlayerLevel = 0;
    akt();
    if (LiveLevel === 0) tot();
}

function tot() {
    alert("tot");
    document.getElementById("cmd2").disabled = true;
    document.getElementById("cmd3").disabled = true;
    document.getElementById("cmd4").disabled = true;
    document.getElementById("cmd5").disabled = true;
    document.getElementById("cmd6").disabled = true;
    document.getElementById("cmd7").disabled = true;
    document.getElementById("cmd1").disabled = false;
    document.getElementById("lbl1").innerHTML = "Du bist tot! <br> Drücke Start um neu zu beginnen.";
}

// Monsterdefinitionen 
//zuerst die mit ändernden stärken
function zwilling() {
    Monstername = Name + "'s Zwilling";
    MonsterLevel = Stärke + 1;
    if (MonsterLevel > 29) MonsterLevel = 29;
    document.getElementById("lbl2").innerHTML = 
        Monstername + "<br>Wenn du verlierst: Dein Zwilling füllt dich mit Helium bis du platzt!<br>Stärke: " + MonsterLevel + "<br>Er ist wie du, aber er kennt sich hier aus."; 
}

function Dynamit_Typ() {
    Monstername = "Dynamit_Typ";
    MonsterLevel = (Beruf === "Dieb") ? 5 : 10;
    document.getElementById("lbl2").innerHTML =
        "Typ mit Dynamit<br>" +
        "Wenn du verlierst: RIESIEGE EXPLUSION!<br>" +
        "Stärke: " + MonsterLevel;
}

function Anwalt() {
    Monstername = "Anwalt";
    MonsterLevel = (Beruf === "Dieb") ? 13 : 8;
    if (Beruf === "Anwalt") MonsterLevel = PlayerLevel;
    document.getElementById("lbl2").innerHTML =
        "gemeiner Anwalt<br>" +
        "Wenn du verlierst: Du bekommst Lebenslange Gefängnissstrafe!<br>" +
        "Stärke: " + MonsterLevel;
}

function idiot() {
    Monstername = "idiot";
    MonsterLevel = rnd(29);
    document.getElementById("lbl2").innerHTML =
        "Idiot<br>" +
        "Wenn du verlierst: Das kann niemand ahnen!<br>" +
        "Stärke: " + MonsterLevel;
}

// normale monster, sortieung nach stärke
function bob() {
    Monstername = "bob";
    MonsterLevel = 0;
    document.getElementById("lbl2").innerHTML =
        "Bob<br>" +
        "Wenn du verlierst: Bob wird versuchen, dich durch etwas Käse zu trösten.<br>" +
        "Stärke: " + MonsterLevel;
}

function baby() {
    Monstername = "baby";
    MonsterLevel = 0;
    document.getElementById("lbl2").innerHTML =
        "Baby<br>" +
        "Wenn du verlierst: guu gaa<br>" +
        "Stärke: " + MonsterLevel;
}

function Kobold() {
    Monstername = "Kobold";
    MonsterLevel = 1;
    document.getElementById("lbl2").innerHTML =
        "Kobold<br>" +
        "Wenn du verlierst: Der Kobold klaut deine Nase.<br>" +
        "Stärke: " + MonsterLevel;
}

function Ratte() {
    Monstername = "Ratte";
    MonsterLevel = 1;
    document.getElementById("lbl2").innerHTML =
        "Ratte<br>" +
        "Wenn du verlierst: Du bekommst die Pest.<br>" +
        "Stärke: " + MonsterLevel;
}

function Dragon() {
    Monstername = "Dragon";
    MonsterLevel = 2;
    document.getElementById("lbl2").innerHTML =
        "Baby-Drache<br>" +
        "Wenn du verlierst: Deine Knochen werden zu einem tollen Spielzeug.<br>" +
        "Stärke: " + MonsterLevel;
}

function BadMonkey() {
    Monstername = "BadMonkey";
    MonsterLevel = 6;
    document.getElementById("lbl2").innerHTML =
        "Gigantischer Böser Affe<br>" +
        "Wenn du verlierst: Man wird dich mit einer Banane im Hirn finden.<br>" +
        "Stärke: " + MonsterLevel;
}

function shadow() {
    Monstername = "Schatten";
    MonsterLevel = 10;
    document.getElementById("lbl2").innerHTML =
        "Der Schatten<br>" +
        "Wenn du verlierst: Deine Seele wird zerschmettert.<br>" +
        "Stärke: " + MonsterLevel;
}

function Sirene() {
    Monstername = "Sirene";
    MonsterLevel = 14;
    document.getElementById("lbl2").innerHTML =
        Monstername + "<br>" +
        "Wenn du verlierst: Deine Ohren platzen.<br>" +
        "Stärke: " + MonsterLevel;
}

function Basilisk() {
    Monstername = "Basilisk";
    MonsterLevel = 15;
    document.getElementById("lbl2").innerHTML =
        Monstername + "<br>" +
        "Wenn du verlierst: Der Basilisk bekommt eine neue Statue - von dir.<br>" +
        "Stärke: " + MonsterLevel;
}

function fetteRatte() {
    Monstername = "fette Ratte";
    MonsterLevel = 16;
    document.getElementById("lbl2").innerHTML =
        "Große mutierte Ratte<br>" +
        "Wenn du verlierst: Du wirst gefressen.<br>" +
        "Stärke: " + MonsterLevel;
}

function riese() {
    Monstername = "riese";
    MonsterLevel = 20;
    document.getElementById("lbl2").innerHTML =
        "riese<br>" +
        "Wenn du verlierst: Der Riese wird sich ärgern, denn er muss dich von seinen Schuhen abkratzen.<br>" +
        "Stärke: " + MonsterLevel;
}

function jonny() {
    Monstername = "Jonny, der Buttler";
    MonsterLevel = 21;
    document.getElementById("lbl2").innerHTML =
        Monstername + "<br>Wenn du verlierst: Jonny wird dich verprügeln<br>Stärke: " + MonsterLevel;
}

function killer() {
    Monstername = "Killer";
    MonsterLevel = 23;
    document.getElementById("lbl2").innerHTML =
        Monstername + "<br>" +
        "Wenn du verlierst: Das willst du gar nicht wissen<br>" +
        "Stärke: " + MonsterLevel;
}

function Drache() {
    Monstername = "Papa Drache";
    MonsterLevel = 25;
    document.getElementById("lbl2").innerHTML =
        Monstername + "<br>" +
        "Wenn du verlierst: Der Drache kann endlich wieder seine Familie ernähren<br>" +
        "Stärke: " + MonsterLevel;
}

function noface() {
    Monstername = "Gesichtsloser";
    MonsterLevel = 25;
    document.getElementById("lbl2").innerHTML =
        "Gesichtsloser<br>" +
        "Wenn du verlierst: Der Gesichtslose bekommt dein Gesicht.<br>" +
        "Stärke: " + MonsterLevel;
}

function einhorn() {
    Monstername = "Fieses Einhorn";
    MonsterLevel = 27;
    document.getElementById("lbl2").innerHTML =
        Monstername + "<br>Wenn du verlierst: Du hast ein Horn im Bauch.<br>Stärke: " + MonsterLevel; 
}

function Henker() {
    Monstername = "Henker";
    MonsterLevel = 29;
    document.getElementById("lbl2").innerHTML =
        Monstername + "<br>Wenn du verlierst: Du wirst einen Kopf kürzer gemacht.<br>Stärke: " + MonsterLevel; 
}

function Endboss() {
    Monstername = "Endboss";
    MonsterLevel = 30;
    document.getElementById("lbl2").innerHTML =
        Monstername + "<br>" +
        "Wenn du verlierst: Du wirst Hackfleisch!<br>" +
        "Stärke: " + MonsterLevel + "<br>" +
        "Beim ihm hilft nur Kampf oder Flucht";
    document.getElementById("cmd5").disabled = true;
}

// Monster
async function anfang() {
    // Leichte Monster (Stärke <= 15)
    Monster = rnd(15);

    if (Monster === 8 || Monster === 9) { await Gegenstand(); return; }

    if (Monster === 1) { Dragon(); }
    if (Monster === 2) { Dynamit_Typ(); }
    if (Monster === 3) { baby(); }
    if (Monster === 4) { riese(); }
    if (Monster === 5) { Basilisk(); }
    if (Monster === 6) { BadMonkey(); }
    if (Monster === 7) { Endboss(); }
    if (Monster === 10) { shadow(); }
    if (Monster === 11) { Kobold(); }
    if (Monster === 12) { Anwalt(); }
    if (Monster === 13) { Sirene(); }
    if (Monster === 14) { zwilling(); }
    if (Monster === 15) { Ratte(); }
    if (Monster === 0) { bob(); } // Fallback/Startmonster
}

async function ende() {
    // Schwere Monster (Stärke >= 16)
    Monster = rnd(13);

    if (Monster === 6) { await Gegenstand(); return; }
    if (Monster === 1) { riese(); }
    if (Monster === 2) { Drache(); }
    if (Monster === 3) { killer(); }
    if (Monster === 4) { einhorn(); }
    if (Monster === 5) { zwilling(); }
    if (Monster === 7) { jonny(); }
    if (Monster === 8) { noface(); }
    if (Monster === 9) { Henker(); }
    if (Monster === 10) { fetteRatte(); }
    if (Monster === 11) { idiot(); }
    if (Monster === 12 || Monster === 13) { anfang(); } // Leichtes Monster

    if (Monster === 0) { Endboss(); } // Fallback/Startmonster
}

// Spezialfunktion: Gegenstandsauswahl
async function Gegenstand() {
    document.getElementById("cmd2").disabled = false;
    document.getElementById("cmd3").disabled = true;
    document.getElementById("cmd4").disabled = true;
    document.getElementById("cmd5").disabled = true;
    let rndgeg = rnd(7);
    if (rndgeg === 1 || rndgeg === 4) { await geg1(); return; }
    if (rndgeg === 2 || rndgeg === 5) { await geg3(); return; }
    if (rndgeg === 3) { await geg4(); return; }
    if (rndgeg === 6 || rndgeg === 7) { await geg2(); return; }
    await geg2();
}

// Events mit Buttons verbinden
document.getElementById("cmd1").addEventListener("click", cmd1_Click);
document.getElementById("cmd2").addEventListener("click", cmd2_Click);
document.getElementById("cmd3").addEventListener("click", cmd3_Click);
document.getElementById("cmd4").addEventListener("click", cmd4_Click);
document.getElementById("cmd5").addEventListener("click", cmd5_Click);
document.getElementById("cmd6").addEventListener("click", cmd6_Click);
document.getElementById("cmd7").addEventListener("click", cmd7_Click);
