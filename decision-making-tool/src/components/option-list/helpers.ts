import type { ListData } from './option-list.ts';

export const getPushedDeleteButtonId = ({ target }: Event): number | undefined => {
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const deleteButton = target.closest<HTMLButtonElement>('[data-delete]');
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
