import * as signalR from '@microsoft/signalr';
import { createSignalrEventEmitter } from '../src/signalr-event-emitter';

const hubConnection = new signalR.HubConnectionBuilder()
  .withUrl('/myhub')
  .build();


interface ServerEvents {
  operationstarted: (opId: string) => void;
  operationprogress: (opId: string, processed: number, total: number) => void;
  operationfinished: (opId: string) => void;
}

const hubConnectionMethods = createSignalrEventEmitter<ServerEvents>(hubConnection);

hubConnectionMethods.once('operationstarted', (opId) => {
  console.log(`server sent operationstarted: ${opId}`);
});

hubConnectionMethods.on('operationprogress', (opId, processed, total) => {
  console.log(`operationprogress for id ${opId}: ${processed}/${total}`);
});

hubConnectionMethods.on('operationfinished', (opId) => {
  console.log(`operation finished: ${opId}`);
});