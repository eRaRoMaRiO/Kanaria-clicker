var clicks = 0,
    timer = 0,
    timer2 = 0,
    omeletCount = 0,
    totalPerClick = 1,
    totalPerSec = 0,
    omeletTotal = 0,
    localBonus = 1,
    clickBonusGlobal = 1,
    clickBonus = 0,
    perSecGlobal = 1,
    yakultTime = 120,
    yakultTimer, yakultCount = 0,
    yakultBuff = 1,
    rosaCount = 0,
    rosaCountNext = 0,
    rosaLvl = 0,
    rosaNext, rosaBonus = 1,
    isLapras = false,
    critChanse = 1,
    critValue = 1.5,
    resetWorldCount = 0,
    buyMult = 1,
    laprasTooltip,
    popX,
    popY,
    Pops=[],

    dolls = [],
    hina = {
        name: "hina",
        nameFull: "Hinaichigo",
        lvl: 0,
        mult: 1.3,
        bonus: 1,
        bonusGlobal: 1,
        cost: 20,
        costDef: 20,
        tooltips: ["profit x2", "+20% to all dolls", "profit x2"],
        tooltipsTitle: ["Flower-topped burger!", "Watermelon!", "Unyuu!"]
    },

    desu = {
        name: "desu",
        nameFull: "Suiseiseki",
        lvl: 0,
        mult: 1.3,
        bonus: 1,
        bonusGlobal: 1,
        cost: 200,
        costDef: 200,
        tooltips: ["profit x2", "+30% to all dolls", "profit x2"],
        tooltipsTitle: ["I... hate humans, desu!", "Title 2", "Title 3"]
    },
    boku = {
        name: "boku",
        nameFull: "Souseiseki",
        lvl: 0,
        mult: 1.4,
        bonus: 1,
        bonusGlobal: 1,
        cost: 2000,
        costDef: 2000,
        tooltips: ["profit x2 to Suiseiseki", "- 90% Suiseiseki cost", "profit x2"],
        tooltipsTitle: ["Title 1", "Title 2", "Title 3"]
    },
    shinku = {
        name: "shinku",
        nameFull: "Shinku",
        lvl: 0,
        mult: 1.4,
        bonus: 1,
        bonusGlobal: 1,
        cost: 20000,
        costDef: 20000,
        tooltips: ["- 90% Hina cost", " +2% per/sec to per/click", "x2 to Hina"],
        tooltipsTitle: ["Title 1", "Title 2", "Title 3"]
    },
    ginta = {
        name: "ginta",
        nameFull: "Suigintou",
        lvl: 0,
        mult: 1.5,
        bonus: 1,
        bonusGlobal: 1,
        cost: 200000,
        costDef: 200000,
        tooltips: ["x2 yakult", "- 20 sec to yakult timer", "x2 yakult"],
        tooltipsTitle: ["Title 1", "Title 2", "Title 3"]
    },
    kira = {
        name: "kira",
        nameFull: "Kirakisho",
        lvl: 0,
        mult: 1.8,
        bonus: 1,
        bonusGlobal: 1,
        cost: 2000000,
        costDef: 2000000,
        tooltips: ["-50% all dolls cost", "x1.5 yakult", "profit x2"],
        tooltipsTitle: ["Title 1", "Title 2", "Title 3"]
    },
    bara = {
        name: "bara",
        nameFull: "Barasuishou",
        lvl: 0,
        mult: 1.9,
        bonus: 1,
        bonusGlobal: 1,
        cost: 100000000,
        costDef: 100000000,
        tooltips: ["x2 yakult", "x1.5 Rosa-Mysticas", "x1.5 Rosa-Mysticas"],
        tooltipsTitle: ["Title 1", "Title 2", "Title 3"]
    },

    upgradeText = {
        hina: ` + omelets per click`,
        desu: `+ omelets per second`,
        boku: `Multiply omelets per second`,
        shinku: `Add omelets/click to omelets/sec`,
        ginta: `+ 200 omelets per second \nand yakult production`,
        kira: `+5% value to all dolls`,
        bara: `+ 5000 omelets per second \nand 10% to Rosa-Mysticas production`
    },

    buffs = {
        hina: {
            lvl10: () => {
                hina.bonus *= 2
            },
            lvl25: () => {
                localBonus *= 1.2
            }
        },
        desu: {
            lvl10: () => {
                desu.bonus *= 2
            },
            lvl25: () => {
                localBonus *= 1.3
            }
        },
        boku: {
            lvl10: () => {
                desu.bonus *= 2
            },
            lvl25: () => {
                desu.cost = Math.round(desu.cost * 0.1)
            }
        },
        shinku: {
            lvl10: () => {
                hina.cost = Math.round(hina.cost * 0.1)
            },
            lvl25: () => {
                clickBonus += 0.02
            }
        },
        ginta: {
            lvl10: () => {
                yakultBuff *= 2
            },
            lvl25: () => {
                yakultTime -= 20;
                yakultTimer -= 20;
                yakultProgress.value = (100 / yakultTime) * (yakultTime - yakultTimer);
            }
        },
        kira: {
            lvl10: () => {
                dolls.forEach(function (doll = {name, lvl, cost}) {
                    doll.cost *= 0.5
                })
            },
            lvl25: () => {
                yakultBuff *= 1.5
            }
        },
        bara: {
            lvl10: () => {
                yakultBuff *= 2
            },
            lvl25: () => {
                rosaBonus *= 1.5
            }
        }
    },

    yakultBuffs = [],
    hinaBuff = {
        name: "hina",
        lvl: 0,
        cost: 7,
        target: () => {hina.bonus *= 1.5}
    },
    shinkuBuff = {
        name: "shinku",
        lvl: 0,
        cost: 5,
        target: () => {shinku.bonus *= 1.5}
    },
    desuBuff = {
        name: "desu",
        lvl: 0,
        cost: 10,
        target: () => {desu.bonus *= 2}
    },
    gintaBuff = {
        name: "ginta",
        lvl: 0,
        cost: 8,
        target: () => {ginta.bonus *= 3}
    },

    rmBuffs = [
        // Jun
        [{
                id: "buff00",
                name: "Jun 1 buff",
                text: "% per sec",
                value: 20,
                lvl: 0,
                lvlMax: 10,
                cost: 1,
                lvlUp: () => {
                    perSecGlobal = multBonus(perSecGlobal, rmBuffs[0][0].lvl, 0.2)
                }
            },
            {
                id: "buff01",
                name: "Jun 2 buff",
                text: "% Suiseiseki value",
                value: 50,
                lvl: 0,
                lvlMax: 5,
                cost: 5,
                lvlUp: () => {
                    desu.bonusGlobal = multBonus(desu.bonusGlobal, rmBuffs[0][1].lvl, 0.5)
                }
            },
            {
                id: "buff02",
                name: "Jun 3 buff",
                text: "% Shinku value",
                value: 50,
                lvl: 0,
                lvlMax: 5,
                cost: 5,
                lvlUp: () => {
                    shinku.bonusGlobal = multBonus(shinku.bonus, rmBuffs[0][2].lvl, 0.5)
                }
            }
        ],
        // MicChan
        [{
                id: "buff10",
                name: "MicChan 1 buff",
                text: "% per click",
                value: 20,
                lvl: 0,
                lvlMax: 10,
                cost: 1,
                lvlUp: () => {
                    clickBonusGlobal = multBonus(clickBonusGlobal, rmBuffs[1][0].lvl, 0.2)
                }
            },
            {
                id: "buff11",
                name: "MicChan 2 buff",
                text: "% crit chanse",
                value: 1,
                lvl: 0,
                lvlMax: 15,
                cost: 2,
                lvlUp: () => {
                    critChanse += 1
                }
            },
            {
                id: "buff12",
                name: "MicChan 3 buff",
                text: "% crit value",
                value: 100,
                lvl: 0,
                lvlMax: 5,
                cost: 4,
                lvlUp: () => {
                    critValue += 1
                }
            }
        ],
        //Tomoe
        [{
                id: "buff20",
                name: "Tomoe 1 buff",
                text: "% yakult production",
                value: 100,
                lvl: 0,
                lvlMax: 5,
                cost: 2,
                lvlUp: () => {
                    yakultBuff = multBonus(yakultBuff, rmBuffs[2][0].lvl, 1)
                }
            },
            {
                id: "buff21",
                name: "Tomoe 2 buff",
                text: "% Rosa-Mysticas production",
                value: 10,
                lvl: 0,
                lvlMax: 10,
                cost: 10,
                lvlUp: () => {
                    rosaBonus = multBonus(rosaBonus, rmBuffs[2][1].lvl, 0.1)
                }
            },
            {
                id: "buff22",
                name: "Tomoe 3 buff",
                text: " sec remove from yakult timer",
                value: 10,
                lvl: 0,
                lvlMax: 5,
                cost: 6,
                lvlUp: () => {
                    yakultTime -= 10;
                    yakultTimer -= 10;
                    yakultProgress.value = (100 / yakultTime) * (yakultTime - yakultTimer)
                }
            }
        ],
    ],

    omeletPic = '<img class="icon" src="img/Omelet-icon.png" alt="omelet"></img>',
    yakultPic = '<img class="icon" src="img/Yakult-icon.png" alt="yakult"></img>',
    rosaPic = '<img class="icon" src="img/Rosa-Mystica-icon.png" alt="Rosa-Mystica"></img>';

