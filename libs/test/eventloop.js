'use strict';


var data = JSON.stringify({'id':883213}) + '"';

try {
    data = JSON.parse(data);
} catch (e) {
    console.error('error .....', e);
} finally {
    console.log('finally block exec');
}