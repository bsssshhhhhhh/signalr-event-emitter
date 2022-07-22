import * as signalR from '@microsoft/signalr';
import { createSignalrEventEmitter } from '../src/signalr-event-emitter';

const hubConnection = new signalR.HubConnectionBuilder()
  .withUrl('/myhub')
  .build();

/**
 * A common use case for SignalR is to use it for reporting progress in a long-running operation.
 * 
 * This file contains an example for how to use promises to make working with signalr events simpler
 */
interface ServerEvents {
  operationstarted: (opId: string) => void;
  operationprogress: (opId: string, processed: number, total: number) => void;
  operationfinished: (opId: string) => void;
}

const hubConnectionMethods = createSignalrEventEmitter<ServerEvents>(hubConnection);

const waitForOperationCompleted = (opId: string) => new Promise<void>((resolve) => {
  const handler = (finishedOpId: string) => {
    if (finishedOpId === opId) {
      hubConnectionMethods.off('operationfinished', handler);
      resolve();
    }
  };

  hubConnectionMethods.on('operationfinished', handler);
});


// now we can await the operationfinished method being received
async function doLongRunningOperation() {
  const opId = await hubConnection.invoke('startOperation');
  await waitForOperationCompleted(opId);
  console.log('operation completed');
}