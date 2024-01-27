export type Handler<T> = (data: T) => void;

export const keyboardActions = ["down", "up", "press"] as const;
export type KeyboardAction = (typeof keyboardActions)[number];
export const mouseButtonActions = ["down", "up"] as const;
export type MouseButtonAction = (typeof mouseButtonActions)[number];

export type MouseButton = (typeof mouseButtons)[number];
export const mouseButtons = ["left", "right", "middle"] as const;
