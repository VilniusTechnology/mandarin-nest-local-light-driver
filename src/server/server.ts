import { Colors } from './../model/colors';
import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import * as url from 'url';
import * as _ from "lodash"
import { PwmDriverEmulator } from '../server';

export class LedEmulatorServer {
    public static readonly PORT_SOCKETS:number = 8081;

    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;

    private port_sockets: string | number = 0;

    private pwm: PwmDriverEmulator;

    private config;

    public colors = {
        red: {
            value: 0
        }, 
        green: {
            value: 0
        }, 
        blue: {
            value: 0
        }, 
        warmWhite: {
            value: 0
        }, 
        coldWhite: {
            value: 0
        }, 
        ledMode: 1, 
        ledState:1,
    }

    public logger;

    constructor(logger) {
        this.logger = logger;
        this.logger.debug('LedEmulatorServer will init...');
    }

    public launch() {

        this.logger.debug(`Should launch LedEmulatorServer on port ${this.port_sockets}`);

        this.createApp();
        this.conf();
        this.createServer();
        this.sockets();
        this.listenHttp();

        this.config = {
            main : {
                red: 0,
                green: 1,
                blue: 2,
                coldWhite: 3,
                warmWhite: 4,
            }
        };

        this.pwm = new PwmDriverEmulator(this.config, 7777, this.logger);
    }

    public setPort(port: number) {
        this.port_sockets = port;
        this.logger.debug('setPort');
    }

    private createServer(): void {
        this.server = createServer(this.app);
        this.logger.debug('createServer');
    }

    private conf(): void {
        if (this.port_sockets == 0) {
            this.port_sockets = process.env.PORT_SOCKETS || LedEmulatorServer.PORT_SOCKETS;
        }
        this.logger.debug('config');
    }

    private sockets(): void {
        this.io = socketIo(this.server);
        this.logger.debug('sockets');
    }

    private listenHttp(): void {
        this.app.disable('etag');
        this.app.get('/', (req, res) => {
            let query = url.parse(req.url, true).query;

            _.forEach(query, (val: string, key: string) => {
                if (key !== 'state' && key !== 'mode' && key !== 'ledMode') {
                    this.pwm.setDutyCycle(this.resolvePinFromColor(key), parseInt(val));
                }
            });

            res.status(200); 
            res.send(this.colors);
        });

        this.logger.debug(`Routes inited...`);

        this.server.listen(this.port_sockets, () => {
            this.logger.debug('Running server on port: %s', this.port_sockets);
        });

        this.io.on('connect', (socket: any) => {
            this.logger.debug('Connected client on port %s.', this.port_sockets);
            this.logger.debug('socket', socket.id);

            this.io.sockets.emit('action', 'You had been connected.');

            socket.on('disconnect', () => {
                this.logger.debug('Client disconnected');
            });
        });     
    }

    private resolvePinFromColor(color: string) {
        return this.config.main[color];
    }

    public setDutyCycle(pin: number, colors: Colors) {
        // this.io.sockets.emit('message', colors);
        // console.log('Emitted: ', colors);
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

        this.logger.debug('createApp');
    }

    public getPwmDriver() {
        return this.pwm;
    }

    public terminate() {
        this.io.close();
        this.server.close(); 
    }
}