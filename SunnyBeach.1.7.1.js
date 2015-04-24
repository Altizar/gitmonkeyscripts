var settings = new Array();
//-----***** SETTINGS *****-----


//OK BIG UPDATE LISTEN HERE
//settings are now defined with a toggle-able hotkey
//keycodes are here: http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
//most are disabled by default with the exception of autoBuyCaged which is set to Numpad 0
//does not yet work for autoClick, autoSnap since they are not t/f (coming soon)

settings["autoClick"] = [2, 0];	//2: continuously click; 1: click once; 0: don't click
// (will never click when NPBs are active regardless of setting)

settings["autoLogicat"] = [true, 0];	//solve logicats
settings["autoKitty"] = [true, 0];	//click redundakitties
settings["autoCaged"] = [true, 0];	//solve caged logicats
settings["autoRift"] = [false, 0];	//activate all temporal rifts
settings["autoSnap"] = [2, 0];		//2: use the camera on guaranteed new discoveries (really cheaty)
//1: use the camera on all newpix (only kinda cheaty)
//0: don't use the camera
settings["autoMoulds"] = [true, 0];	//requires all mold-making boosts
//continually makes/fills moulds up to Glass
settings["autoBuyCaged"] = [true, 96];	//unlock caged logicats when available
settings["autoCagedMin"] = 0;		//minimum glass blocks to keep in storage. 0 to ignore
settings["autoMonty"] = [true, 0];	//picks the goat every time, it seems
settings["autoCrush"] = [true, 0];	//use Castle Crusher if Castles are infinite and Sand is not.

settings["autoBuy"] = [true, 0];	//turn on autobuy feature
var autoBuyItems = new Array(); //don't touch this line
autoBuyItems.push("Crate Key");
autoBuyItems.push("Locked Crate");
autoBuyItems.push("MHP");
autoBuyItems.push("Locked Vault");
autoBuyItems.push("Vault Key");
autoBuyItems.push("Castle Crusher");
//some of these require Aliases, not full names

settings["kittyTimer"] = [true, 0];	//show kitty countdown in title
settings["ashfTimer"] = [true, 0];	//show ashf countdown in title when active
settings["temporTimer"] = [true, 0];	//show temporal dip countdown in title when active

var loopdelay = 2;	//number of times to delay the loop before running more functions

var speed = 1;		//Controls how fast the script runs. Lower is faster. Minimum 1.
//Increase this if Sandcastle starts lagging when you load the script
//this directly affects click speed
//-----***** END SETTINGS *****-----

//Changelog

//1.7.1 - Modified Redundakitty function (thanks to Oblivion590)
//1.7.0 - Added Hotkey recognition - redid variable declaration as a result
//1.6.7 - Reorganized variables/functions
//1.6.6 - Added auto Castle Crush
//1.6.5 - Added Monty Haul door picking
//1.6.4 - Added alias recognition for autobuy
//	- aliases may be REQUIRED for boosts in the shop that have them. Further testing needed
//1.6.3 - Moved autobuyitems into an array to let you buy different things
//1.6.2 - Realized my looping was stupid, moved non-time-sensitive stuff into a single delay
//1.6.1 - Fixed ASHF Countdown
//1.6.0 - Added full Mould Making activities
//1.5.0 - Added title notifications for ASHF and Rifts
//1.4.3 - Removed loop delay for a more useful version. No longer user configurable
//	- Caged logicat & crate key open/solve/buy is now in the proper order to maximize keys
//	- small delay added to above functions so Sandcastle can catch up
//1.4.2 - Added Loop delay for non-clicking functions
//	- moved AutoBuy in front of AutoCaged for more reliable Crate Key purchases
//1.4.1 - Bugfix for Sandcastle 3.189 ('Glass Block Storage' -> 'GlassBlocks')
//1.4.0 - Added autoBuy, auto caged logicat
//1.3.0 - Added automatic Camera
//1.2.2 - Removed typo-fixer function as this is now built into SCB
//1.2.1 - Added notification of settings upon load
//1.2.0 - Added Caged Logicat solving
//1.1.1 - bugfix
//1.1.0 - Added Temporal Rift option
//1.0.0 - Public Release


