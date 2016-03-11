This is a http request helper. used for node js.

when you need request one server many times and with various http method, this helper will simplify the code.


**Example**

```
let helper = createHttpHelper('127.0.0.1', 80);

helper.get('/index.html', (resp, code, message) => {
    console.log('the html doc string:', resp, 
        'http status code is:', code, 
        'status message is:', message);
});

helper.put('/user', '{name: "abc", age: 18}', (resp, code) => {
    assert.equal(code, 201);
});

helper.delete('/articles/123456');
```