'use strict';

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `(${this.x},${this.y})`
    }
}

class Point3 extends Point {

    constructor(x, y, z) {
        super(x, y);
        this.z = z;
    }

    toString() {
        return `(${this.x},${this.y},${this.z})`
    }
}

var p1 = new Point(4,6);
var p2 = new Point(5,7);
console.log(p1.toString());
console.log(JSON.stringify(p1));
//p1.prototype.get_X = function () {console.log(this.x)};
console.log(p1.constructor.toString());