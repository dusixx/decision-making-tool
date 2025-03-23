import { Endpoint } from '../../app/routes.ts';
import { Element } from '../../components/base/element.ts';
import type { SliceData } from '../../components/wheel/types.ts';
import type { Wheel } from '../../components/wheel/wheel.ts';
import { EventType } from '../../constants/index.ts';
import type { Router } from '../../router/router.ts';
import type { DecisionPickerSectionButtonsMap } from './utils/create-elements.ts';
import { createElements } from './utils/create-elements.ts';
import { showVictoryMessage } from './utils/misc.ts';
import { SoundToggler } from './utils/sound-toggler.ts';

const SOUND_OF_VICTORY = new Audio('./won.mp3');

const PICKED_OPTION_HIGHLIGHT_BG = 'var(--color-picked-option-bg)';

export class DecisionPickerSection extends Element {
  private wheel: Wheel;
  private duration: Element<HTMLInputElement>;
  private pickedOption: Element<HTMLInputElement>;
  private buttons: DecisionPickerSectionButtonsMap;

  constructor(private router: Router) {
    super({ tag: 'section' });

    const { durationInput, pickedOptionInput, wheel, wrapper, buttonsMap } = createElements();

    this.duration = durationInput;
    this.pickedOption = pickedOptionInput;
    this.buttons = buttonsMap;
    this.wheel = wheel;

    this.append(wrapper);

    this.init();
  }

  private isSoundMuted(): boolean {
    const { sound } = this.buttons;
    return sound instanceof SoundToggler && sound.muted;
  }

  private showWinner = (winner: SliceData | null): void => {
    if (!this.isSoundMuted()) {
      void SOUND_OF_VICTORY.play();
    }
    if (winner) {
      showVictoryMessage(winner);
    }
  };

  private addDurationFocusHandler(): void {
    this.duration.addListener('focus', () => {
      this.duration.node.select();
    });
  }

  private addDurationBlurHandler(): void {
    this.duration.addListener('blur', () => {
      this.duration.node.reportValidity();
    });
  }

  private addRepaintClickHandler(): void {
    const { repaint } = this.buttons;
    repaint.onClick = (): void => {
      this.wheel.repaint();
    };
  }

  private addBackClickHandler(): void {
    const { back } = this.buttons;
    back.onClick = (): void => {
      this.router.navigate(Endpoint.OptionList);
    };
  }

  private disableControls(flag: boolean): void {
    Object.values(this.buttons).forEach((button) => (button.disabled = flag));
    this.duration.node.disabled = flag;
  }

  private addWheelSpinFinishHandler(): void {
    this.wheel.onFinish = (winner): void => {
      this.disableControls(false);
      this.pickedOption.node.style.backgroundColor = PICKED_OPTION_HIGHLIGHT_BG;
      this.showWinner(winner);
    };
  }

  private addStartClickHandler(): void {
    this.addWheelSpinFinishHandler();

    this.buttons.start.onClick = (): void => {
      if (!this.duration.node.reportValidity()) {
        return;
      }
      this.pickedOption.node.style.backgroundColor = '';
      this.pickedOption.node.value = this.wheel.currentSlice?.title ?? '';
      this.disableControls(true);
      this.wheel.spin(Number(this.duration.node.value));
    };
  }

  private addBeforeContentChangeHandler(): void {
    document.addEventListener(EventType.BeforeContentChange, () => {
      this.wheel.stop();
    });
  }

  private addWheelSliceChangeHandler(): void {
    this.wheel.onChange = (slice): void => {
      this.pickedOption.node.value = slice?.shortenedTitle || slice?.title || '';
    };
  }

  private init(): void {
    this.addWheelSliceChangeHandler();
    this.addRepaintClickHandler();
    this.addBeforeContentChangeHandler();
    this.addStartClickHandler();
    this.addBackClickHandler();
    this.addDurationBlurHandler();
    this.addDurationFocusHandler();
  }
}
