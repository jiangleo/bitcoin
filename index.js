const crypto = require('crypto');
var EC = require('elliptic').ec;
var ec = new EC('secp256k1');
var BN = require('bn.js');
var bs58 = require('bs58');

class PrivateKey {
    constructor() {
        this.bn = this.generateKey();
        this.compressed = true;
        this.network = Networks.defaultNetwork;
    }
    
    generateKey() {
        let condition;
        let bn;
        
        do {
            // 随机生成 1 ~ 2^256 之间的数字，并以 hex 这种编码格式显示。
            // hex ：一种编码格式，将每个字节编码为两个十六进制字符
            // privateHex: "ceea0ada327fc521e9c5ba704a002f56c95de6bffc83901aa2290fc882c4c218"
            const privateHex = crypto.randomBytes(32).toString('hex');
           
            // privateHex 是字符串类型，字符串格式是没法直接比较大小的，所以要转化为数字类型。
            // 但是 js 中最大的安全数是 Number.MAX_SAFE_INTEGER = 9007199254740991，根本不够表示一个 private 值。
            // 所以用到了 BN 这个库，对比 private。BN 即大数 Big Number。
            bn = new BN(privateHex, 16)
    
            // max = <BN: fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141>
            const max = new BN(ec.curve.n.toArray())
            
            // 实际上 private 要比 max 小
            // max 是一个常数 n=1.158 * 10^77，略小于2^256
            // 由比特币所使用的椭圆曲线的阶
            
            // 当 bn < max 成功生成私钥
            condition = bn.lt(max)
        } while (!condition);
        
        return bn;
    }
}


class PublicKey {
    constructor(privateKey){
        // 椭圆曲线乘法可以从私钥计算得到公钥
        // 是不可逆转的过程：K = k * G
        // 其中k是私钥，G是被称为生成点的常数点，而K是所得公钥。
        this.point = ec.curve.g.mul(privateKey.bn)
        this.compressed = privateKey.compressed
        this.network = privateKey.network
    }
    
    // 这一块没有找到对应文档
    toBuffer () {
        var xbuf = this.point.getX().toBuffer({ size: 32 });
        
        var ybuf = this.point.getY().toBuffer({ size: 32 });
        
        var prefix;
        if (!this.compressed) {
            prefix = new Buffer([0x04]);
            return Buffer.concat([prefix, xbuf, ybuf]);
        } else {
            var odd = ybuf[ybuf.length - 1] % 2;
            if (odd) {
                prefix = new Buffer([0x03]);
            } else {
                prefix = new Buffer([0x02]);
            }
            return Buffer.concat([prefix, xbuf]);
        }
    };
}

class Address {
    constructor(publicKey){
        // publish key to bitcoin address(内部地址)
        this.hashBuffer =  Hash.ripemd160(Hash.sha256(publicKey.toBuffer()))
        this.network = publicKey.network
        this.type = Address.PayToPublicKeyHash
    }
    
    // 生成用户见到的比特币地址
    // Base58Check Encoding
    toString () {
        // 比特币地址的前缀是0（十六进制是0x00）
        const version = new Buffer([0])
        const payload = this.hashBuffer
        // 1. add version prefix
        const addVersionPrefix =  Buffer.concat([version, payload])
        // 2. hash(version prefix + payload)
        const checksum = Hash.sha256(Hash.sha256(addVersionPrefix)).slice(0, 4)
        // 3. add first 4 bytes as checksum
        const addChecksum = Buffer.concat([addVersionPrefix, hash])
        // 4. encode in base-58
        return bs58.encode(addChecksum);
    }
}


Address.PayToPublicKeyHash = 'pubkeyhash';
Address.PayToScriptHash = 'scripthash';


class Networks {}

Networks.defaultNetwork = 'livenet';


class Hash {}

Hash.sha256 = function(buf) {
    return crypto.createHash('sha256').update(buf).digest();
};

Hash.ripemd160 = function(buf) {
    return crypto.createHash('ripemd160').update(buf).digest();
};


const  privateKey = new PrivateKey()

console.log(privateKey)

const publicKey = new PublicKey(privateKey)

console.log(publicKey)


const address = new Address(publicKey)

console.log(address.toString())