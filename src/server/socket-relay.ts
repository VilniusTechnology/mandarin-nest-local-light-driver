import * as socketIo from 'socket.io';
import * as express from 'express';
import { createServer, Server } from 'http';

export class SocketRelay {

    public colors;
    private io;
    public server: any;
    private app: express.Application;

    constructor(io) {
        this.server = createServer(this.app);
        this.io = socketIo();
    }

    public setDutyCycle(colourName: string, value: number) {
        this.colors[colourName].value = value;
        this.io.sockets.emit('message', {color: this.colors});
    }
}