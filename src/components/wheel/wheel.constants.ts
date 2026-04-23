export const NEEDLE_RADIUS_RATIO = 0.15;
export const CANVAS_PADDING = 30;
export const WHEEL_DEFAULT_RADIUS = 250;
export const MIN_TURNS_COUNT = 5;

export const ERR_INVALID_CONTEXT =
  'The context id is not supported, or the canvas has already been set to a different context mode';

export const CURSOR_POSITION_RAD = Math.PI * 1.5;

export const WheelSpin = {
  MinSpeed: 5,
  MaxSpeed: 10,
  SpeedRatio: 1e4,
} as const;
