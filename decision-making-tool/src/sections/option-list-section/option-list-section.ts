import { Button } from '../../components/base/button.ts';
import { Element } from '../../components/base/element.ts';
import type { FileData } from '../../components/file-service/file-loader.ts';
import { FileService } from '../../components/file-service/file-service.ts';
import { MessageBox } from '../../components/modal/message-box/message-box.ts';
import { PasteList } from '../../components/modal/paste-list/paste-list.ts';
import { OptionList } from '../../components/option-list/option-list.ts';
import { parseOptionsData } from '../../components/wheel/helpers.ts';
import { SoundToggler } from '../decision-picker-section/sound-toggler.ts';

import styles from './option-list-section.module.scss';

const buttonData: Record<string, string> = {
  add: 'add item',
  paste: 'paste list',
  clear: 'clear list',
  save: 'save to file',
  load: 'load from file',
  start: '🚀 start',
};

type ButtonsMap = Record<keyof typeof buttonData, Button>;

const messageBox = new MessageBox();

// TODO: исправить проверку на валидность кругом
const ERR_INVALID_OPTIONS_COUNT = `Please add at least 2 valid options.
  An option is considered valid if its title is not empty and its weight is greater than 0`;

//
// OptionListSection
//

export class OptionListSection extends Element {
  private fileService: FileService = FileService.instance;
  private optionList: OptionList = new OptionList();
  private pasteList: PasteList = new PasteList();
  private buttons: ButtonsMap = {};

  constructor() {
    super({ tag: 'section' });

    const success = this.optionList.restoreFromLocalStorage();
    if (!success) {
      this.optionList.add();
    }
    this.append(this.createWrapper());
    this.addInteractivity();
  }

  private createWrapper(): Element<HTMLDivElement> {
    return new Element<HTMLDivElement>(
      { tag: 'div', className: styles.wrapper },
      this.createButtons(),
      this.optionList,
      this.pasteList.underlyingElement
    );
  }

  private createButtons(): Element<HTMLDivElement> {
    const buttons = Object.entries(buttonData).map(([name, text]) => {
      const button = new Button({ className: styles.btn, text });

      if (button.text === buttonData.start) {
        button.toggleClass(styles.startBtn);
      }
      this.buttons[name] = button;

      return button;
    });

    buttons.push(new SoundToggler());

    return new Element<HTMLDivElement>({ tag: 'div', className: styles.btns }, ...buttons);
  }

  private handlePasteClick(): void {
    this.buttons.paste.onClick = (): void => {
      this.pasteList.show();
    };
    this.pasteList.onConfirm = (text): void => {
      this.optionList.parseCSV(text);
    };
  }

  private handleLoadClick(): void {
    this.buttons.load.onClick = (): void => {
      this.fileService.browseForFile('.json');
    };
    this.fileService.onLoad = (v: FileData): void => {
      if (typeof v === 'string') {
        this.optionList.restoreFromJSON(v);
      }
    };
  }

  private handleStartClick(): void {
    this.buttons.start.onClick = (): void => {
      const parsed = parseOptionsData(this.optionList.getOptionsData());
      if (!parsed.isValid) {
        messageBox.show(ERR_INVALID_OPTIONS_COUNT);
      }
    };
  }

  private addInteractivity(): void {
    const { optionList } = this;
    const { add, clear, save } = this.buttons;

    this.handleLoadClick();
    this.handlePasteClick();
    this.handleStartClick();

    add.onClick = (): void => {
      optionList.add();
    };
    clear.onClick = (): void => {
      optionList.clear();
    };
    save.onClick = (): void => {
      optionList.saveToFile();
    };
  }
}
