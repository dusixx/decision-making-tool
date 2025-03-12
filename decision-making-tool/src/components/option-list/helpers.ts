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
