import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import * as url from 'url';
import * as _ from "lodash"

export class LedEmulatorServer {
    public static readonly PORT_SOCKETS:number = 8081;

    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;

    private port_sockets: string | number;

    public colors = {red: 0, green: 0, blue: 0, warmWhite: 0, coldWhite: 0}

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listenSockets();
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private config(): void {
        this.port_sockets = process.env.PORT_SOCKETS || LedEmulatorServer.PORT_SOCKETS;
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private listenSockets(): void {
        this.app.get('/', (req, res) => {
            let query = url.parse(req.url, true).query;
            let resData = 'Response: hello world';

            _.forEach(query, (val, key) => {
                if (key !== 'state' && key !== 'mode' && key !== 'ledMode') {
                    this.setColor(key, val);
                }
            });    
            res.send(resData);
        });

        this.server.listen(this.port_sockets, () => {
            console.log('Running server on port %s', this.port_sockets);
        });

        this.io.on('connect', (socket: any) => {
            console.log('Connected client on port %s.', this.port_sockets);
            console.log('socket', socket.id);

            this.io.sockets.emit('action', 'You had been connected.');

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });     
    }

    public setColor(colourName, value) {
        this.colors[colourName] = value;
        let msg = {color: this.colors};
        this.io.sockets.emit('message', msg);
    }

    private createApp(): void {
        this.app = express();

        this.app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            res.setHeader('Access-Control-Allow-Credentials', 'false');
            // Pass to next layer of middleware
            next();
        });
    }
}