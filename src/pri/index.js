var addon = (() => {try {return require('./build/Release/addon.node');} catch (err) {return require('./build/Debug/addon.node');}})();

console.time('all');
var base = new Buffer(Math.pow(10, 5)).fill(1);
base[0] = 0;
base[1] = 0;

var found = [];
var timeuse = 0;

var i = 2;
while (i !== -1) {

    if (check(i)) {
        found.push(i);
        remove(i);
    } else {
        base[i] = 0;
    }
    i = base.indexOf(0x1, i + 1);
    //console.log('i', i);
}

//console.log(found);
console.log(found.length);



function check(num) {


    var piv;
    if (found.length) {
        piv =  found[found.length - 1];
    }
    let s1 = process.hrtime();
    for (let i = 0; i < found.length; i ++ ) {
        let z = num % found[i];
        if (z === 0) {
            return false;
        }
    }
    let s2 = process.hrtime(s1);
    timeuse += (s2[1] + s2[0] * 1000000000);
    for (let i = piv ; i < num; i+=2) {
        if (num % i === 0) {
            return false;
        }
    }


    return true;
}
function remove(num) {
    let i = num * 2;
    while (i < base.length) {
        base[i] = 0;
        i += num;
    }
}


console.timeEnd('all');
console.log('timeuse', timeuse / 1000000);
