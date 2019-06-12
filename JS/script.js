var clicks = 0, timer = 0, timer2 = 0;
var omeletCount = 0, totalPerClick = 1, totalPerSec = 0, omeletTotal = 0, globalBonus = 1;
var yakultTime = 120, yakultTimer, yakultCount = 0, yakultBuff = 1;
var rosaCount = 0, rosaCountNext = 0, rosaLvl = 0, rosaNext, rosaBonus = 1, isLapras = false;
var resetWorldCount = 0;
var buyMult = 1;

var dolls = [
    hina = { name: "hina", nameFull: "Hinaichigo", lvl: 0, mult: 1.3, bonus: 1, cost: 20, costDef: 20, tooltips: ["x2","+20% to all dolls","x2"] },
    desu = { name: "desu", nameFull: "Suiseiseki", lvl: 0, mult: 1.3, bonus: 1, cost: 200, costDef: 200, tooltips:  ["x2","+30% to all dolls","x2"] },
    boku = { name: "boku", nameFull: "Souseiseki", lvl: 0, mult: 1.4, bonus: 1, cost: 2000, costDef: 2000, tooltips:  ["x2 to Suiseiseki","- 90% Suiseiseki cost","x2"] },
    shinku = { name: "shinku", nameFull: "Shinku", lvl: 0, mult: 1.4, bonus: 1, cost: 20000, costDef: 20000, tooltips:  ["x1.5 to Hina","- 90% Hina cost","x2 to Hina"] },
    ginta = { name: "ginta", nameFull: "Suigintou", lvl: 0, mult: 1.5, bonus: 1, cost: 200000, costDef: 200000, tooltips:  ["x2 yakult","- 20 sec to yakult timer","x2 yakult"] },
    kira = { name: "kira", nameFull: "Kirakisho", lvl: 0, mult: 1.8, bonus: 1, cost: 2000000, costDef: 2000000, tooltips:  ["-50% all dolls cost","x1.5 yakult","x2"] },
    bara = { name: "bara", nameFull: "Barasuishou", lvl: 0, mult: 1.9, bonus: 1, cost: 100000000, costDef: 100000000, tooltips:  ["x2 yakult","x1.5 Rosa-Misticas","x1.5 Rosa-Misticas"] },
];

var upgradeText = {hina: ` + omelets per click`,
    desu: `+ omelets per second`,
    boku: `Multiply omelets per second`,
    shinku: `Add omelets/click to omelets/sec`,
    ginta: `+ 200 omelets per second`,
    kira: `+5% value to all dolls`,
    bara:  `+ 5000 omelets per second and 10% to Rosa-Misticas quantity`};

var yakultBuffs = [
    hinaBuff = { name: "hina", lvl: 0, cost: 7, mult: 1.5},
    shinkuBuff = { name: "shinku", lvl: 0, cost: 5, mult: 1.5},
    desuBuff = { name: "desu", lvl: 0, cost: 10, mult: 2},
    gintaBuff = { name: "ginta", lvl: 0, cost: 8, mult: 3}
];

var omeletPic = '<img class="icon" src="img/Omelet-icon.png" alt="omelet"></img>';
var yakultPic = '<img class="icon" src="img/Yakult-icon.png" alt="yakult"></img>';
var rosaPic = '<img class="icon" src="img/Rosa-Mistica-icon.png" alt="Rosa-Mistica"></img>';

function l(what) {return document.getElementById(what);}

