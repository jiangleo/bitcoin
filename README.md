这是一个写着玩的 bitcoin 客户端库，代码不复杂，轻松了解比特币。

### 起因

看书确实是很好的学习比特币的方法，但是没有代码的帮助，理解比特币如何实现时，很是困难。因此，想去阅读其代码实现。

在阅读 bitcoin-core 用 C++ 客户端时，其环境和调试对我来说实在麻烦，代码写的我看不太懂。
后来发现一个用 JS 写的完整 bitcoin 客户端，就决定用它来研究比特币源码了，帮助我理解比特币。


### 环境

1. 搭建 NodeJS 环境. => https://nodejs.org/zh-cn/

2. 下载仓库

```
$ git clone https://github.com/jiangleo/bitcoin.git
```

3. 启动项目

```
$ cd bitcoin
$ npm install
$ node index.js
```

### 参考文档:

[精通比特币(第二版) 第四章 密钥与地址](http://book.8btc.com/books/6/masterbitcoin2cn/_book/ch04.html)
[bitcore-lib](https://github.com/bitpay/bitcore-lib)