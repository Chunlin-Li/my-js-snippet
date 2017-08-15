
'use strict';

var zlib = require('zlib');


var str = 'fVRrj6pIEP0rxmST3eTCdPMQmMlmgzoKA3qZuThM+8XwkIdKy6thcLP/fQucu5v9skZDU+dU1amH/ef0WmVJRqeP07RpiseHh5zPaHT8VPmQPiQ0uXJVxKdNfvkj/H1g/CLqvwgr+HZdxwd+FjE+vObwHhbVlS9SIKxe69pCCDXhSrmcjDkR6C0uXprFrgk+bm2r6rTpQ0rcrdP6jqUoLl3IwZJkXbDuErpdHlPFWNahGO1FxZC4nfryctXP6nWThYt3n74sF/MmC2sH2d9VwYwbkjWnhmteUtELeIUc/Gq9cfTvOvdDa62lf6Yf1Q+8FtvtsUpWYnOoKpazRV9tzER84c1kdZB7jZh7dHm9letd2nEfp5mat+IzS0PCDM5zjK1GTyGm3gxTY2ZXev5MjbilOCfVKSfUyCM6s8jOIDfHA/yEiIMDZO7fSooswk6kRnvzIBs5yluJ7DxiVwYCf3SulObmRKXn7kPAtHfgntHe8Qo9CmRjiVwblRSHiCUakQ2E8r7zdrqCXTzEdIIiKtvBvrPpkGvuemOuNdt3C9mgNdgWrOc2xT4uqfc2YkPcD52r5djCrD+ng7/bdtfEZpy7cda7ViyRLmmu3dUjthlje2yIrTtQZzTPey4wt5pjLFea276hXaoQ0yAS0jlS9PHAX5s6p7K0XI/162b9Zb+xnv08Q92r5+EMcZ93iXVgBomQrgQJ1JN7b5JzyiWaxhHVqUj1rcdi65D3NfAVcveDvPughLqwm4JOA0EuhUvsToNeoCJxPgs432s83znIwjvduX7Zrl9a5mbfbVjSfUKvf+rTigSVzkahpteRznAsUyfI7KF3/VbITvA/2GpVoSge6F/IPZs7+puU47coN9AN5iZSvBQdrKVoP+ppHWQFsGujBuj9gSWrzzFXbK3dqNTcOwZP6/Nnj8zEIfIdt4tkxe307df8Tc1VSvKRWNxYi14P/PccRxrFwZkZ2zmDd9ODndKl1oU5vHqopqf7D+muNOwCS7kbzPrTTbeboi9V2Qht2C0ub0uVKSXMyxx3AmaBwY7d+47CMxx0k7Ge2Aqg18QdZ63Mv3ZVvOtixE2VAGZ7prVVQ64bYKB5iemJAs4FA8+0ra9dUaBHXA38YcfXoEtl+vY2xrLNO2fv/FN3bq882YgxKLIRmn6bVsfSjOBSe78J+nsyr/SF98rF0ANTxAAHWRQdK8DlmSgIoa/EoiwKCM0QkrEmzYYQdV2MBAkHR18K4lhU5YEgIVXwRSAULLhkdTrGiQPpqIWy7CNBFFQRq4oaDzEu1wbQUJPkKBRmfiBoCo59TQhlQKO6mGeRU2XhcfqIZTTm/Neiad+mzAf3zfWWXS7+g8Sjya9w2xZ+kwWX49Nk88N8nsx49DTx4NK+dvVk605kXniauFUWHWkzuDxNbikX0t8gYTZU9PgYw+dRwBqPpRmPVYEXBPUu5/870mT5IFSaiTNJFWVBwLOx0+5/7JIgSPJffwM=';

var sum = 0;
var concur = 0;

setInterval(() => {
    for (var i = 0; i < 10; i ++) {
        concur ++;
        zlib.inflateRaw(new Buffer(str, 'base64'), function (err, str) {
            setTimeout(() => {
                sum += str.length;
                concur --;
            }, 4000);
        });
    }
}, 1);




setInterval(function() {
    console.log('concur: ', concur, ' sum: ', sum);
    console.log('Memory:', JSON.stringify(process.memoryUsage()));
}, 1000);
