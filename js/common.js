//I know that this is evil, changin Array like this... but you know...
Array.prototype.remove = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

Array.prototype.getRandom = function () {
    return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.takeRandom = function () {
    var index = Math.floor(Math.random() * this.length);
    var item = this[index];
    this.remove(index);
    return item;
};

//extension stuff taken from http://stackoverflow.com/questions/4152931/javascript-inheritance-call-super-constructor-or-use-prototype-chain

// This is a constructor that is used to setup inheritance without
// invoking the base's constructor. It does nothing, so it doesn't
// create properties on the prototype like our previous example did
function surrogateCtor() {
}

function extend(base, sub) {
    // Copy the prototype from the base to setup inheritance
    surrogateCtor.prototype = base.prototype;
    // Tricky huh?
    sub.prototype = new surrogateCtor();
    // Remember the constructor property was set wrong, let's fix it
    sub.prototype.constructor = sub;
}

// a bloody set implementation:
(function () {
    "use strict";

    var keyCounter = -9007199254740992;

    window.Set = function Set() {
    };

    Set.prototype.add = function (object) {
        if (object.__hash === undefined) {
            object.__hash = keyCounter;
            keyCounter++;
        }
        this[object.__hash] = object;
    };

    Set.prototype.contains = function (object) {
        if (object.__hash === undefined) {
            return false;
        }
        return this[object.__hash] !== undefined;
    };

    Set.prototype.remove = function (object) {
        delete this[object.__hash];
    };

    Set.prototype.getRandom = function () {
        var result;
        var count = 0;
        for (var prop in this) {
            if (this.hasOwnProperty(prop)) {
                if (Math.random() < 1 / ++count) {
                    result = prop;
                }
            }
        }
        return this[result];
    };

    Set.prototype.takeRandom = function () {
        var result;
        var count = 0;
        for (var prop in this) {
            if (Math.random() < 1 / ++count) {
                result = prop;
            }
        }
        this.remove(result);
        return result;
    };

//    var mySet = new Set();
//    mySet.add(new Object);
})();

/*
    A simple Set and Map implementation.
    It does not compare objects internally, new Object() is different from new Object().
    So be careful if you use this for anything complex...
 */
(function () {
    "use strict";

    var keyCounter = -9007199254740992;

    window.Set = function Set() {
    };

    Set.prototype.add = function (object) {
        if (object.__hash === undefined) {
            object.__hash = keyCounter;
            keyCounter++;
        }
        this[object.__hash] = object;
    };

    Set.prototype.contains = function (object) {
        if (object.__hash === undefined) {
            return false;
        }
        return this[object.__hash] !== undefined;
    };

    Set.prototype.remove = function (object) {
        delete this[object.__hash];
    };

    Set.prototype.getRandom = function () {
        var result;
        var count = 0;
        for (var prop in this) {
            if (this.hasOwnProperty(prop)) {
                if (Math.random() < 1 / ++count) {
                    result = prop;
                }
            }
        }
        return this[result];
    };

    Set.prototype.takeRandom = function () {
        var result;
        var count = 0;
        for (var prop in this) {
            if (Math.random() < 1 / ++count) {
                result = prop;
            }
        }
        this.remove(result);
        return result;
    };

//    var mySet = new Set();
//    mySet.add(new Object());

    window.Map = function Map() {
    };

    Map.prototype.add = function (key, value) {
        if (key.__hash === undefined) {
            key.__hash = keyCounter;
            keyCounter++;
        }
        this[key.__hash] = value;
    };

    Map.prototype.containsKey = function (key) {
        if (key.__hash === undefined) {
            return false;
        }
        return this[key.__hash] !== undefined;
    };

    Map.prototype.get = function (key) {
        if (key.__hash === undefined) {
            return false;
        }
        return this[key.__hash] !== undefined;
    };

    Map.prototype.remove = function (key) {
        delete this[key.__hash];
    };

    Map.prototype.getRandom = function () {
        var result;
        var count = 0;
        for (var prop in this) {
            if (this.hasOwnProperty(prop)) {
                if (Math.random() < 1 / ++count) {
                    result = prop;
                }
            }
        }
        return this[result];
    };

    Map.prototype.takeRandom = function () {
        var result;
        var count = 0;
        for (var prop in this) {
            if (Math.random() < 1 / ++count) {
                result = prop;
            }
        }
        this.remove(result);
        return result;
    };

//    var myMap = new Map();
//    myMap.add(new Object(),new Object());
})();