import { Button } from '../../components/base/button.ts';
import { Element } from '../../components/base/element.ts';
import type { FileData } from '../../components/file-service/file-loader.ts';
import { FileService } from '../../components/file-service/file-service.ts';
import { MessageBox } from '../../components/modal/message-box/message-box.ts';
import { PasteList } from '../../components/modal/paste-list/paste-list.ts';
import { OptionList } from '../../components/option-list/option-list.ts';
import type { Router } from '../../components/router/router.ts';
import { Endpoint } from '../../components/router/router.ts';
import { parseOptionsData } from '../../components/wheel/helpers.ts';

import styles from './option-list.module.scss';

const buttonsData: Record<string, string> = {
  add: 'add item',
  paste: 'paste list',
  clear: 'clear list',
  save: 'save to file',
  load: 'load from file',
  start: '🚀 start',
};

type ButtonsMap = Record<keyof typeof buttonsData, Button>;

// TODO: исправить проверку на валидность кругом
const ERR_INVALID_OPTIONS_COUNT = `Please add at least 2 valid options.
  An option is considered valid if its title is not empty and its weight is greater than 0`;

//
//-----------------------------
//  OptionListSection
//-----------------------------
//

export class OptionListSection extends Element {
  private messageBox: MessageBox;
  private fileService: FileService = FileService.instance;
  private optionList: OptionList = new OptionList();
  private pasteList: PasteList = new PasteList();
  private buttons: ButtonsMap = {};

  constructor(private router: Router) {
    super({ tag: 'section' });

    this.router = router;
    this.messageBox = new MessageBox(this.pasteList.parentModal);

    const success = this.optionList.restoreFromLocalStorage();
    if (!success) {
      this.optionList.add();
    }
    this.append(this.createWrapperElement());
    this.addInteractivity();
  }

  private createWrapperElement(): Element<HTMLDivElement> {
    return new Element<HTMLDivElement>(
      { tag: 'div', className: styles.wrapper },
      this.createButtonsElement(),
      this.optionList,
      this.pasteList.parentModal
    );
  }

  private createButtonsElement(): Element<HTMLDivElement> {
    const buttons = Object.entries(buttonsData).map(([name, text]) => {
      const button = new Button({ className: styles.btn, text });

      if (button.text === buttonsData.start) {
        button.toggleClass(styles.startBtn);
      }
      this.buttons[name] = button;

      return button;
    });

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
        this.messageBox.show(ERR_INVALID_OPTIONS_COUNT);
        return;
      }
      this.router.navigate(Endpoint.DecisionPicker);
    };
  }

  private handleAddClick(): void {
    this.buttons.add.onClick = (): void => {
      this.optionList.add();
    };
  }

  private handleClearClick(): void {
    this.buttons.clear.onClick = (): void => {
      this.optionList.clear();
    };
  }

  private handleSaveClick(): void {
    this.buttons.save.onClick = (): void => {
      this.optionList.saveToFile();
    };
  }

  private addInteractivity(): void {
    this.handleLoadClick();
    this.handlePasteClick();
    this.handleStartClick();
    this.handleAddClick();
    this.handleClearClick();
    this.handleSaveClick();
  }
}