//Todo/Requested
//UI for options
//Time Travel forwards after Rift
//Countdown timer for Rift


// -- ** DON'T TOUCH ** --
var ver = "1.7.1";
var clickedBeach = false;
var lastPicture = Molpy.newpixNumber;
var loop = 0;
var originalTitle = document.title;


Molpy.Notify("SunnyBeach v" + ver + " loaded", 1)

document.addEventListener('keydown', function (event) {
    for (var i in settings) {
        if (event.keyCode == settings[i][1]) {
            settings[i][0] = !settings[i][0]
            Molpy.Notify("SB: Toggled " + i);
        }
    }
});

setInterval(function () {
    if (settings["autoClick"][0] > 0 || (settings["autoRift"][0] && Molpy.Got('Temporal Rift'))) {
        doAutoClick();
    }
    if (settings["kittyTimer"][0] || settings["ashfTimer"][0] || settings["temporTimer"][0]) {
        doTimers();
    }

    if (settings["autoLogicat"][0] && Molpy.redactedVisible > 0) {
        doAutoLogicat();
    }
    if (settings["autoKitty"][0] && Molpy.redactedVisible > 0) {
        doAutoKitty();
    }

    if (settings["autoBuy"][0]) {
        doAutoBuy();
    }

    if (settings["autoMonty"][0]) {
        doAutoMonty();
    }

    if (settings["autoCrush"][0]) {
        doAutoCrush();
    }

    if (loop >= loopdelay) {
        if (settings["autoBuyCaged"][0]) {
            doAutoBuyCaged();
        }
        if (settings["autoCaged"][0] && Molpy.cagedPuzzleTarget != undefined) {
            doAutoCaged();
        }
        if (settings["autoSnap"][0] > 0) {
            doAutoSnap();
        }
        if (settings["autoMoulds"][0]) {
            doAutoMoulds();
        }
        loop = 0;
    }
    loop += speed;
}, speed);

function doAutoCrush() {
    if (Molpy.castles == 'Infinity' && Molpy.sand != 'Infinity' && Molpy.Got('Castle Crusher')) {
        Molpy.CastleCrush();
    }
}

function doAutoMonty() {
    if (Molpy.Boosts['MHP'].bought) {
        Molpy.Monty();
    }
}

function doAutoMoulds() {
    var d = ""
    var sandmaker = Molpy.Boosts['SMM'];
    var sandfiller = Molpy.Boosts['SMF'];
    var glassmaker = Molpy.Boosts['GMM'];
    var glassfiller = Molpy.Boosts['GMF'];
    if (Molpy.Got('SMM') && Molpy.Got('SMF') && Molpy.Got('GMM') && Molpy.Got('GMF')) {
        for (var i = 1; i <= Molpy.newpixNumber; i++) {
            d = 'discov' + i;
            if (Molpy.Badges[d] != undefined && Molpy.Earned(d)) {
                sandname = "monums" + i;
                glassname = "monumg" + i;
                if (Molpy.Earned(sandname) == 0) {
                    if (sandmaker.power == 0 && sandfiller.bought != i) {
                        Molpy.Notify("SB: Making sand mould " + i);
                        Molpy.MakeSandMould(i);
                    }
                }
                if (Molpy.Earned(glassname) == 0) {
                    if (glassmaker.power == 0 && glassfiller.bought != i) {
                        Molpy.Notify("SB: Making glass mould " + i);
                        Molpy.MakeGlassMould(i);
                    }
                }
                if (sandmaker.power > 100) {
                    Molpy.Notify("SB: Filling sand mould " + sandmaker.bought);
                    Molpy.FillSandMould(sandmaker.bought);
                }
                if (glassmaker.power > 400) {
                    Molpy.Notify("SB: Filling glass mould " + glassmaker.bought);
                    Molpy.FillGlassMould(glassmaker.bought);
                }
            }
        }
    }
}


