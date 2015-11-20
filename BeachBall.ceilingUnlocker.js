var BeachBall2 = {};
BeachBall2.ceilingUnlocker = function (level, state) {
    this.hadError = false;
    this.level = parseInt(level);

    this.isOwned = function (level) {
        var levelName = "Glass Ceiling " + level;
        if (Molpy.Boosts[levelName].bought === 1) {
            return true;
        }
        return false;
    };

    this.isBuyable = function (level) {
        var levelName = "Glass Ceiling " + level;
        if (Molpy.ProtectingPrice() === true) {
            this.hadError = true;
            return false;
        }
        if (Molpy.Boosts[levelName].unlocked === 1) {
            return true;
        }
        return false;
    };

    this.isUnlocked = function (level) {
        if (this.hadError) {
            return false;
        }
        if (this.isOwned(level) === true) {
            return true;
        }
        if (this.isBuyable(level) === true) {
            return true;
        }
        hadError = true;
        return false;
    };

    this.lockLevel = function (level) {
        if (this.hadError) {
            return false;
        }
        if (this.isOwned(level) === true) {
            var levelName = "Glass Ceiling " + level;
            console.log('Locking: ' + levelName);
            Molpy.CeilingLock(level);
            return true;
        }
        return true;
    };

    this.unlockLevel = function (level) {
        if (this.hadError) {
            return false;
        }
        var levelName = "Glass Ceiling Level " + level;
        if (this.isUnlocked(level) === true) {
            var levelName = "Glass Ceiling " + level;
            console.log('Buying: ' + levelName);
            Molpy.Boosts[levelName].buy()
            return true;
        }
        hadError = true;
        return false;
    };

    this.unlock = function (level) {
        if (this.hadError) {
            return false;
        }
        switch (level) {
            case 10:
                this.unlock(9);
                this.unlock(8);
                this.unlock(7);
                this.unlock(6);
                this.unlock(5);
                this.unlock(4);
                this.unlock(3);
                this.unlock(2);
                this.unlock(1);
                this.unlock(0);
                break;
            case 9:
                this.unlock(8);
                this.lock(7);
                this.lock(6);
                this.lock(5);
                this.lock(4);
                this.lock(3);
                this.lock(2);
                this.lock(1);
                this.lock(0);
                this.unlockLevel(9);
                break;
            case 8:
                this.unlock(7);
                this.lock(6);
                this.lock(5);
                this.lock(4);
                this.lock(3);
                this.lock(2);
                this.lock(1);
                this.lock(0);
                this.unlockLevel(8);
                break;
            case 7:
                this.unlock(6);
                this.lock(5);
                this.lock(4);
                this.lock(3);
                this.lock(2);
                this.lock(1);
                this.lock(0);
                this.unlockLevel(7);
                break;
            case 6:
                this.unlock(5);
                this.lock(4);
                this.lock(3);
                this.lock(2);
                this.lock(1);
                this.lock(0);
                this.unlockLevel(6);
                break;
            case 5:
                this.unlock(4);
                this.lock(3);
                this.lock(2);
                this.lock(1);
                this.lock(0);
                this.unlockLevel(5);
                break;
            case 4:
                this.unlock(3);
                this.lock(2);
                this.lock(1);
                this.lock(0);
                this.unlockLevel(4);
                break;
            case 3:
                this.unlock(2);
                this.lock(1);
                this.lock(0);
                this.unlockLevel(3);
                break;
            case 2:
                this.unlock(1);
                this.lock(0);
                this.unlockLevel(2);
                break;
            case 1:
                this.unlock(0);
                this.unlockLevel(1);
                break;
            case 0:
                this.unlockLevel(0);
                break;
        }
    };

    this.lock = function (level) {
        if (this.hadError) {
            return false;
        }
        switch (level) {
            case 9:
                this.unlock(8);
                this.lock(7);
                this.lock(6);
                this.lock(5);
                this.lock(4);
                this.lock(3);
                this.lock(2);
                this.lock(1);
                this.lock(0);
                this.lockLevel(9);
                break;
            case 8:
                this.unlock(7);
                this.lock(6);
                this.lock(5);
                this.lock(4);
                this.lock(3);
                this.lock(2);
                this.lock(1);
                this.lock(0);
                this.lockLevel(8);
                break;
            case 7:
                this.unlock(6);
                this.lock(5);
                this.lock(4);
                this.lock(3);
                this.lock(2);
                this.lock(1);
                this.lock(0);
                this.lockLevel(7);
                break;
            case 6:
                this.unlock(5);
                this.lock(4);
                this.lock(3);
                this.lock(2);
                this.lock(1);
                this.lock(0);
                this.lockLevel(6);
                break;
            case 5:
                this.unlock(4);
                this.lock(3);
                this.lock(2);
                this.lock(1);
                this.lock(0);
                this.lockLevel(5);
                break;
            case 4:
                this.unlock(3);
                this.lock(2);
                this.lock(1);
                this.lock(0);
                this.lockLevel(4);
                break;
            case 3:
                this.unlock(2);
                this.lock(1);
                this.lock(0);
                this.lockLevel(3);
                break;
            case 2:
                this.unlock(1);
                this.lock(0);
                this.lockLevel(2);
                break;
            case 1:
                this.unlock(0);
                this.lockLevel(1);
                break;
            case 0:
                this.lockLevel(0);
                break;
        }
    };

    if (state === 'lock') {
        console.log('Locking Level: '+level);
        this.lock(this.level);
    } else {
        console.log('Unlocking Level: '+level);
        this.unlock(this.level);
    }
    if (this.hadError) {
        console.log('Error Buying Item');
    }
};

BeachBall2.ceilingUnlocker(9, 'unlock');
