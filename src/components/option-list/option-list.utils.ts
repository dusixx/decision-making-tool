import { isPositiveInt, JSONParse, LocalStorageKey } from '@common';
import { DELETE_BTN_SELECTOR, RE_CSV_LINE, RE_END_OF_LINE } from './option-list.constants.ts';
import type { ListData } from './option-list.types.ts';

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

export const normalizeCSVText = (txt: string): string[] | null => {
  const lines = txt.split(RE_END_OF_LINE).filter((line) => line.includes(','));
  return lines.length ? lines : null;
};

export const parseCSVLine = (line: string): { title: string; weight: string } | null => {
  const match = line.match(RE_CSV_LINE);
  if (!match) {
    return null;
  }
  const [, title, weight] = match;

  return {
    title: title.trim(),
    weight: weight.trim(),
  };
};

export const isValidWeight = (weight: string | number): boolean => {
  return isPositiveInt(weight) && weight > 0;
};

export const getOptionListFromLocalStorage = (): ListData | null => {
  const txt = localStorage.getItem(LocalStorageKey.OptionList);
  const data = JSONParse(txt ?? '');

  return isLikeListData(data) ? data : null;
};