function doAutoBuy() {
    for (var i = 0; i < Molpy.dispObjects.shop.length; i++) {
        for (var j = 0; j < autoBuyItems.length; j++) {
            if (Molpy.dispObjects.shop[i].name == autoBuyItems[j] || Molpy.dispObjects.shop[i].alias == autoBuyItems[j]) {
                Molpy.Boosts[autoBuyItems[j]].buy();
            }
        }
    }
}

function doTimers() {
    var string = ""
    var countdown = 0;
    if (settings["temporTimer"][0] && Molpy.Got('Temporal Rift')) {
        string = string + "(Rift)";
    }
    if (settings["ashfTimer"][0] && Molpy.Got('ASHF')) {
        string = string + "(ASHF: " + Molpy.Boosts['ASHF'].countdown + ")";
    }
    if (settings["kittyTimer"][0]) {
        if (Molpy.redactedVisible > 0) {
            string = string + "(Kitten)"
        } else {
            countdown = Molpy.redactedToggle - Molpy.redactedCountup;
            string = string + "(RK: " + countdown + ")";
        }
    }
    if (string != "") {
//        document.title = string;
    } else {
        document.title = originalTitle;
    }
}

function doAutoBuyCaged() {
    return false;
    var mycost = 100 + Molpy.LogiMult(25);
    if (Molpy.Boosts['Caged Logicat'].bought > 1 && Molpy.Boosts['GlassBlocks'].power >= settings["autoCagedMin"]) {
        Molpy.MakeCagedPuzzle(mycost);
    }
}

function doAutoSnap() {
    if (Molpy.Got('Camera')) {
        if (Molpy.newpixNumber != lastPicture) {
            lastPicture = Molpy.newpixNumber;
            if (settings["autoSnap"][0] == 1) {
                Molpy.Shutter();
            } else {
                var d = 'discov' + Molpy.newpixNumber;
                if (Molpy.Badges[d] != undefined && !Molpy.Earned(d)) {
                    Molpy.Shutter();
                } else if (!Molpy.Badges[d]) {
                    Molpy.Notify("No Discovery here", 1);
                }
            }
        }
    }
}

function doAutoClick() {
    if (settings["autoRift"][0] && Molpy.Got('Temporal Rift')) {
        Molpy.ClickBeach();
        return;
    }
    if (Molpy.npbONG == 1 && !Molpy.Got('Temporal Rift')) {
        if (settings["autoClick"][0] == 1) {
            if (clickedBeach == false) {
                Molpy.ClickBeach();
                clickedBeach = true;
            }
        } else {
            Molpy.ClickBeach();
        }
    } else {
        clickedBeach = false;
    }
}

function doAutoKitty() {
    var highestL = Molpy.redactedDrawType.length - 1;
    if (highestL > 5) {
        highestL = 5;
    }
    if (Molpy.redactedPuzzleTarget == undefined) {
        Molpy.ClickRedacted(highestL);
    }
}

function doAutoLogicat() {
    var prawda = false;
    if (Molpy.redactedPuzzleTarget != undefined) {
        var znak = 65;
        while (prawda == false) {
            var litera = String.fromCharCode(znak);
            if (Molpy.redactedSGen.StatementValue(litera) == Molpy.redactedPuzzleTarget) {
                Molpy.ClickRedactedPuzzle(litera);
                prawda = true;
                Molpy.redactedPuzzleTarget = undefined;
            } else {
                znak++;
            }
        }
    }
}

function doAutoCaged() {
    if (Molpy.cagedPuzzleValue.charAt(0) == "C") {
        for (var i = 65; i <= 90; i++) {
            if (Molpy.cagedSGen.StatementValue(String.fromCharCode(i)) == Molpy.cagedPuzzleTarget) {
                Molpy.ClickCagedPuzzle(String.fromCharCode(i));
                return;
            }
        }
    }
}