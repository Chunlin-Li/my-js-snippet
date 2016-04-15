'use strict';


function Person() {
    Object.defineProperty(this, '__list', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: []
    });
    Object.defineProperty(this, 'list', {
        configurable: false,
        enumerable: true,
        set(val){
            this.__list = val;
        },
        get(){
            return this.__list;
        }
    });
}


var p = new Person();
console.log(p);
console.log(p.list);
p.list.push('abcc');
console.log(p.list);
void(p.list.length);
console.log(p.list);
p.list = p.list.map(item => item + '!!!');
console.log(p.list);
p.list.pop();
console.log(p.list);
