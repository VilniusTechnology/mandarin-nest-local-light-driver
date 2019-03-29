const socketClient = require('./dist/client').SocketClient;

let cc = new socketClient();

cc.initSocket('http://localhost:7777');
const pr = cc.onMessage().subscribe( (value) => { 
    console.log('Incomming data: ', value)
});
