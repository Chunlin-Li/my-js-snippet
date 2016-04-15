'use strict';


Promise.resolve({type:2, name: 'cat'})
.then(res => {
    if (res.type === 2) {
        return doType2(res);
    }
    return res;
})
.then(res => {
    res.name = res.name + res.type;
    return res;
})
.then(res => {
    return JSON.stringify(res);
})
    .then(res => console.log(res))
    .catch(err => console.error('catched!', err));


function doType2(res) {
    return Promise.resolve({
        then(resolve){
            res.age = res.name.length * res.type;
            return res;
        }
    });
}
