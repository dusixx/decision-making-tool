/* eslint-disable max-len */
import { VALID_OPTIONS_COUNT } from '@/components/option-list-section/option-list-section.constants.ts';
import { Icon } from '@common';

export const DURATION_ID = 'duration';
export const DEFAULT_DURATION = '10';
export const MIN_DURATION = '5';
export const MAX_DURATION = '30';

export const INVITATION_MESSAGE = 'Press start button';

export const ERR_INVALID_OPTIONS_COUNT = `
  There must be at least ${VALID_OPTIONS_COUNT.toString()} valid options`;

export const ButtonText = {
  back: `${Icon.LeftArrow} back`,
  sound: 'sound',
  repaint: Icon.Palette,
  start: `${Icon.Rocket} start`,
} as const;
