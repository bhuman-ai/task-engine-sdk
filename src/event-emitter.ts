type HandlerMap = Record<string, (data: any) => void>;

type TapFn<T extends HandlerMap> = <E extends keyof T>(
  event: E,
  handler: Parameters<T[E]>[0]
) => void;

export class EventEmitter<T extends HandlerMap> {
  private handlers: {
    [k in keyof T]?: Set<T[k]>;
  } = {};

  private taps: Set<TapFn<T>> = new Set();

  protected emit<E extends keyof T>(event: E, data: Parameters<T[E]>[0]) {
    this.handlers[event]?.forEach((handler) => handler(data));
    this.taps.forEach((tap) => tap(event, data));
  }

  public on<E extends keyof T>(event: E, handler: T[E]) {
    this.handlers[event] ??= new Set();
    // @ts-ignore - the set will be defined
    this.handlers[event].add(handler);
  }

  public off<E extends keyof T>(event: E, handler: T[E]) {
    this.handlers[event]?.delete(handler);
  }

  public tap(fn: TapFn<T>) {
    this.taps.add(fn);
  }

  public untap(fn: TapFn<T>) {
    this.taps.delete(fn);
  }

  public once<E extends keyof T>(event: E, handler: T[E]) {
    // @ts-ignore - this is correct
    const onceHandler: T[E] = (data) => {
      this.off(event, onceHandler);
      handler(data);
    };
    this.on(event, onceHandler);
  }
}
