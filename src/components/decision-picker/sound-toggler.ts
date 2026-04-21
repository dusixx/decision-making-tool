import { Icon, JSONParse, LocalStorageKey } from '@common';
import { Button } from '@components';
import styles from './decision-picker.module.scss';

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
    const value = JSONParse(localStorage.getItem(LocalStorageKey.Muted) ?? '0');
    this.isMuted = Boolean(Number(value));
    this.update();
  }

  private update(): void {
    this.node.textContent = this.isMuted ? Icon.Muted : Icon.Unmuted;
  }

  private toggle(): void {
    this.isMuted = !this.isMuted;
    this.update();
    localStorage.setItem(LocalStorageKey.Muted, Number(this.isMuted).toString());
  }
}
