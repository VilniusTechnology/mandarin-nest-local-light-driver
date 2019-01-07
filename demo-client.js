const socketClient = require('./dist/index').SocketClient;

let cc = new socketClient();

cc.initSocket('http://localhost:8081');
cc.onMessage().toPromise().then((resolution) => {
    console.log('As Promised: ', resolution);
})