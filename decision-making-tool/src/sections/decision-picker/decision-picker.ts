import { Button } from '../../components/base/button.ts';
import { Element } from '../../components/base/element.ts';
import { MessageBox } from '../../components/modal/message-box/message-box.ts';
import { OptionList } from '../../components/option-list/option-list.ts';
import { Endpoint, type Router } from '../../components/router/router.ts';
import type { SliceData } from '../../components/wheel/wheel.ts';
import { Wheel } from '../../components/wheel/wheel.ts';
import { Icons } from '../../constants/icons.ts';
import { SoundToggler } from './sound-toggler.ts';

import { EVENT_APP_CONTENT_CHANGE } from '../../components/app/app.ts';
import styles from './decision-picker.module.scss';

const DURATION_INPUT_ID = 'duration-id';
const DURATION_DEF_VALUE = 10;
const DURATION_MIN_VALUE = 5;
const DURATION_MAX_VALUE = 30;

const ERR_NO_WINNER = 'Something went wrong. The winner is not determined!';

const SOUND_OF_VICTORY = new Audio('./won.mp3');

const INVITATION_MESSAGE = 'Press start button';

const buttonsData: Record<string, string> = {
  back: `${Icons.LeftArrow} back`,
  sound: 'sound',
  repaint: Icons.Palette,
  start: `${Icons.Rocket} start`,
};

type ButtonsMap = Record<keyof typeof buttonsData, Button>;

//
//-----------------------------
// Helpers
//-----------------------------
//

const createWheel = (): Wheel | null => {
  try {
    const listData = OptionList.getFromLocalStorage();
    return listData && new Wheel({ options: listData.list });
  } catch {
    return null;
  }
};

const createDurationElement = (): [Element<HTMLDivElement>, Element<HTMLInputElement>] => {
  const wrapper = new Element<HTMLDivElement>({ tag: 'div', className: styles.durationWrapper });
  const label = new Element<HTMLLabelElement>({ tag: 'label', className: styles.label });

  label.text = Icons.Stopwatch;
  label.node.htmlFor = DURATION_INPUT_ID;

  const input = new Element<HTMLInputElement>({
    tag: 'input',
    type: 'number',
    title: 'duration',
    id: DURATION_INPUT_ID,
    className: styles.duration,
    min: DURATION_MIN_VALUE.toString(),
    max: DURATION_MAX_VALUE.toString(),
    value: DURATION_DEF_VALUE.toString(),
    required: true,
  });

  wrapper.append(label, input);

  return [wrapper, input];
};

const createPickedOptionElement = (): Element<HTMLInputElement> => {
  return new Element<HTMLInputElement>({
    tag: 'input',
    placeholder: INVITATION_MESSAGE,
    className: styles.pickedOption,
    readOnly: true,
    disabled: true,
  });
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
  private pickedOption: Element<HTMLInputElement>;
  private buttons: ButtonsMap = {};

  constructor(private router: Router) {
    super({ tag: 'section' });

    this.router = router;
    this.wheel = createWheel();

    const [durationWrapper, durationInput] = createDurationElement();
    this.duration = durationInput;

    this.pickedOption = createPickedOptionElement();
    const inputsWrapper = new Element<HTMLDivElement>(
      { tag: 'div', className: styles.inputs },
      durationWrapper,
      this.pickedOption
    );

    const wrapper = new Element<HTMLDivElement>(
      { tag: 'div', className: styles.wrapper },
      this.createButtonsElement(),
      inputsWrapper,
      this.wheel
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
      } else if (button.text === buttonsData.repaint) {
        button.toggleClass(styles.repaintBtn);
      }
      this.buttons[name] = button;

      return button;
    });

    return new Element<HTMLDivElement>({ tag: 'div', className: styles.btns }, ...buttons);
  }

  private isSoundMuted(): boolean {
    const { sound } = this.buttons;
    return sound instanceof SoundToggler && sound.muted;
  }

  private showWinner = (winner: SliceData | null): void => {
    if (!this.isSoundMuted()) {
      void SOUND_OF_VICTORY.play();
    }
    this.messageBox.show(
      winner
        ? `#${winner.id.toString()} "${winner.title}" won! ${Icons.PartyingFace}`
        : ERR_NO_WINNER
    );
  };

  private handleDurationBlur(): void {
    this.duration.addListener('blur', () => {
      this.duration.node.reportValidity();
    });
  }

  private handleRepaintClick(): void {
    const { repaint } = this.buttons;
    repaint.onClick = (): void => {
      this.wheel?.repaint();
    };
  }

  private handleBackClick(): void {
    const { back } = this.buttons;
    back.onClick = (): void => {
      this.router.navigate(Endpoint.OptionList);
    };
  }

  private disableControls(flag: boolean): void {
    Object.values(this.buttons).forEach((button) => (button.disabled = flag));
    this.duration.node.disabled = flag;
  }

  private handleWheelSpinFinish(): void {
    if (this.wheel) {
      this.wheel.onFinish = (winner): void => {
        this.disableControls(false);
        this.pickedOption.node.style.backgroundColor = 'var(--color-picked-option-bg)';
        this.showWinner(winner);
      };
    }
  }

  private handleStartClick(): void {
    this.handleWheelSpinFinish();

    this.buttons.start.onClick = (): void => {
      if (!this.duration.node.reportValidity()) {
        return;
      }
      this.pickedOption.node.style.backgroundColor = '';
      if (this.wheel) {
        this.pickedOption.node.value = this.wheel.currentSlice?.title ?? '';
      }
      this.disableControls(true);
      this.wheel?.spin(Number(this.duration.node.value));
    };
  }

  private handleAppContentChange(): void {
    document.addEventListener(EVENT_APP_CONTENT_CHANGE, () => {
      this.wheel?.stop();
    });
  }

  private handleSlideChange(): void {
    if (this.wheel) {
      this.wheel.onChange = (slice): void => {
        this.pickedOption.node.value = slice?.title ?? '';
      };
    }
  }

  private addInteractivity(): void {
    this.handleSlideChange();
    this.handleRepaintClick();
    this.handleAppContentChange();
    this.handleStartClick();
    this.handleBackClick();
    this.handleDurationBlur();
  }
}
