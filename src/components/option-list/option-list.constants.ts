import { LS_PREFIX } from '@common';

export const DELETE_BTN_SELECTOR = '[data-delete]';
export const RE_END_OF_LINE = /\r?\n|\r/;
export const RE_CSV_LINE = /^(?<title>.*),(?<weight>[^,]*)$/;
export const FILE_NAME = `options-${LS_PREFIX}`;
export const INITIAL_ID = 1;
