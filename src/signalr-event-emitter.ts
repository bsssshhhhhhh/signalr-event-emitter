import type { HubConnection } from '@microsoft/signalr';
import curry from 'lodash/curry';
import { createEventEmitter } from 'simple-typed-events';

/**
 * Creates and attaches a strongly-typed event emitter interface to the hub connection
 * 
 * Supply a type containing all of the event keys and the parameters that are expected.
 * Note that due to the way the SignalR client library is implemented, all event names must be lowercase
 * 
 * @param hubConnection SignalR HubConnection
 * @returns 
 */
export function createSignalrEventEmitter<
  Methods extends {
    [eventName in EventNames]: (...args: never[]) => void;
  },
  EventNames extends Lowercase<string & keyof Methods> = Lowercase<string & keyof Methods>
>(hubConnection: HubConnection) {
  const emitter = createEventEmitter<Methods>();

  const signalrMethodHandler = curry((method: keyof Methods, ...args: unknown[]) => {
    emitter.emit(method as EventNames, ...args as Parameters<Methods[EventNames]>);
  }, 2);

  // @ts-expect-error `methods` is not on the public interface
  hubConnection.methods = new Proxy(hubConnection.methods, {
    get(target, prop) {
      if (typeof prop === 'symbol') {
        return target[prop];
      }

      return [signalrMethodHandler(prop as EventNames)];
    }
  });

  return {
    on: emitter.on,
    off: emitter.off,
    once: emitter.once
  };
}
