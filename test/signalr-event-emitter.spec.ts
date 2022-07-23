import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as signalR from '@microsoft/signalr';
import { createSignalrEventEmitter } from '../src/signalr-event-emitter';

interface Methods {
  method1: (arg1: string) => void;
  method2: (arg1: number, arg2: number[]) => void;
}

describe('methods proxy', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let emitter: ReturnType<typeof createSignalrEventEmitter<Methods>>;
  let hubConnection: signalR.HubConnection;

  beforeEach(() => {
    hubConnection = {
      methods: {}
    } as unknown as signalR.HubConnection;

    emitter = createSignalrEventEmitter<Methods>(hubConnection);
  });

  it('should return an emit function for each event', () => {
    // @ts-expect-error
    expect(Array.isArray(hubConnection.methods.method1)).toBe(true);

    // @ts-expect-error
    expect(Array.isArray(hubConnection.methods.method2)).toBe(true);

    // @ts-expect-error
    expect(typeof hubConnection.methods.method1[0]).toBe('function');

    // @ts-expect-error
    expect(typeof hubConnection.methods.method2[0]).toBe('function');
  });

  it('should return existing methods along with the emit function', () => {
    const handler = () => { };

    // @ts-expect-error
    hubConnection.methods.method1 = [handler];

    // @ts-expect-error
    expect(hubConnection.methods.method1.length).toBe(2);

    // @ts-expect-error
    expect(hubConnection.methods.method1[0]).toBe(handler);

    // @ts-expect-error
    expect(typeof hubConnection.methods.method1[1]).toBe('function');
  });

  it('should return symbol values without modifying them', () => {
    const sym = Symbol();

    // @ts-expect-error
    hubConnection.methods[sym] = 5;

    // @ts-expect-error
    expect(hubConnection.methods[sym]).toBe(5);
  });
});
