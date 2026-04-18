export enum EventType {
  BeforeContentChange = 'beforecontentchange',
}

export enum Icon {
  Palette = '🎨',
  Rocket = '🚀',
  Stopwatch = '⏱️',
  Hourglass = '⏳',
  PartyingFace = '🥳',
  LeftArrow = '↩',
  Unmuted = '🔊',
  Muted = '🔇',
  FourLeafClover = '🍀',
  House = '🏠',
  Wheel = '🎡',
  CrystalBall = '🔮',
  Pull8Ball = '🎱',
  Target = '🎯',
  CheckMark = '✔️',
}

export enum Visibility {
  Visible = 'visible',
  Hidden = 'hidden',
  None = 'none',
}

export enum KeyboardEventKey {
  Escape = 'Escape',
}

export const LS_PREFIX = 'dmt-0fef90dd';

export const LocalStorageKey = {
  OptionList: `${LS_PREFIX}-options`,
  Muted: `${LS_PREFIX}-muted,`,
} as const;

const WON_SOUND = new Audio('./won.mp3');
const SLICE_CHANGE_SOUND = new Audio('./slice-change.mp3');

SLICE_CHANGE_SOUND.playbackRate = 15;
WON_SOUND.volume = 0.2;

export const Sound = {
  Won: WON_SOUND,
  SliceChange: SLICE_CHANGE_SOUND,
} as const;
