export type ListenerFn<T> = (data: T) => void;

export type EventDataMap = Record<string, unknown>;

export type TapFn<T extends EventDataMap> = <E extends keyof T>(
  event: E,
  data: T[E]
) => void;

export class EventEmitter<T extends EventDataMap> {
  private handlers: {
    [k in keyof T]?: Set<ListenerFn<T[k]>>;
  } = {};

  private taps: Set<TapFn<T>> = new Set();

  public emit<E extends keyof T>(event: E, data: T[E]) {
    this.handlers[event]?.forEach((handler) => handler(data));
    this.taps.forEach((tap) => tap(event, data));
  }

  public on<E extends keyof T>(event: E, handler: ListenerFn<T[E]>) {
    this.handlers[event] ??= new Set();
    this.handlers[event]?.add(handler);
  }

  public off<E extends keyof T>(event: E, handler: ListenerFn<T[E]>) {
    this.handlers[event]?.delete(handler);
  }

  public tap(fn: TapFn<T>) {
    this.taps.add(fn);
  }

  public untap(fn: TapFn<T>) {
    this.taps.delete(fn);
  }

  public once<E extends keyof T>(event: E, handler: ListenerFn<T[E]>) {
    const onceHandler: ListenerFn<T[E]> = (data) => {
      this.off(event, onceHandler);
      handler(data);
    };
    this.on(event, onceHandler);
  }

  public wait<E extends keyof T>(event: E): Promise<T[E]> {
    return new Promise((resolve) => {
      this.once(event, resolve);
    });
  }
}
