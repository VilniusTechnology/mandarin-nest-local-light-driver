import { Observable } from 'rxjs';
import * as socketIo from 'socket.io-client';
import { Message } from '../model/message';

export class SocketClient {
    private socket;

    public initSocket(SERVER_URL): void {
        this.socket = socketIo(SERVER_URL);
        console.log('initSocket completed...');
    }

    public onMessage(): Observable<Message> {
        return new Observable<Message>(observer => {
            this.socket.on('message', (data: Message) => {
                console.log('Received incomming messsage: ', data);
                observer.next(data);
            });
        });
    }
}
