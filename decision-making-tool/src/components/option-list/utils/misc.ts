import { isPositiveInt, JSONParse } from '../../../utils/misc.ts';
import { type ListData } from '../option-list.ts';

export const LS_KEY_LIST = 'dmt-0fef90dd-list';

const DELETE_BTN_SELECTOR = '[data-delete]';

const RE_END_OF_LINE = /\r?\n|\r/;
const RE_CSV_LINE = /^(?<title>.*),(?<weight>[^,]*)$/;

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
  const txt = localStorage.getItem(LS_KEY_LIST);
  const data = JSONParse(txt ?? '');

  return isLikeListData(data) ? data : null;
};
