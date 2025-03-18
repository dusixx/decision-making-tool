import { isPositiveInt } from '../../utils/misc.ts';
import type { ListData } from './option-list.ts';

const DELETE_BTN_SELECTOR = '[data-delete]';
const RE_EMPTY_LINES = /^(?:[\t ]*(?:\r?\n|\r))+/;
const RE_EOL = /\r?\n|\r/;

export const getPressedDeleteButtonId = ({ target }: Event): number | undefined => {
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const deleteButton = target.closest<HTMLButtonElement>(DELETE_BTN_SELECTOR);
  if (!deleteButton) {
    return;
  }
  return Number(deleteButton.dataset.delete);
};

export const isLikeListData = (v: unknown): v is ListData => {
  return (
    v != null &&
    typeof v === 'object' &&
    'list' in v &&
    'lastId' in v &&
    typeof v['lastId'] === 'number'
  );
};

export const normalizeCSV = (txt: string): string[] | null => {
  const lines = txt
    .replace(RE_EMPTY_LINES, '')
    .split(RE_EOL)
    .filter((line) => line.includes(','));

  return lines.length ? lines : null;
};

export const isValidWeight = (weight: string | number): boolean => {
  return isPositiveInt(weight) && weight > 0;
};
