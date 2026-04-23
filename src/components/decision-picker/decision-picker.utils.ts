import { Icon } from '@/common';
import { showModalMessage } from '@/common/utils/index.ts';
import type { SliceData } from '../wheel/wheel.types.ts';
import styles from './decision-picker.module.scss';

const ERR_NO_WINNER = 'Something went wrong. The winner is not determined!';

export const showVictoryMessage = (winner: SliceData | null): void => {
  if (winner) {
    const idStyle = `background-color:${winner.color}`;

    const message = `<p class='${styles.victoryMessage}'>
      <span style='${idStyle}' class='${styles.winnerId}'>
        ${Icon.CheckMark} #${winner.id.toString()}
      </span>
      ${winner.title}
    </p>`;
    showModalMessage(message);
  } else {
    showModalMessage(ERR_NO_WINNER);
  }
};
