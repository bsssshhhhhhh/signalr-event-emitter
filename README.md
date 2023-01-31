# signalr-event-emitter

[![npm](https://img.shields.io/npm/v/signalr-event-emitter)](https://www.npmjs.com/package/signalr-event-emitter)

A utility function that allows for receiving method invocations from a SignalR hub in a type-safe way

## Why?

The `createSignalrEventEmitter` function in this package allows for defining event names and parameters via TypeScript


## Example

```ts

// build hub connection
const hubConnection = new signalR.HubConnectionBuilder()
  .withUrl('/somehub')
  .build();


// define method names and the parameters expected
interface Methods {
  started: () => void;
  progress: (processedCount: number, totalCount: number) => void;
  finished: () => void;
}

// attach emitter
const emitter = createSignalrEventEmitter<Methods>(hubConnection);


emitter.on('progress', (processedCount, totalCount) => {

});

```
