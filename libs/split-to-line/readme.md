输入文件路径, 读取该文件内容, 不编码, 直接按照 \n 换行符(0x0a) 将读到的 buffer 按行切割.

通过回调返回每行的 buffer, 文件读取结束后调用结束回调.

主要为了用最简单的实现获得最高的性能, 和 [line-reader](https://github.com/nickewing/line-reader) 进行对比测试, 性能高 5-7 倍左右.

调用参数:
* filePath : 输入文件路径
* cb: 回调函数. 参数 (err, buf), 如果在回调中返回 false, 将结束执行.
* end_cb: 结束回调. 无参数.

options:
* chunkSize: 底层 stream 每次读取文件的缓存大小. Node 默认值为 4096B,  此处设置为 16MB.

### **`index_async.js`** :
 
原来的版本文件读取没有异步回调控制, 读取大文件的时候, 无法控制文件读取速度. 因此做了一版异步的.

其他的地方基本完全一样, 只是 cb 的参数列表变为了 (err, buf, next).

每次处理完一行后, 之后调用 next 才会再读取下一行. 如果想要中止读取, 则在调用 callback 的时候传入一个 false 即可, 
如 : `callback(false)`


------------------------

1. 一般情况 pass
2. chunk 的最后一个符号恰好是换行 pass
3. chunk 的首个符号恰好是换行 pass
4. chunk 中没有换行 pass
5. chunk 中连续多个换行 pass
6. chunk 中只有一个换行 pass
7. emoji 中文 等 pass
