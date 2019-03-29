import * as socketIo from 'socket.io';
import { createServer} from 'http';
import * as express from 'express';
import * as cors from 'cors';
import * as _ from "lodash";
import { Logger } from 'log4js';
import { PwmDriverFacade } from '../server';

export class PwmDriverEmulator extends PwmDriverFacade {
    //////
    public colors;
    public port;

    private io;
    /////
    private config;
    private server;

    public logger: Logger;

    constructor(config, port = null, logger: Logger) {

        super();
        
        this.config = config;
        this.port = port;
        this.logger = logger;

        this.colors = {
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
        };

        const app = express();
        const portResolved = (this.port || 7778);

        this.logger.debug(`PORT resolved to ${portResolved}`);

        app.set("port", portResolved);
        app.use(cors());

        this.logger.debug('CORS POLICY WAS SET UP');

        app.get('/', (req, res) => {
            res.status(200); 
            res.send({'message': 'ok'});
        });

        this.server = createServer(app);
        this.io = socketIo(this.server);
        this.io.sockets.emit('message', 'PwmDriverEmulator is ON');

        this.server.listen(portResolved, () => {
            this.logger.debug('Running emulator emmiter server on port: %s', portResolved );
        });
    }

    public onClientConnect() {
        return new Promise((resolve, reject) => {
            this.io.sockets.on('connection', (socket) => { 
                this.logger.debug('Connection with client was established !');
                // console.log(socket.handshake);
                resolve(socket.request.socket.remoteAddress);
            });
        });
    }

    public setDutyCycle(pin: any, value: number) {
        const colorName = this.resolveColorFromPin(pin);

        this.colors[colorName].value = Math.ceil(value * 255);
        this.io.sockets.emit('message', {color: this.colors});

        this.logger.debug('Message emmited by setDutyCycle: ', {color: this.colors});
    }

    private resolveColorFromPin(pin: string) {
        let inverted = _.invert(this.config.contours.main)

        return inverted[pin];
    }

    public setUp() {
        this.logger.debug('setUp COMPLETE... ');
    }

    public terminate() {
        this.io.close();
        this.server.close(); 
    }
}