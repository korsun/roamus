import type { Coordinate } from '@common/schemas/routing';
import { createNanoEvents, type Emitter, type Unsubscribe } from 'nanoevents';

export class EventEmitter<E extends Record<string, unknown>> {
  private emitter: Emitter<{ [K in keyof E]: (payload: E[K]) => void }> =
    createNanoEvents();

  public emit = <K extends keyof E>(name: K, data: E[K]) => {
    // @ts-expect-error nanoevents' emit expects tuple; we pass single payload
    this.emitter.emit(name, data);
  };

  public onEvent = <K extends keyof E>(
    eventName: K,
    // biome-ignore lint/suspicious/noExplicitAny: literally any
    callback: (payload: E[K]) => any,
  ): Unsubscribe => this.emitter.on(eventName, callback);
}

export const COORDINATES_CHANGE_EVENT = 'coordinatesChange';

export type MapEvents = {
  [COORDINATES_CHANGE_EVENT]: Coordinate[];
};
