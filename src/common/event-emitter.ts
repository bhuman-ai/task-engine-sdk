/**
 * Listener function for an event.
 */
export type ListenerFn<T> = (data: T) => void;

/**
 * Map of event names to their data types.
 */
export type EventDataMap = Record<string, unknown>;

/**
 * Function to tap into all events.
 */
export type TapFn<T extends EventDataMap> = <E extends keyof T>(
  event: E,
  data: T[E]
) => void;

/**
 * A simple event emitter.
 */
export class EventEmitter<T extends EventDataMap> {
  private handlers: {
    [k in keyof T]?: Set<ListenerFn<T[k]>>;
  } = {};

  private taps: Set<TapFn<T>> = new Set();

  /**
   * Emit an event with data. This will call all listeners for the event and all taps of this emitter.
   */
  public emit<E extends keyof T>(event: E, data: T[E]) {
    this.handlers[event]?.forEach((handler) => handler(data));
    this.taps.forEach((tap) => tap(event, data));
  }

  /**
   * Register a listener for an event.
   */
  public on<E extends keyof T>(event: E, handler: ListenerFn<T[E]>) {
    this.handlers[event] ??= new Set();
    this.handlers[event]?.add(handler);
  }

  /**
   * Remove a listener for an event.
   */
  public off<E extends keyof T>(event: E, handler: ListenerFn<T[E]>) {
    this.handlers[event]?.delete(handler);
  }

  /**
   * Tap into all events.
   */
  public tap(fn: TapFn<T>) {
    this.taps.add(fn);
  }

  /**
   * Stop tapping into all events for a TapFn.
   */
  public untap(fn: TapFn<T>) {
    this.taps.delete(fn);
  }

  /**
   * Register a listener for an event that will only be called once.
   */
  public once<E extends keyof T>(event: E, handler: ListenerFn<T[E]>) {
    const onceHandler: ListenerFn<T[E]> = (data) => {
      this.off(event, onceHandler);
      handler(data);
    };
    this.on(event, onceHandler);
  }

  /**
   * Wait for an event to be emitted once. This is the async version of `once`.
   */
  public wait<E extends keyof T>(event: E): Promise<T[E]> {
    return new Promise((resolve) => {
      this.once(event, resolve);
    });
  }
}
