import { Observable } from 'rxjs';
import * as socketIo from 'socket.io-client';
import { LedEmulatorMessage } from '../model/led-emulator-message-model';

export class SocketClient {
    private socket;

    public initSocket(SERVER_URL): void {
        this.socket = socketIo(SERVER_URL);
        console.log('initSocket completed...');
    }

    public onMessage(): Observable<LedEmulatorMessage> {
        return new Observable<LedEmulatorMessage>(observer => {
            this.socket.on('message', (data: LedEmulatorMessage) => {
                observer.next(data);
            });
        });
    }
}
