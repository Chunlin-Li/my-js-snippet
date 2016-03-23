id generator
=============

generator uniq id. id string length is 20, url safe base64 format ( replace + to \_, replace / to -)
 
byte wise format :  4 Byte UNIX TIME (second) + 2 Byte process id + 6 Byte Hostname/MAC + 3 Byte increment count
 
 
```
// init 
var id_gen = generate(require('os').hostname());  // use hostname as device uniq id. or leave it empty to use MAC.

// generate
console.log(id_gen());

```