
function simpleExecutor(gen) {
    let args = [].splice.call(arguments, 1);
    return (function looper (prom) {
        return prom.then(realValue => {
            let t =gen.next(realValue); // t = {value: promise, done:xxx}
            return t.done ? t.value : looper(Promise.resolve(t.value));
        });
    })(Promise.resolve());
}
