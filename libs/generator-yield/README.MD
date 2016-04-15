### Simple Generator Executor

* Execute a generator function, and return a Promise object;
* Every yield expression should be a normal expression or a Promise object.
* All exceptions in generator will be caught by promise, and you can append `.catch()` to handle them

[source code](executor_promise.js)
