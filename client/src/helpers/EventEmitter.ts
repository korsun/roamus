import { createNanoEvents } from 'nanoevents';

export class EventEmitter {
  private emitter: ReturnType<typeof createNanoEvents>;

  constructor() {
    this.emitter = createNanoEvents();
  }

  public emit = (name: string, data?: unknown, duration?: number) => {
    this.emitter.emit(name, data, duration);
  };

  public onEvent = (eventName: string, fn: AnyFunction) =>
    this.emitter.on(eventName, fn);
}