// Перевод чисел в короткую форму:
var formatShort = ['k', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No'];

function short(value) {
    var base = 0, notationValue = '';
    if (value >= 10000) {
        value /= 1000;
        while (Math.round(value) >= 1000) {
            value /= 1000;
            base++;
        }
        if (base >= formatShort.length) { return 'Infinity'; } else { notationValue = formatShort[base]; }
    }
    return (Math.round(value * 100) / 100) + " " + notationValue;
};

l('x1').onclick = function() {buyButton(1)};
l('x10').onclick = function() {buyButton(10)};
l('x25').onclick = function() {buyButton(25)};
l('max').onclick = function() {buyButton('max')};

function buyButton (x) {
    buttons = document.getElementsByClassName("buyButton");
    for (i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('buttonActive');
      }
	if (x == 1){
  	x1.classList.add('buttonActive');
  } else if (x == 10){
    x10.classList.add('buttonActive');
  } else if (x == 25){
    x25.classList.add('buttonActive');
  } else {
    max.classList.add('buttonActive');
  }
  buyMult = x;
  refresh();
}

autoClicker();
document.getElementById("defaultOpen").click();
function deleteClick() {
    deleteClick2();
    clickOmelet();
}

function deleteClick2() {
    firstClick.outerHTML = "<div id ='firstClick'></div>";
    counters.style.display = "block";
}

function refreshTimers(){
    yakultMinuts.innerHTML = Math.floor(yakultTimer/60);
    var yakultSecond = yakultTimer % 60;
    if (yakultSecond < 10){
        yakultSecond = "0" + yakultSecond;
    }
    yakultSeconds.innerHTML = yakultSecond;
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
                if (yakultTimer <= 0){
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
}

function autoSave() {
    if (document.getElementById("auSave").checked == true) {
        timer2 = setInterval(function () {
            save();
        }, 60000);
        console.log(document.getElementById("auSave").checked);
    }
    else {
        clearInterval(timer2);
        console.log(document.getElementById("auSave").checked);
    }
}

let popX;
let popY;
firstClick.onmousemove = function (event) {
    event = event || window.event;
    popX = event.pageX;
    popY = event.pageY;
}

omelet.onmousemove = function (event) {
    event = event || window.event;
    popX = event.pageX;
    popY = event.pageY;
}

function clickOmelet() {
    omeletCount += totalPerClick;
    omeletTotal += totalPerClick;
    clicks++;

    if (Pops.length<260) new Pop('omelet','+'+ Math.round(dValue("hina") * dValue("kira") * dValue("bonus") * 100) / 100, popX, popY);
    refresh();
}

var Pops=[];
Pop = function(el,str, popX, popY) {
	this.el=el;
	this.str=str;
    this.life=0;
    this.popX = popX;
    this.popY = popY;
	this.offx=Math.floor(Math.random()*30-15);
	this.offy=Math.floor(Math.random()*30-15);
    Pops.push(this);
}
var popsAnimation = function()
{
    var str='';
	for (var i in Pops) {
	    var x = Math.floor(Pops[i].popX + Pops[i].offx) - 256;
	    var y = Math.floor(Pops[i].popY - Math.pow(Pops[i].life / 100, 0.5) * 100 + Pops[i].offy) - 100;
	    var opacity = 1 - Pops[i].life / 100;
	    str += '<div class="pop" style="position:absolute;left:' + x + 'px;top:' + y + 'px;opacity:' + opacity + ';">' + Pops[i].str + omeletPic + '</div>';
	    Pops[i].life += 1;
	    if (Pops[i].life >= 100) Pops.splice(i, 1);
	}

    l('pops').innerHTML=str;
	setTimeout(popsAnimation, 1000/120);
}
function dValue(doll){
    if (doll == "hina"){
        return (hina.lvl + 1) * hina.bonus;
    }
    if (doll == "shinku"){
        return shinku.lvl * shinku.bonus;
    }
    if (doll == "desu"){
        return desu.lvl * desu.bonus;
    }
    if (doll == "boku"){
        return (boku.lvl + 1) * boku.bonus;
    }
    if (doll == "ginta"){
        return ginta.lvl * 200 * ginta.bonus;
    }
    if (doll == "kira"){
        return (1 + kira.lvl * kira.bonus / 20);
    }
    if (doll == "bara"){
        return bara.lvl * 5000 * bara.bonus;
    }
    if (doll == "bonus"){
        return (rosaCount * 0.5 + 1) * globalBonus;
    }
}

function nextLvl(doll){
    doll.lvl++;
    let dollNext2 = Math.round((dValue("desu") * dValue("boku") + dValue("hina") * dValue("shinku") + dValue("ginta") + dValue("bara")) * dValue("kira") * dValue("bonus") * 100) / 100 - totalPerSec;
    doll.lvl--;
    return (Math.round(dollNext2*100)/100 + " --- " + (Math.round(doll.cost / dollNext2)* 1000) / 1000);
}
function refreshYakult() {
    if (yakultCount || ginta.lvl) {
        yakultCounter.innerHTML = yakultPic + "<text class ='textCount'>&nbsp; you have: </text>" + short(yakultCount);
        yakultCounter2.innerHTML = "<span class ='textCount2'>Yakult you have: </span>" + short(yakultCount) + yakultPic;
        yakultBuffs.forEach(function (doll = {name, lvl, cost}) {
            this[String(doll.name) + "BuffYakult"].innerHTML = short(doll.cost * Math.pow(10, doll.lvl)) + yakultPic;
            if (yakultCount >= doll.cost * Math.pow(10, doll.lvl)) {
                this[String(doll.name) + "BuffYakult"].classList.remove('lvlUpNo');
            }

            if (yakultCount < doll.cost * Math.pow(10, doll.lvl)) {
                this[String(doll.name) + "BuffYakult"].classList.add('lvlUpNo');
            }
        })
    }
}

function refresh() {
    document.getElementById("omeletCount").innerHTML =  omeletPic + "<text class = 'textCount'> you have: </text>" + short(omeletCount);
    totalPerClick = Math.round(dValue("hina") * dValue("kira") * dValue("bonus") * 100) / 100;
    totalPerSec = Math.round((dValue("desu") * dValue("boku") + dValue("hina") * dValue("shinku") + dValue("ginta") + dValue("bara")) * dValue("kira") * dValue("bonus") * 100) / 100;
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

    // hinaValue2.innerHTML = dValue("hina") * dValue("shinku");
    // desuValue2.innerHTML = dValue("desu") * dValue("boku");
    // gintaValue2.innerHTML = dValue("ginta");
    // kiraValue2.innerHTML = (totalPerSec - Math.round((dValue("desu") * dValue("boku") + dValue("hina") * dValue("shinku") + dValue("ginta") + dValue("bara")) * dValue("bonus") * 100) / 100)/dValue("bonus");
    // baraValue2.innerHTML = dValue("bara");

    dolls.forEach(function (doll = {name, lvl, cost}) {
        let hireText = '<p class = "buttonText">Hire ' + doll.nameFull + '<br>for ' + short(doll.cost) + ' ' + omeletPic + '</p></div>';
        let opacityBlock = l(doll.name + "Block");
        if (doll.name == "hina" || doll.name == "desu" || (desu.lvl && doll.name != "bara") || (doll.name == "bara" && resetWorldCount && isLapras)) {
            if (omeletCount >= (doll.cost * 0.5) && omeletCount < doll.cost && doll.lvl == 0) {
                opacityBlock.innerHTML = '<div class ="button ' + doll.name + 'Button  ">' + hireText
                opacityBlock.style.opacity = ((omeletCount/doll.cost) - 0.45) * 2;
                opacityBlock.style.cursor = "auto";
            }
            if (omeletCount >= doll.cost && doll.lvl == 0) {
                opacityBlock.innerHTML = '<button class ="button ' + doll.name + "Button" + '"onclick="addDoll(' + doll.name + ')"><p class = "buttonText">Hire ' + doll.nameFull + '<br>for ' + short(doll.cost) + ' ' + omeletPic + '</p></button>'
                opacityBlock.style.opacity = 1;
                opacityBlock.style.cursor = "pointer";
            }
        }
        if (omeletCount < (doll.cost * 0.5) && doll.lvl == 0) {
            opacityBlock.style.opacity = 0;
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
    if (omeletTotal > (Math.pow((rosaLvl + 1),2) * 20000000) && kira.lvl && isLapras == false){
        laprasBlock.outerHTML = '<div class = "button laprasBlock" id="laprasBlock"><span id="total"></span><br><button id="restartText" class = "restartButton" onclick="resetWorld()"></button></div>';
        isLapras = true;
    }
    if (isLapras){
        rosaNext = Math.floor(Math.sqrt(omeletTotal/20000000)) - rosaLvl;
        rosaCountNext = Math.floor(rosaNext * (1 + bara.lvl * 0.1) * rosaBonus);
        restartText.innerHTML = `Restart world <br>and  get ${rosaCountNext} ${rosaPic}`;
        let omeletsForNextRose = short((Math.pow((rosaLvl + rosaNext + 1),2) * 20000000) - omeletTotal);
        total.innerHTML = `Produce ${omeletsForNextRose} ${omeletPic} <br> for next ${rosaPic}`;
    }
}

//Добавление блоков кукол

function addDoll(doll) {
    this[String(doll.name) + "Block"].outerHTML = '<div id="' + doll.name + 'Block" class = "button ' + String(doll.name) + 'Button dollBlock">' +
        '<img class="doll" src="img/' + doll.name + '.png" alt="' + doll.name + '"> ' +
        '<span id="' + doll.name + 'Lvlc" class="level">Level:' +
        '</span>' +
        '<button id = ' + doll.name + 'LvlUpButton class ="lvlUp" onclick="lvlUpDoll(' + doll.name + ')"><text id="' + doll.name + 'CostIn"></button>' +
        '<progress class = "progress" id="' + doll.name + 'Progress" max="100" value="0"></progress><img id = "' + doll.name + 'Upg" class="upgrade" src="img/' + doll.name + 'Upg1.png" alt="bonus">' +
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
    if (doll.lvl == 0){
        lvlUpDoll(doll)
    }
    tooltips(upgradeText[doll.name], String(doll.name) + "LvlUpButton");
    tooltips(doll.tooltips[0], String(doll.name) + "Upg")
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
    if (buyMult == "max" ){x = buyMax(doll.cost, doll.mult)};
    let newCost = (!doll.lvl) ? doll.cost : buy(x, doll.cost, doll.mult);

    if (omeletCount >= newCost) {
        for (let i = 0; i < x; i++){
        doll.lvl++;
        omeletCount = omeletCount - doll.cost;
        doll.cost = Math.round(doll.cost * doll.mult);
        this[String(doll.name) + "Lvlc"].innerHTML = doll.lvl;
        if (doll.lvl <= 10){
            this[String(doll.name) + "Progress"].value += 10;}
        if (doll.lvl <= 25 && doll.lvl > 10){
            this[String(doll.name) + "Progress"].value += 7;}
        if (doll.lvl >= 25){
            this[String(doll.name) + "Progress"].value += 4;}
        if (this[String(doll.name) + "Progress"].value >= 100){
            this[String(doll.name) + "Progress"].value = 0;
        }

        if (doll.lvl > 25 && doll.lvl % 25 == 0){
            if (doll == bara){
                rosaCountNext *= 1.5;
                return;
            }
            if (doll == shinku){
                hina.bonus *= 2;
                return;
            }
            if (doll == ginta){
                yakultBuff *= 2;
                return;
            }
            doll.bonus *= 2;
        }
        if (doll.lvl == 10 || doll.lvl == 25){
            upgrade(doll);
        }
        if (doll == ginta){
            refreshYakult()
        }}
        refresh();
    }
}

function upgrade(doll){
    if (doll.lvl == 10){
        this[String(doll.name) + "Upg"].outerHTML = '<img id = "'+ doll.name + 'Upg" class="upgrade" src="img/'+ doll.name +'Upg2.png" alt="bonus"></img>';
        tooltips(doll.tooltips[1], String(doll.name) + "Upg")
    } else {
        this[String(doll.name) + "Upg"].outerHTML = '<img id = "'+ doll.name + 'Upg" class="upgrade" src="img/'+ doll.name +'Upg3.png" alt="bonus"></img>';
        tooltips(doll.tooltips[2], String(doll.name) + "Upg")
    }

    if (doll == hina){
        if (hina.lvl == 10){
            hina.bonus *= 2;
            return;
        }
        globalBonus *= 1.2;

    }
    if (doll == desu){
        if (desu.lvl == 10){
            desu.bonus *= 2;
            return;
        }
        globalBonus *= 1.3;
    }
    if (doll == boku){
        if (boku.lvl == 10){
            desu.bonus *= 2;
            return;
        }
        desu.cost *= 0.1;
    }
    if (doll == shinku){
        if (shinku.lvl == 10){
            hina.bonus *= 1.5;
            return;
        }
        hina.cost *= 0.1;
    }
    if (doll == ginta){
        if (ginta.lvl == 10){
            yakultBuff *= 2;
            return;
        }
        yakultTime -= 20;
        yakultTimer -= 20;
        yakultProgress.value = (100 / yakultTime)*(yakultTime - yakultTimer);

    }
    if (doll == kira){
        if (kira.lvl == 10){
            dolls.forEach(function (doll = {name, lvl, cost}) {
                doll.cost *= 0.5; 
            })
            return;
        }
        yakultBuff *= 1.5;
    }
    if (doll == bara){
        if (bara.lvl == 10){
            yakultBuff *= 2;
            return;
        }
        rosaBonus *= 1.5;
    }


}
function lvlUpYakult(buff) {
    if (yakultCount >= buff.cost*Math.pow(10,buff.lvl)){
        yakultCount = yakultCount - buff.cost*Math.pow(10,buff.lvl);
        buff.lvl++;
        let name = this[String(buff.name)];
        name.bonus *= buff.mult; 
        refreshYakult();        
    }
}
function save() {
    localStorage.setItem("omeletCount", omeletCount);
    localStorage.setItem("omeletTotal", omeletTotal);
    localStorage.setItem("globalBonus", globalBonus);
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
    dolls.forEach(function (doll = { name, nameFull, lvl, mult, bonus, cost, costDef }) {
        localStorage.setItem(doll.name + " lvl", doll.lvl);
        localStorage.setItem(doll.name + " cost", doll.cost);
        localStorage.setItem(doll.name + " bonus", doll.bonus);
    });
    localStorage.setItem("chSave", document.getElementById("auSave").checked);
    console.log(JSON.parse(localStorage.getItem("chSave")));
    yakultBuffs.forEach(function (doll = { name, lvl, cost }) {
        localStorage.setItem(doll.name + "Buff lvl", doll.lvl);
    });
    note.innerHTML = "Save game...";
    note.style.display = "block";
    setTimeout(function() { note.style.display = "none"; }, 5000);
}
function load() {
    omeletCount = parseFloat(localStorage.getItem("omeletCount"));
    if (!omeletCount && omeletCount !== 0){
        reset();
        return;
    }
    document.getElementById("defaultOpen").click();
    omeletTotal = parseFloat(localStorage.getItem("omeletTotal"));
    globalBonus = parseFloat(localStorage.getItem("globalBonus"));
    yakultCount = parseInt(localStorage.getItem("yakultCount"));
    yakultBuff = parseInt(localStorage.getItem("yakultBuff"));
    clicks = parseInt(localStorage.getItem("clicks"));
    yakultTime = parseInt(localStorage.getItem("yakultTime"));
    rosaCount = parseInt(localStorage.getItem("rosaCount"));
    rosaLvl = parseInt(localStorage.getItem("rosaLvl"));
    rosaNext = parseInt(localStorage.getItem("rosaNext"));
    rosaBonus = parseInt(localStorage.getItem("rosaBonus"));
    isLapras = JSON.parse(localStorage.getItem("isLapras"));
    resetWorldCount = parseInt(localStorage.getItem("resetWorldCount"));
    dolls.forEach(function (doll = {
        name,
        lvl,
        bonus,
        cost,
    }) {
        doll.lvl = parseInt(localStorage.getItem(doll.name + " lvl"));
        doll.cost = parseFloat(localStorage.getItem(doll.name + " cost"));
        doll.bonus = parseFloat(localStorage.getItem(doll.name + " bonus"));
        this[String(doll.name) + "Block"].outerHTML = '<div id="' + doll.name + 'Block"></div>'; 
        if (doll.lvl) {
            addDoll(doll);
            this[String(doll.name) + "Lvlc"].innerHTML = doll.lvl;
            if (doll.lvl < 10) {
                this[String(doll.name) + "Progress"].value = (doll.lvl * 10);
            }
            if (doll.lvl < 25 && doll.lvl >= 10) {
                this[String(doll.name) + "Progress"].value = ((doll.lvl - 10) * 7);
                this[String(doll.name) + "Upg"].outerHTML = '<img id = "'+ doll.name + 'Upg" class="upgrade" src="img/'+ doll.name +'Upg2.png" alt="bonus"></img>';
                tooltips(doll.tooltips[1], String(doll.name) + "Upg")
            }
            if (doll.lvl >= 25) {
                this[String(doll.name) + "Progress"].value = ((doll.lvl % 25) * 4);
                this[String(doll.name) + "Upg"].outerHTML = '<img id = "'+ doll.name + 'Upg" class="upgrade" src="img/'+ doll.name +'Upg3.png" alt="bonus"></img>';
                tooltips(doll.tooltips[2], String(doll.name) + "Upg")
            }
            if (this[String(doll.name) + "Progress"].value >= 100) {
                this[String(doll.name) + "Progress"].value = 0;
            }

        };
    });
    yakultBuffs.forEach(function (doll = {
        name,
        lvl,
        cost
    }) {
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
    console.log(document.getElementById("auSave").checked);
    clearInterval(timer2);
    if (isLapras) {
        laprasBlock.outerHTML = '<div class = "button laprasBlock" id="laprasBlock"><span id="total"></span><br><button id="restartText" class = "restartButton" onclick="resetWorld()"></button></div>';
    }
    refresh();
    refreshYakult()
    autoSave();
    if (omeletCount == 0) {
        counters.style.display = "none";
        document.title = "Kanaria likes omlettes";
        firstClick.outerHTML = '<div class = "click" id ="firstClick"  onclick="deleteClick() ">Click me!</div>';
        firstClick.onmousemove = function (event) {
            event = event || window.event;
            popX = event.pageX;
            popY = event.pageY;
        }
        
    } else {
        deleteClick2();
    }
    if (rosaCount) {
        tablinks[2].style.display = "block";
        rosaCounter.innerHTML = "<span class ='textCount2'>Rosa-Misticas you have: </span>" + short(rosaCount);
        rosaBuffs.innerHTML = "<span class ='textCount2'>Total buff to omelet production: </span>" +  short(rosaCount * 50) + "%";
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
    rosaCounter.innerHTML = "<span class ='textCount2'>Rosa-Misticas you have: </span>" + short(rosaCount);
    rosaBuffs.innerHTML = "<span class ='textCount2'>Total buff to omelet production: </span>" +  short(rosaCount * 50) + "%";
    reset();
}
function reset() {
    omeletCount = 0;
    globalBonus = 1;
    yakultCount = 0;
    yakultBuff = 1;
    yakultTime = 120;
    yakultTimer = 0;
    clicks = 0;
    rosaNext = 0;
    rosaBonus = 1;
    dolls.forEach(function (doll = {lvl, bonus, cost}) {
        doll.lvl = 0;
        doll.cost = doll.costDef;
        doll.bonus = 1;
    });
    yakultBuffs.forEach(function (doll = { name, lvl, cost }) {
        doll.lvl = 0;
    });
    counters.style.display = "none";
    laprasBlock.outerHTML = '<div id="laprasBlock"></div>';
    desuBlock.innerHTML = ""; 
    omletPerClick.innerHTML = "";
    omletPerSec.innerHTML = "";
    yakultCounter.innerHTML = "";
    isLapras = false; 
    firstClick.outerHTML = '<div class = "click" id ="firstClick"  onclick="deleteClick() ">Click me!</div>';
    refresh();
    refreshYakult()
    document.title = "Kanaria likes omlettes";
    firstClick.onmousemove = function (event) {
        event = event || window.event;
        popX = event.pageX;
        popY = event.pageY;
    }
}

function resetFull() {
    rosaCount = 0;
    omeletTotal = 0;
    resetWorldCount = 0;
    rosaLvl = 0;
    document.getElementById("defaultOpen").click();
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 1; i < tablinks.length; i++) {
        tablinks[i].style.display = "none";
      }
      tablinks[3].style.display = "block";
    reset();

}

//Читы
function cheatOn(){
    if (code.value == "cheats on"){
        cheatButtons.style.display = "block";
        note.innerHTML = "Cheats on";
    }
    if (code.value == "cheats off"){
        cheatButtons.style.display = "none";
        note.innerHTML = "Cheats off";
    }
    document.getElementById("defaultOpen").click();
    note.style.display = "block";
    setTimeout(function() { note.style.display = "none"; }, 5000);
}

function cheat(x) {
    omeletCount += x;
    omeletTotal += x;
    refresh();
}

function add1Min() {
    omeletCount += 60 * totalPerSec;
    omeletTotal += 60 * totalPerSec;
    yakultTimer -= 60;
    yakultProgress.value = (100 / yakultTime) * (yakultTime - yakultTimer);
    refresh();
}

function add100yakult() {
    yakultCount += 100;
    refreshYakult();
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

  function tooltips(text, id){ new Tooltip(document.getElementById(id), {
    title: text,
    id: id + 1,
    trigger: "hover",
    delay: {
        show: 300,
    },
    });}

function buy(x, cost, mult) {
    let step = cost,
        result = cost;
    for (let i = 0; i <= (x - 2); i++) {
        step = Math.round(step * mult);
        result += step;
        console.log(step, result);
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