import { Button } from '../../components/base/button.ts';
import { Element } from '../../components/base/element.ts';
import { MessageBox } from '../../components/modal/message-box/message-box.ts';
import { OptionList } from '../../components/option-list/option-list.ts';
import { Endpoint, type Router } from '../../components/router/router.ts';
import type { SliceData } from '../../components/wheel/wheel.ts';
import { Wheel } from '../../components/wheel/wheel.ts';
import { isPositiveInt } from '../../utils/misc.ts';
import { SoundToggler } from './sound-toggler.ts';

import styles from './decision-picker.module.scss';

const DURATION_INPUT_ID = 'duration-id';
const DURATION_DEF_VALUE_SECS = 10;
const DURATION_MIN_VALUE_SECS = 5;
const DURATION_MAX_VALUE_SECS = 100;

const ERR_NO_WINNER = 'Something went wrong. The winner is not determined!';

const wonSound = new Audio('./won.mp3');

const buttonsData: Record<string, string> = {
  back: '↩ back',
  sound: 'sound',
  start: '🚀 start',
};

type ButtonsMap = Record<keyof typeof buttonsData, Button>;

const createWheel = (): Wheel | null => {
  const listData = OptionList.getFromLocalStorage();
  return listData ? new Wheel({ options: listData.list }) : null;
};

const createDurationElement = (): [Element<HTMLDivElement>, Element<HTMLInputElement>] => {
  const wrapper = new Element<HTMLDivElement>({ tag: 'div', className: styles.durationWrapper });
  const label = new Element<HTMLLabelElement>({ tag: 'label', className: styles.label });

  label.text = '⏱️';
  label.node.htmlFor = DURATION_INPUT_ID;

  const input = new Element<HTMLInputElement>({
    tag: 'input',
    type: 'number',
    id: DURATION_INPUT_ID,
    className: styles.input,
    min: DURATION_MIN_VALUE_SECS.toString(),
    value: DURATION_DEF_VALUE_SECS.toString(),
  });

  wrapper.append(label, input);

  return [wrapper, input];
};

//
//-----------------------------
// DecisionPickerSection
//-----------------------------
//

export class DecisionPickerSection extends Element {
  private messageBox = new MessageBox();
  private wheel: Wheel | null = null;
  private duration: Element<HTMLInputElement>;
  private buttons: ButtonsMap = {};

  constructor(private router: Router) {
    super({ tag: 'section' });

    this.router = router;
    this.wheel = createWheel();

    const [durationWrapper, durationInput] = createDurationElement();
    this.duration = durationInput;

    const wrapper = new Element<HTMLDivElement>(
      { tag: 'div', className: styles.wrapper },
      this.createButtonsElement(),
      durationWrapper,
      this.wheel,
      this.messageBox.parentModal
    );

    this.append(wrapper);
    this.addInteractivity();
  }

  private createButtonsElement(): Element<HTMLDivElement> {
    const buttons = Object.entries(buttonsData).map(([name, text]) => {
      const button =
        text === buttonsData.sound
          ? new SoundToggler()
          : new Button({ className: styles.btn, text });

      if (button.text === buttonsData.start) {
        button.toggleClass(styles.startBtn);
      }
      this.buttons[name] = button;

      return button;
    });

    return new Element<HTMLDivElement>({ tag: 'div', className: styles.btns }, ...buttons);
  }

  private isSoundedMuted(): boolean {
    const { sound } = this.buttons;
    return sound instanceof SoundToggler && sound.muted;
  }

  private showWinner = (winner: SliceData | null): void => {
    if (!this.isSoundedMuted()) {
      void wonSound.play();
    }
    this.messageBox.show(winner ? `"${winner.title}" won! 🥳` : ERR_NO_WINNER);
  };

  private handleDurationBlur(): void {
    this.duration.addListener('blur', ({ target }) => {
      if (target instanceof HTMLInputElement) {
        if (
          !isPositiveInt(target.value) ||
          target.value < DURATION_MIN_VALUE_SECS ||
          target.value > DURATION_MAX_VALUE_SECS
        ) {
          target.value = DURATION_MIN_VALUE_SECS.toString();
        }
      }
    });
  }

  private handleBackClick(): void {
    const { back } = this.buttons;
    back.onClick = (): void => {
      this.router.navigate(Endpoint.OptionList);
    };
  }

  private handleStartClick(): void {
    const { start } = this.buttons;
    start.onClick = (): void => {
      this.wheel?.spin(Number(this.duration.node.value));
    };
  }

  private handleWheelSpinFinish(): void {
    if (this.wheel) {
      this.wheel.onFinish = this.showWinner;
    }
  }

  private addInteractivity(): void {
    this.handleStartClick();
    this.handleBackClick();
    this.handleDurationBlur();
    this.handleWheelSpinFinish();
  }
}
