Array.prototype.remove = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

//taken from http://stackoverflow.com/questions/4152931/javascript-inheritance-call-super-constructor-or-use-prototype-chain

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

//    var mySet = new Set();
//    mySet.add(new Object);
})();