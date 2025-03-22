import { showModalMessage } from '../../../components/modal/utils/show-modal-message.ts';
import type { SliceData } from '../../../components/wheel/wheel.ts';
import { Icon } from '../../../constants/index.ts';

import styles from '../decision-picker.module.scss';

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
