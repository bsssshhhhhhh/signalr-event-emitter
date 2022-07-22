import type { HubConnection } from '@microsoft/signalr';
import { createEventEmitter } from 'simple-typed-events';

/**
 * Creates and attaches a strongly-typed event listener interface to the hub connection
 * 
 * Supply a type containing all of the event keys and the parameters that are expected.
 * Note that due to the way the SignalR client library is implemented, all event names must be lowercase
 * 
 * @param hubConnection SignalR HubConnection
 * @returns 
 */
export function createSignalrEventEmitter<
  Methods extends {
    [methodName in MethodNames]: (...args: never[]) => void;
  },
  MethodNames extends Lowercase<string & keyof Methods> = Lowercase<string & keyof Methods>
>(hubConnection: HubConnection) {
  const emitter = createEventEmitter<Methods>();

  // @ts-expect-error `methods` is not on the public interface for HubConnection
  hubConnection.methods = new Proxy(hubConnection.methods, {
    get(target, prop) {
      if (typeof prop === 'symbol') {
        return target[prop];
      }

      return [(...args: Parameters<Methods[MethodNames]>) => emitter.emit(prop as MethodNames, ...args)];
    }
  });

  return {
    on: emitter.on,
    off: emitter.off,
    once: emitter.once
  };
}