dolls.push(hina);
dolls.push(desu);
dolls.push(boku);
dolls.push(shinku);
dolls.push(ginta);
dolls.push(kira);
dolls.push(bara);

yakultBuffs.push(hinaBuff);
yakultBuffs.push(shinkuBuff);
yakultBuffs.push(desuBuff);
yakultBuffs.push(gintaBuff);

autoClicker();
detectClick();

document.getElementById("defaultOpen").click();

function l(what) {
    return document.getElementById(what)
}

function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

for (let i = 0; i < rmBuffs.length; i++) {
    for (let k = 0; k < rmBuffs[i].length; k++) {
        checkRMBuffs(rmBuffs[i][k]);
    }
}

l('x1').onclick = function () {buyButton(1)};
l('x10').onclick = function () {buyButton(10)};
l('x25').onclick = function () {buyButton(25)};
l('max').onclick = function () {buyButton('max')};

l('darkFon').onclick = function () {closeAlert()};
l('alertNo').onclick = function () {closeAlert()};
l('alertYes').onclick = function () {
    if (l('alertButtons').classList.contains('windUp')) {
        resetWorld();
    } else {
        resetFull();
    }
    closeAlert()
};

window.onload = function () {
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 1; i < tablinks.length; i++) {
        tablinks[i].style.display = "none";
    }
    tablinks[3].style.display = "block";
    if (localStorage.getItem("omeletCount")) {
        load();
    }
    popsAnimation();
    autoSave();
    for (let i = 0; i < rmBuffs.length; i++) {
        for (let k = 0; k < rmBuffs[i].length; k++) {
            rmBuffs[i][k].tooltip = tooltips(setInnerTextRMBuffs(rmBuffs[i][k]), rmBuffs[i][k].id);
        }
    }
}

function detectClick(){
    firstClick.onmousemove = function (event) {
        event = event || window.event;
        popX = event.pageX;
        popY = event.pageY;
    }
}

