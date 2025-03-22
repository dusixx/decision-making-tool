import { Button } from '../../../components/base/button.ts';
import { Icon } from '../../../constants/index.ts';
import { JSONParse } from '../../../utils/misc.ts';

import styles from '../decision-picker.module.scss';

const LS_KEY_MUTED = 'dmt-0fef90dd-muted';
const BUTTON_TITLE = 'sound on/off';

export class SoundToggler extends Button {
  private isMuted: boolean = false;

  constructor() {
    super({ className: styles.soundBtn, title: BUTTON_TITLE });

    this.init();

    this.onClick = (): void => {
      this.toggle();
    };
  }

  public get muted(): boolean {
    return this.isMuted;
  }

  private init(): void {
    const value = JSONParse(localStorage.getItem(LS_KEY_MUTED) ?? '0');
    this.isMuted = Boolean(Number(value));
    this.update();
  }

  private update(): void {
    this.node.textContent = this.isMuted ? Icon.Muted : Icon.Unmuted;
  }

  private toggle(): void {
    this.isMuted = !this.isMuted;
    this.update();
    localStorage.setItem(LS_KEY_MUTED, Number(this.isMuted).toString());
  }
}
