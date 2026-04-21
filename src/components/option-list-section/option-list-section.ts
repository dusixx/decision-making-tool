import { Endpoint } from '@app/routes.ts';
import { EventType, showModalMessage } from '@common';
import { Element, OptionList, PasteList } from '@components';
import type { Router } from '@router';
import type { FileData } from '@services';
import { JSONFileService } from '@services';
import type { ButtonMap } from './create-view/create-view.ts';
import { createView } from './create-view/create-view.ts';
import { ERR_INVALID_OPTIONS_COUNT } from './option-list-section.constants.ts';
import { parseOptionsData } from './option-list-section.utils.ts';

export class OptionListSection extends Element {
  private fileService: JSONFileService = new JSONFileService();
  private optionList: OptionList = new OptionList();
  private pasteList: PasteList;
  private buttons: ButtonMap;

  constructor(private router: Router) {
    super({ tag: 'section' });

    this.pasteList = new PasteList();
    this.router = router;

    if (!this.optionList.updateFromLocalStorage()) {
      this.optionList.add();
    }

    const { wrapper, buttonMap } = createView();
    this.buttons = buttonMap;
    wrapper.append(this.optionList);

    this.append(wrapper);

    this.init();
  }

  public isOptionsDataValid(): boolean {
    return parseOptionsData(this.optionList.data).isValid;
  }

  private addPasteClickHandler(): void {
    this.buttons.paste.onClick = (): void => {
      this.pasteList.show();
    };
    this.pasteList.onConfirm = (text): void => {
      this.optionList.updateFromCSV(text);
    };
  }

  private addLoadClickHandler(): void {
    this.buttons.load.onClick = (): void => {
      this.fileService.load();
    };
    this.fileService.onLoad = (v: FileData): void => {
      if (typeof v === 'string') {
        this.optionList.updateFromJSON(v);
      }
    };
  }

  private addAddClickHandler(): void {
    this.buttons.add.onClick = (): void => {
      this.optionList.add();
    };
  }

  private addStartClickHandler(): void {
    this.buttons.start.onClick = (): void => {
      if (!this.isOptionsDataValid()) {
        showModalMessage(ERR_INVALID_OPTIONS_COUNT);
        return;
      }
      this.router.navigate(Endpoint.DecisionPicker);
    };
  }

  private addClearClickHandler(): void {
    this.buttons.clear.onClick = (): void => {
      this.optionList.clear();
    };
  }

  private addSaveClickHandler(): void {
    this.buttons.save.onClick = (): void => {
      this.optionList.saveToFile();
    };
  }

  private addBeforeContentChangeHandler(): void {
    document.addEventListener(EventType.BeforeContentChange, () => {
      this.optionList.saveToLocalStorage();
    });
  }

  private addBeforeUnloadHandler(): void {
    window.addEventListener('beforeunload', () => {
      this.optionList.saveToLocalStorage();
    });
  }

  private init(): void {
    this.addBeforeUnloadHandler();
    this.addBeforeContentChangeHandler();
    this.addLoadClickHandler();
    this.addPasteClickHandler();
    this.addStartClickHandler();
    this.addAddClickHandler();
    this.addClearClickHandler();
    this.addSaveClickHandler();
  }
}