omelet.onmousemove = function (event) {
    event = event || window.event;
    popX = event.pageX;
    popY = event.pageY;
}

// Short Numbers:
var formatShort = ['k', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No'];

function short(value) {
    var base = 0,
        notationValue = '';
    if (value == Infinity) {
        return 'Infinity';
    }
    if (value >= 10000) {
        value /= 1000;
        while (Math.round(value) >= 1000) {
            value /= 1000;
            base++;
        }
        if (base >= formatShort.length) {
            return 'Infinity';
        } else {
            notationValue = formatShort[base];
        }
    }
    return (Math.round(value * 100) / 100) + " " + notationValue;
};

///////////////////////////////////////////////////
// User interface:
///////////////////////////////////////////////////

function showAlert(what) {
    console.log(what);
    if (what == 123) {
        l('alertButtons').classList.add('windUp');
        l('titleAlert').innerHTML = 'Reset World';
        l('textAlert').innerHTML = `Do you want to abandon this world? <br> You will receive ${rosaCountNext} ${rosaPic}`;
        l('alertYes').innerHTML = 'Wind up';
        l('alertNo').innerHTML = 'Don\'t wind up';
    } else {
        l('alertButtons').classList.remove('windUp');
        l('titleAlert').innerHTML = 'Hard reset';
        l('textAlert').innerHTML = 'Do you want to wipe your save? <br> You will lose all your progress!';
        l('alertYes').innerHTML = 'Yes';
        l('alertNo').innerHTML = 'No';
    }
    l('darkFon').style.display = ('block');
    l('alertWindow').style.display = ('block');
}

function closeAlert() {
    l('darkFon').style.display = 'none'
    l('alertWindow').style.display = 'none'
}

function showPopUp(text) {
    note.innerHTML = text;
    note.style.display = "block";
    setTimeout(function () {
        note.style.display = "none";
    }, 5000);
}

function buyButton(x) {
    buttons = document.getElementsByClassName("buyButton");
    for (i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('buttonActive');
    }
    if (x == 1) {
        x1.classList.add('buttonActive');
    } else if (x == 10) {
        x10.classList.add('buttonActive');
    } else if (x == 25) {
        x25.classList.add('buttonActive');
    } else {
        max.classList.add('buttonActive');
    }
    buyMult = x;
    refresh();
}

function deleteClick(noClick) {
    firstClick.outerHTML = "<div id ='firstClick'></div>";
    counters.style.display = "block";
    if (!noClick) {
        clickOmelet();
    }
}

function tooltips(text, id) {
    tooltip = new Tooltip(document.getElementById(id), {
        title: text,
        id: id,
        trigger: "hover",
        delay: {
            show: 500,
        },
        html: true,

    });
    return tooltip;
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function openTabRM(evt, tabName) {
    var i, tabcontentRM, tablinksRM;
    tabcontentRM = document.getElementsByClassName("tabcontentRM");
    for (i = 0; i < tabcontentRM.length; i++) {
        tabcontentRM[i].style.display = "none";
    }
    tablinksRM = document.getElementsByClassName("tablinksRM");
    for (i = 0; i < tablinksRM.length; i++) {
        tablinksRM[i].className = tablinksRM[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

//Cheats
function cheatOn() {
    let text = (code.value).toLowerCase();
    if (text == "cheats on" || text == "iddqd" || text == "greedisgood") {
        cheatButtons.style.display = "block";
        showPopUp("Cheats on");
    }
    if (text == "cheats off") {
        cheatButtons.style.display = "none";
        showPopUp("Cheats off");
    }
    document.getElementById("defaultOpen").click();
}

function cheat(x, target) {
    if (target == 'omelet') {
        omeletCount += x;
        omeletTotal += x;
    }
    if (target == 'minute') {
        omeletCount += 60 * x * totalPerSec;
        omeletTotal += 60 * x * totalPerSec;
        if (ginta.lvl) {
            yakultTimer -= 60 * x;
            l('yakultProgress').value = (100 / yakultTime) * (yakultTime - yakultTimer);
        }
    }
    if (target == 'yakult') {
        yakultCount += x;
        refreshYakult();
    }
    if (target == 'rm') {
        rosaCount += x;
        refreshRM();
    }
    refresh();
}

///////////////////////////////////////////////////
// Game mechanics:
///////////////////////////////////////////////////

function buy(x, cost, mult) {
    let step = cost,
        result = cost;
    for (let i = 0; i <= (x - 2); i++) {
        step = Math.round(step * mult);
        result += step;
    }
    return result;
}

function buyMax(cost, mult) {
    let step = cost,
        result = cost;
    n = 0;
    while (result <= omeletCount) {
        n++;
        step = Math.round(step * mult);
        result += step;
    }
    return n;
}

function setInnerTextBuffs(doll, x, lvl) {
    return `<div><span class = "titleBuff" >${doll.tooltipsTitle[x]}</span>\n\n <span class = "levelBuff" >${doll.tooltips[x]}</span> \n\nRequires level: ${lvl}</div>`
}
Pop = function (el, str, popX, popY, isCrit) {
    this.el = el;
    this.str = str;
    this.life = 0;
    this.popX = popX;
    this.popY = popY;
    this.isCrit = isCrit;
    this.offx = Math.floor(Math.random() * 30 - 15);
    this.offy = Math.floor(Math.random() * 30 - 15);
    Pops.push(this);
}

var popsAnimation = function () {
    var str = '';
    for (var i in Pops) {
        var x = Math.floor(Pops[i].popX + Pops[i].offx) - 256;
        var opacity = 1 - Pops[i].life / 100;
        if (Pops[i].isCrit) {
            var y = Math.floor(Pops[i].popY - Math.pow(Pops[i].life / 20, 0.5) * 100 + Pops[i].offy) - 100;
            str += '<div class="pop crit" style="position:absolute;left:' + x + 'px;top:' + y + 'px;opacity:' + opacity + ';">' + short(Pops[i].str) + omeletPic + '</div>';
            Pops[i].life += 1;
        } else {
            var y = Math.floor(Pops[i].popY - Math.pow(Pops[i].life / 100, 0.5) * 100 + Pops[i].offy) - 100;
            str += '<div class="pop" style="position:absolute;left:' + x + 'px;top:' + y + 'px;opacity:' + opacity + ';">' + short(Pops[i].str) + omeletPic + '</div>';
            Pops[i].life += 1.5;
        }
        if (Pops[i].life >= 100) Pops.splice(i, 1);
    }

    l('pops').innerHTML = str;
    setTimeout(popsAnimation, 1000 / 90);
}

function dValue(doll) {
    if (doll == "hina") {
        return (hina.lvl + 1) * hina.bonus * hina.bonusGlobal;
    }
    if (doll == "shinku") {
        return shinku.lvl * shinku.bonus * shinku.bonusGlobal;
    }
    if (doll == "desu") {
        return desu.lvl * desu.bonus * desu.bonusGlobal;
    }
    if (doll == "boku") {
        return (boku.lvl + 1) * boku.bonus * boku.bonusGlobal;
    }
    if (doll == "ginta") {
        return ginta.lvl * 200 * ginta.bonus * ginta.bonusGlobal;
    }
    if (doll == "kira") {
        return (1 + kira.lvl * kira.bonus * kira.bonusGlobal / 20);
    }
    if (doll == "bara") {
        return bara.lvl * 5000 * bara.bonus * bara.bonusGlobal;
    }
    if (doll == "clickBonus") {
        return (rosaLvl * 0.5 + 1) * localBonus * clickBonusGlobal;
    }
    if (doll == "perSecGlobal") {
        return (rosaLvl * 0.5 + 1) * localBonus * perSecGlobal;
    }
}

function nextLvl(doll) {
    doll.lvl++;
    let dollNext2 = Math.round((dValue("desu") * dValue("boku") + dValue("hina") * dValue("shinku") + dValue("ginta") + dValue("bara")) * dValue("kira") * dValue("perSecGlobal") * 100) / 100;
    doll.lvl--;
    return short(dollNext2) + " --- " + short(doll.cost / dollNext2);
}

function addDoll(doll) {
    this[String(doll.name) + "Block"].outerHTML = '<div id="' + doll.name + 'Block" class = "button ' + String(doll.name) + 'Button dollBlock">' +
        '<img class="doll" src="img/' + doll.name + '.png" alt="' + doll.name + '"> ' +
        '<span id="' + doll.name + 'Lvlc" class="level">Level:' +
        '</span>' +
        '<button id = ' + doll.name + 'LvlUpButton class ="lvlUp" onclick="lvlUpDoll(' + doll.name + ')"><text id="' + doll.name + 'CostIn"></button>' +
        '<progress class = "progress" id="' + doll.name + 'Progress" max="100" value="0"></progress>' +
        '<div id = "' + doll.name + 'Upg" class="upgrade" ><img src="img/' + doll.name + 'Upg1.png" alt="bonus"></div>' +
        '</div>';
    if (doll.name == "boku") {
        desuBlock.style.background = "linear-gradient(to right, rgba(65, 179, 50, 0.8), rgba(54, 57, 201, 0.8))";
        bokuBlock.style.background = "none";
        desuBlock.style.width = "640px";
        desuLvlc.style.right = "334px";
    }
    if (doll.name == "ginta") {
        gintaBlock.innerHTML += '<div class ="gintaTimer"> <progress id = "yakultProgress" max = "100" value="0"></progress>   <span id="yakultMinuts">00</span> : <span id="yakultSeconds">00</span></div><div class = "yakultValue"><span id ="yakultPlus">+ ' + ginta.lvl + " " + yakultPic + ' </span></div>';
        yakultTimer = yakultTime;
        tablinks[1].style.display = "block";
    }
    if (doll.lvl == 0) {
        lvlUpDoll(doll)
    }
    tooltips(`<span class = "titleBuff" >${doll.nameFull}</span> \n\n${upgradeText[doll.name]}`, doll.name + "LvlUpButton");
    doll.tooltipBuff = tooltips(setInnerTextBuffs(doll, 0, 10), doll.name + "Upg");
}

function lvlUpDoll(doll) {
    let x = buyMult;
    if (!doll.lvl) {
        if (buy(buyMult, doll.cost, doll.mult) >= omeletCount) {
            x = buyMax(doll.cost, doll.mult);
        } else {
            x = buyMult;
        }
    }
    if (buyMult == "max") {
        x = buyMax(doll.cost, doll.mult)
    };
    let newCost = (!doll.lvl) ? doll.cost : buy(x, doll.cost, doll.mult);

    if (omeletCount >= newCost) {
        for (let i = 0; i < x; i++) {
            doll.lvl++;
            omeletCount = omeletCount - doll.cost;
            doll.cost = Math.round(doll.cost * doll.mult);
            l(doll.name + "Lvlc").innerHTML = doll.lvl;
            if (doll.lvl <= 10) {
                l(doll.name + "Progress").value += 10;
            }
            if (doll.lvl <= 25 && doll.lvl > 10) {
                l(doll.name + "Progress").value += 7;
            }
            if (doll.lvl >= 25) {
                l(doll.name + "Progress").value += 4;
            }
            if (l(doll.name + "Progress").value >= 100) {
                l(doll.name + "Progress").value = 0;
            }
            if (doll.lvl > 25 && doll.lvl % 25 == 0) {
                if (doll == bara) {
                    rosaCountNext *= 1.5;
                    return;
                }
                if (doll == shinku) {
                    hina.bonus *= 2;
                    return;
                }
                if (doll == ginta) {
                    yakultBuff *= 2;
                    return;
                }
                doll.bonus *= 2;
            }
            if (doll.lvl == 10 || doll.lvl == 25) {
                upgrade(doll);
            }
            if (doll == ginta) {
                refreshYakult()
            }
        }
        refresh();
    }
}

function upgrade(doll) {
    if (doll.lvl == 10) {
        this[String(doll.name) + "Upg"].innerHTML = '<img src="img/' + doll.name + 'Upg2.png" alt="bonus"></img>';
        doll.tooltipBuff.updateTitleContent(setInnerTextBuffs(doll, 1, 25));
        buffs[doll.name].lvl10();
    } else {
        this[String(doll.name) + "Upg"].innerHTML = '<img src="img/' + doll.name + 'Upg3.png" alt="bonus"></img>';
        doll.tooltipBuff.updateTitleContent(setInnerTextBuffs(doll, 2, 'every 25'));
        buffs[doll.name].lvl25();
    }
}

// --------------------------
// Omelet
// --------------------------
function refresh() {
    document.getElementById("omeletCount").innerHTML =  omeletPic + "<text class = 'textCount'> you have: </text>" + short(omeletCount);
    totalPerSec = Math.round((dValue("desu") * dValue("boku") + dValue("hina") * dValue("shinku") + dValue("ginta") + dValue("bara")) * dValue("kira") * dValue("perSecGlobal") * 100) / 100;
    totalPerClick = Math.round((dValue("hina") * dValue("kira") * dValue("clickBonus")  + clickBonus * totalPerSec) * 100) / 100;
    document.title = short(omeletCount) + " omelets";
    if (totalPerClick > 0) {
        omletPerClick.innerHTML = omeletPic + "<text class = 'textCount'> per click: </text>" + short(totalPerClick);
    }
    if (totalPerSec > 0) {
        omletPerSec.innerHTML = omeletPic + "<text  class =  'textCount'> per sec: </text>" + short(totalPerSec);
    }
    // hinaNext.innerHTML = nextLvl(hina);
    // desuNext.innerHTML = nextLvl(desu);
    // bokuNext.innerHTML = nextLvl(boku);
    // shinkuNext.innerHTML = nextLvl(shinku);
    // gintaNext.innerHTML = nextLvl(ginta);
    // kiraNext.innerHTML = nextLvl(kira);
    // baraNext.innerHTML = nextLvl(bara);

    // hinaValue2.innerHTML = short(dValue("hina") * dValue("shinku"));
    // desuValue2.innerHTML = short(dValue("desu") * dValue("boku"));
    // gintaValue2.innerHTML = short(dValue("ginta"));
    // kiraValue2.innerHTML = short((totalPerSec - Math.round((dValue("desu") * dValue("boku") + dValue("hina") * dValue("shinku") + dValue("ginta") + dValue("bara")) * dValue("bonus") * 100) / 100)/dValue("bonus"));
    // baraValue2.innerHTML = short(dValue("bara"));

    dolls.forEach(function (doll = {name, lvl, cost}) {
        let dollBlock = l(doll.name + "Block");
        if (doll.name == "hina" || doll.name == "desu" || (desu.lvl && doll.name != "bara") || (doll.name == "bara" && resetWorldCount)) {
            if (doll.lvl == 0 && omeletCount >= (doll.cost * 0.5) && omeletCount < doll.cost) {
                let hireText = '<p class = "buttonText">Hire ' + doll.nameFull + '<br>for ' + short(doll.cost) + ' ' + omeletPic + '</p></div>';
                dollBlock.innerHTML = '<div class ="button ' + doll.name + 'Button  ">' + hireText;
                dollBlock.style.opacity = ((omeletCount/doll.cost) - 0.45) * 2;
                dollBlock.style.cursor = "auto";
            }
            if (doll.lvl == 0 && omeletCount >= doll.cost) {
                dollBlock.innerHTML = '<button class ="button ' + doll.name + "Button" + '"onclick="addDoll(' + doll.name + ')"><p class = "buttonText">Hire ' + doll.nameFull + '<br>for ' + short(doll.cost) + ' ' + omeletPic + '</p></button>'
                dollBlock.style.opacity = 1;
                dollBlock.style.cursor = "pointer";
            }
        }
        if (doll.lvl == 0 && omeletCount < (doll.cost * 0.5)) {
            dollBlock.outerHTML = '<div id="'+ doll.name + 'Block"></div>';
        }
        if (doll.lvl) {
            let LvlUpButton = l(doll.name + "LvlUpButton");
            let x = buyMult;
            if (buyMult == "max"){x = buyMax(doll.cost, doll.mult)}
            
            let newCost = buy(x, doll.cost, doll.mult);
            if (x <=1) {
                LvlUpButton.innerHTML = `${short(newCost)} ${omeletPic}`;
            } else {
                LvlUpButton.innerHTML = `${short(newCost)} ${omeletPic} <br> (x${x}) `;
            }
            if (newCost < omeletCount && LvlUpButton.classList.contains('lvlUpNo')){
                LvlUpButton.classList.remove('lvlUpNo');
            } else if (newCost > omeletCount && !LvlUpButton.classList.contains('lvlUpNo')){
                LvlUpButton.classList.add('lvlUpNo');
            }
        }
        if (ginta.lvl){
            yakultPlus.innerHTML = "+ " + ginta.lvl * yakultBuff + "&nbsp;" + yakultPic; 
        }
    })
    if (omeletTotal > (Math.pow((rosaLvl + 1),2.5) * 20000000) && kira.lvl && isLapras == false){
        laprasBlock.outerHTML = '<div class = "button laprasBlock" id="laprasBlock"><span id="total"></span><br><button id="restartText" class = "restartButton" onclick="showAlert(123)"></button></div>';
        isLapras = true;
        laprasTooltip = tooltips(`Text`, "restartText");
    }
    if (isLapras){
        rosaNext = Math.floor(Math.pow(omeletTotal/20000000, 0.4)) - rosaLvl;
        rosaCountNext = Math.floor(rosaNext * (1 + bara.lvl * 0.1) * rosaBonus);
        restartText.innerHTML = `Reset world <br>and  get ${rosaCountNext} ${rosaPic}`;
        let omeletsForNextRose = short((Math.pow((rosaLvl + rosaNext + 1),2.5) * 20000000) - omeletTotal);
        total.innerHTML = `Produce ${omeletsForNextRose} ${omeletPic} <br> for next ${rosaPic}`;
        laprasTooltip.updateTitleContent(`<span class = "titleBuff" >Reset world</span> \n\n Resets your current world and granting you <b>${rosaCountNext}</b> Rosa-Mysticas. \n\n Each Rosa-Mystica increase value of all dolls by <b>50%</b> and allows to buy mentors upgrades.`);
    }
}

function autoClicker() {
    timer = setInterval(function () {
        if (desu.lvl > 0) {
            omeletCount += totalPerSec;
            omeletTotal += totalPerSec;
            clicks = 1;
            if (ginta.lvl > 0) {
                yakultTimer--
                refreshTimers();
                yakultProgress.value += (100 / yakultTime);
                if (yakultTimer <= 60) {
                    yakultTimer = yakultTimer % 60;
                }
                if (yakultTimer <= 0) {
                    yakultCount = yakultCount + ginta.lvl * yakultBuff;
                    refreshYakult()
                    let x = yakultTimer;
                    yakultTimer = yakultTime + x;
                    refreshTimers();
                    yakultProgress.value = (100 / yakultTime) * -x;
                }
            }
            refresh();
        }
    }, 1000);
}

function clickOmelet() {
    let isCrit = false;
    let value = totalPerClick;
    if (getRandomInRange(1, 100) <= critChanse) {
        isCrit = true;
        value *= critValue;
    }
    omeletCount += value;
    omeletTotal += value;
    clicks++;

    if (Pops.length < 260) new Pop('omelet', '+' + value, popX, popY, isCrit);
    refresh();
}
// --------------------------
// Yakult
// --------------------------

function lvlUpYakult(buff) {
    if (yakultCount >= buff.cost * Math.pow(10, buff.lvl)) {
        yakultCount = yakultCount - buff.cost * Math.pow(10, buff.lvl);
        buff.lvl++;
        buff.target();
        refreshYakult();
    }
}

function refreshYakult() {
    if (yakultCount || ginta.lvl) {
        yakultCounter.innerHTML = yakultPic + "<text class ='textCount'>&nbsp; you have: </text>" + short(yakultCount);
        yakultCounter2.innerHTML = "<span class ='textCount2'>Yakult you have: </span>" + short(yakultCount) + yakultPic;
        yakultBuffs.forEach(function (doll = {name, lvl, cost}) {
            l(doll.name + "BuffYakult").innerHTML = short(doll.cost * Math.pow(10, doll.lvl)) + " " + yakultPic;
            if (yakultCount >= doll.cost * Math.pow(10, doll.lvl)) {
                l(doll.name + "BuffYakult").classList.remove('lvlUpNo');
            }

            if (yakultCount < doll.cost * Math.pow(10, doll.lvl)) {
                l(doll.name + "BuffYakult").classList.add('lvlUpNo');
            }
        })
    }
}

function refreshTimers() {
    yakultMinuts.innerHTML = Math.floor(yakultTimer / 60);
    var yakultSecond = yakultTimer % 60;
    if (yakultSecond < 10) {
        yakultSecond = "0" + yakultSecond;
    }
    yakultSeconds.innerHTML = yakultSecond;
}

// --------------------------
// Roza-Mictica
// --------------------------
function refreshRM() {
    for (let i = 0; i < rmBuffs.length; i++) {
        for (let k = 0; k < rmBuffs[i].length; k++) {
            if (rmBuffs[i][k].cost * (rmBuffs[i][k].lvl + 1) > rosaCount) {
                l(rmBuffs[i][k].id).classList.add('lvlUpNo');
                l(rmBuffs[i][k].id + "Text").classList.add('rmLvlUpNo');
            } else {
                l(rmBuffs[i][k].id).classList.remove('lvlUpNo');
                l(rmBuffs[i][k].id + "Text").classList.remove('rmLvlUpNo');
            }
        }
    }
    l('rosaCounter').innerHTML = "<span class ='textCount2'>Rosa-Mysticas you have: </span>" + short(rosaCount);
    rosaBuffs.innerHTML = "<span class ='textCount2'>Total buff to omelet production: </span>" + short(rosaLvl * 50) + "%";
}

function rmUpgrades(buff) {
    let newCost = (buff.lvl + 1) * buff.cost;
    if (rosaCount >= newCost) {
        if (buff.lvl < buff.lvlMax) {
            rosaCount -= newCost;
            buff.lvl++;
            buff.lvlUp();
            refreshRM();
            buff.tooltip.updateTitleContent(setInnerTextRMBuffs(buff));
            checkRMBuffs(buff);
        }
    }
    refresh();
}

function checkRMBuffs(buff) {
    newCost = (buff.lvl + 1) * buff.cost;
    l(buff.id + "Text").innerHTML = `<div class="rmPic"></div> <span class = "rmCost"> ${newCost} </span>`;
    if (buff.lvl == buff.lvlMax) {
        l(buff.id).classList.add('upgradeMax');
        l(buff.id + "Text").innerHTML = '<span class="rmCost rmCostMax">max</span>';
        l(buff.id + "Text").classList.add('lvlUpMax');
    }
}

function setInnerTextRMBuffs(buff) {
    if (buff.lvl == 0) {
        return `<span class = "titleBuff" >${buff.name}</span> \n\n <span class = "levelBuff" >Level 1:</span>\n +${buff.value}${buff.text}\n\n Max level: ${buff.lvlMax}`;
    }
    if (buff.lvl == buff.lvlMax) {
        return `<span class = "titleBuff" >${buff.name}</span> \n\n <span class = "levelBuff" >Level ${buff.lvl}:</span>\n +${buff.value * buff.lvl}${buff.text}\n\n Max level`;
    }
    return `<span class = "titleBuff" >${buff.name}</span> \n\n <span class = "levelBuff" >Level ${buff.lvl}:</span>\n +${buff.value * buff.lvl}${buff.text}\n\n <span class = "levelBuff" >Next level:</span>\n +${buff.value * (buff.lvl + 1)}${buff.text}\n\n Max level: ${buff.lvlMax}`;
}

function multBonus(target, lvl, value) {
    return ((lvl * value + 1) * (target / ((lvl - 1) * value + 1)));
}

///////////////////////////////////////////////////
// Save, load, refresh
///////////////////////////////////////////////////

function autoSave() {
    if (document.getElementById("auSave").checked == true) {
        timer2 = setInterval(function () {
            save();
        }, 60000);
    } else {
        clearInterval(timer2);
    }
}

function save() {
    localStorage.setItem("omeletCount", omeletCount);
    localStorage.setItem("omeletTotal", omeletTotal);
    localStorage.setItem("localBonus", localBonus);
    localStorage.setItem("yakultCount", yakultCount);
    localStorage.setItem("clicks", clicks);
    localStorage.setItem("yakultTimer", yakultTimer);
    localStorage.setItem("yakultTime", yakultTime);
    localStorage.setItem("rosaCount", rosaCount);
    localStorage.setItem("rosaLvl", rosaLvl);
    localStorage.setItem("rosaNext", rosaNext);
    localStorage.setItem("rosaBonus", rosaBonus);
    localStorage.setItem("isLapras", isLapras);
    localStorage.setItem("resetWorldCount", resetWorldCount);
    localStorage.setItem("yakultBuff", yakultBuff);
    localStorage.setItem("critChanse", critChanse);
    localStorage.setItem("critValue", critValue);
    localStorage.setItem("clickBonus", clickBonus);
    localStorage.setItem("perSecGlobal", perSecGlobal);
    localStorage.setItem("clickBonusGlobal", clickBonusGlobal);
    dolls.forEach(function (doll = {name, lvl, bonus, cost, bonusGlobal}) {
        localStorage.setItem(doll.name + " lvl", doll.lvl);
        localStorage.setItem(doll.name + " cost", doll.cost);
        localStorage.setItem(doll.name + " bonus", doll.bonus);
        localStorage.setItem(doll.name + " bonusGlobal", doll.bonusGlobal);
    });

    for (let i = 0; i < rmBuffs.length; i++) {
        for (let k = 0; k < rmBuffs[i].length; k++) {
            localStorage.setItem(rmBuffs[i][k].id + " lvl", rmBuffs[i][k].lvl)
        }
    }

    localStorage.setItem("chSave", document.getElementById("auSave").checked);
    yakultBuffs.forEach(function (doll = {name, lvl, cost }) {
        localStorage.setItem(doll.name + "Buff lvl", doll.lvl);
    });
    showPopUp("Save game...");
}

function load() {
    omeletCount = parseFloat(localStorage.getItem("omeletCount"));
    if (!omeletCount && omeletCount !== 0) {
        reset();
        return;
    }
    document.getElementById("defaultOpen").click();
    omeletTotal = parseFloat(localStorage.getItem("omeletTotal"));
    localBonus = parseFloat(localStorage.getItem("localBonus"));
    yakultCount = parseInt(localStorage.getItem("yakultCount"));
    yakultBuff = parseInt(localStorage.getItem("yakultBuff"));
    clicks = parseInt(localStorage.getItem("clicks"));
    yakultTime = parseInt(localStorage.getItem("yakultTime"));
    rosaCount = parseInt(localStorage.getItem("rosaCount"));
    rosaLvl = parseInt(localStorage.getItem("rosaLvl"));
    rosaNext = parseInt(localStorage.getItem("rosaNext"));
    rosaBonus = parseInt(localStorage.getItem("rosaBonus"));
    critChanse = parseInt(localStorage.getItem("critChanse"));
    critValue = parseFloat(localStorage.getItem("critValue"));
    isLapras = JSON.parse(localStorage.getItem("isLapras"));
    perSecGlobal = parseFloat(localStorage.getItem("perSecGlobal"));
    clickBonus = parseFloat(localStorage.getItem("clickBonus"));
    resetWorldCount = parseInt(localStorage.getItem("resetWorldCount"));
    clickBonusGlobal = parseInt(localStorage.getItem("clickBonusGlobal"));
    dolls.forEach(function (doll = {name, lvl, bonus, cost, bonusGlobal,
    }) {
        doll.lvl = parseInt(localStorage.getItem(doll.name + " lvl"));
        doll.cost = parseFloat(localStorage.getItem(doll.name + " cost"));
        doll.bonus = parseFloat(localStorage.getItem(doll.name + " bonus"));
        doll.bonusGlobal = parseFloat(localStorage.getItem(doll.name + " bonusGlobal"));
        this[String(doll.name) + "Block"].outerHTML = '<div id="' + doll.name + 'Block"></div>';
        if (doll.lvl) {
            addDoll(doll);
            this[String(doll.name) + "Lvlc"].innerHTML = doll.lvl;
            if (doll.lvl < 10) {
                this[String(doll.name) + "Progress"].value = (doll.lvl * 10);
            }
            if (doll.lvl < 25 && doll.lvl >= 10) {
                this[String(doll.name) + "Progress"].value = ((doll.lvl - 10) * 7);
                this[String(doll.name) + "Upg"].outerHTML = '<img id = "' + doll.name + 'Upg" class="upgrade" src="img/' + doll.name + 'Upg2.png" alt="bonus"></img>';
                tooltips(doll.tooltips[1], String(doll.name) + "Upg")
            }
            if (doll.lvl >= 25) {
                this[String(doll.name) + "Progress"].value = ((doll.lvl % 25) * 4);
                this[String(doll.name) + "Upg"].outerHTML = '<img id = "' + doll.name + 'Upg" class="upgrade" src="img/' + doll.name + 'Upg3.png" alt="bonus"></img>';
                tooltips(doll.tooltips[2], String(doll.name) + "Upg")
            }
            if (this[String(doll.name) + "Progress"].value >= 100) {
                this[String(doll.name) + "Progress"].value = 0;
            }

        };
    });

    for (let i = 0; i < rmBuffs.length; i++) {
        for (let k = 0; k < rmBuffs[i].length; k++) {
            rmBuffs[i][k].lvl = parseInt(localStorage.getItem(rmBuffs[i][k].id + " lvl"));
            checkRMBuffs(rmBuffs[i][k]);
        }
    }

    yakultBuffs.forEach(function (doll = {name, lvl, cost }) {
        doll.lvl = parseInt(localStorage.getItem(doll.name + "Buff lvl"));
    });
    if (ginta.lvl) {
        yakultTimer = parseInt(localStorage.getItem("yakultTimer"));
        yakultProgress.value += (yakultTime - yakultTimer) * (100 / yakultTime);
        tablinks[1].style.display = "block";
        refreshTimers();
    } else {
        tablinks[1].style.display = "none";
        yakultCounter.innerHTML = "";
    }
    document.getElementById("auSave").checked = JSON.parse(localStorage.getItem("chSave"));
    clearInterval(timer2);
    if (isLapras) {
        laprasBlock.outerHTML = '<div class = "button laprasBlock" id="laprasBlock"><span id="total"></span><br><button id="restartText" class = "restartButton" onclick="showAlert(123)"></button></div>';
        laprasTooltip = tooltips(`Text`, "restartText");
    }
    refresh();
    refreshYakult()
    refreshRM();
    autoSave();
    if (omeletCount == 0) {
        counters.style.display = "none";
        document.title = "Kanaria likes omlettes";
        firstClick.outerHTML = '<div class = "click" id ="firstClick"  onclick="deleteClick() ">Click me!</div>';
        detectClick();

    } else {
        deleteClick('noClick');
    }
    if (rosaLvl) {
        tablinks[2].style.display = "block";
        refreshRM();
        buyButtons.style.display = "block";
    }
    tablinks[3].style.display = "block";
}

function resetWorld() {
    resetWorldCount++;
    rosaCount += rosaCountNext;
    rosaLvl += rosaNext;
    document.getElementById("defaultOpen").click();
    tablinks[2].style.display = "block";
    tablinks[1].style.display = "none";
    buyButtons.style.display = "block";
    reset();
}

function reset() {
    omeletCount = 0;
    localBonus = 1;
    yakultCount = 0;
    yakultBuff = 1;
    yakultTime = 120;
    yakultTimer = 0;
    clicks = 0;
    rosaNext = 0;
    rosaBonus = 1;
    clickBonus = 0;
    dolls.forEach(function (doll = {lvl, bonus, cost }) {
        doll.lvl = 0;
        doll.cost = doll.costDef;
        doll.bonus = 1;
    });
    yakultBuffs.forEach(function (doll = {name, lvl, cost }) {
        doll.lvl = 0;
    });
    laprasBlock.outerHTML = '<div id="laprasBlock"></div>';
    omletPerClick.innerHTML = "";
    omletPerSec.innerHTML = "";
    yakultCounter.innerHTML = "";
    isLapras = false;
    refresh();
    refreshYakult();
    refreshRM();
    document.title = "Kanaria likes omlettes";
    detectClick();
}

function resetFull() {
    rosaCount = 0;
    omeletTotal = 0;
    resetWorldCount = 0;
    rosaLvl = 0;
    critChanse = 1;
    critValue = 1.5;
    perSecGlobal = 1;
    clickBonusGlobal = 1;
    dolls.forEach(function (doll = {bonusGlobal}) {
        doll.bonusGlobal = 1;
    })
    document.getElementById("defaultOpen").click();
    tablinks = document.getElementsByClassName("tablinks");
    counters.style.display = "none";
    firstClick.outerHTML = '<div class = "click" id ="firstClick"  onclick="deleteClick() ">Click me!</div>';
    buyButtons.style.display = "none";
    for (i = 1; i < tablinks.length; i++) {
        tablinks[i].style.display = "none";
    }
    tablinks[3].style.display = "block";
    for (let i = 0; i < rmBuffs.length; i++) {
        for (let k = 0; k < rmBuffs[i].length; k++) {
            rmBuffs[i][k].lvl = 0;
            checkRMBuffs(rmBuffs[i][k]);
            l(rmBuffs[i][k].id).classList.remove('upgradeMax');
            l(rmBuffs[i][k].id + "Text").classList.remove('lvlUpMax');
            rmBuffs[i][k].tooltip.updateTitleContent(setInnerTextRMBuffs(rmBuffs[i][k]));
        }
    }
    reset();
}