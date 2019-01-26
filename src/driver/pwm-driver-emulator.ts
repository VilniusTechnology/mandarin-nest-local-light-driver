import * as socketIo from 'socket.io';
import { createServer} from 'http';
import * as express from 'express';
import * as cors from 'cors';
import * as _ from "lodash";
import { PwmDriverFacade } from '../server';

export class PwmDriverEmulator extends PwmDriverFacade {

    public colors;
    public port;

    private io;
    private config;
    private server;

    public logger;

    constructor(config, port = null, logger) {

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
        app.set("port", this.port || 7778);
        app.use(cors());
        app.get('/', (req, res) => {
            res.status(200); 
            res.send({'message': 'ok'});
        });

        this.server = createServer(app);
        this.io = socketIo(this.server);
        this.io.sockets.emit('message', 'WER on IT');

        this.server.listen(this.port || 7778, () => {
            this.logger.debug('Running emulator emmiter server on port: %s', this.port || 7778);
        });

    }

    public setDutyCycle(pin: any, value: number) {
        const colorName = this.resolveColorFromPin(pin);

        this.colors[colorName].value = Math.ceil(value * 255);
        this.io.sockets.emit('message', {color: this.colors});

        this.logger.debug('Message emmited by setDutyCycle: ', {color: this.colors});
    }

    private resolveColorFromPin(pin: string) {
        let inverted = _.invert(this.config.main)

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