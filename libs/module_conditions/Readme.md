以是否已经加载指定模块作为条件, 调用不同的函数.

if the specified module has loaded, run load_cb, else run non_load_cb

```
ifLoaded('./path/to/lib', (lib) => {
    console.log('do something use lib');
}, () => {
    console.log('do something with no lib load');
});
```