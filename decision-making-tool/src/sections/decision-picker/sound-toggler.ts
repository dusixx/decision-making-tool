import { Button } from '../../components/base/button.ts';
import { JSONParse } from '../../utils/misc.ts';

import styles from './decision-picker.module.scss';

enum SoundState {
  Unmuted = '🔊',
  Muted = '🔇',
}

const LS_KEY_MUTED = 'dmt-0fef90dd-muted';

//
//-----------------------------
// SoundToggler
//-----------------------------
//

export class SoundToggler extends Button {
  private isMuted: boolean = false;

  constructor() {
    super({ className: styles.soundBtn, title: 'sound on/off' });

    this.init();

    this.onClick = (): void => {
      this.update(!this.isMuted);
    };
  }

  public get muted(): boolean {
    return this.isMuted;
  }

  public set muted(v: boolean) {
    this.update(v);
  }

  private init(): void {
    const value = JSONParse(localStorage.getItem(LS_KEY_MUTED) ?? '');
    this.update(typeof value === 'string' && value === 'true');
  }

  private update(v: boolean): void {
    this.isMuted = v;
    this.node.textContent = v ? SoundState.Muted : SoundState.Unmuted;
    localStorage.setItem(LS_KEY_MUTED, v.toString());
  }
}
