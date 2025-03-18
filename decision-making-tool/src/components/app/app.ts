import {
  DecisionPickerSection,
  HeaderSection,
  NotFoundSection,
  OptionListSection,
} from '../../sections/index.ts';

import { Element } from '../base/element.ts';
import type { RouteData } from '../router/router.ts';
import { Endpoint, Router } from '../router/router.ts';
import { isOptionsDataValid } from '../wheel/helpers.ts';

export const EVENT_APP_CONTENT_CHANGE = 'appcontentchange';

//
//-----------------------------
// MainSection
//-----------------------------
//

class MainSection extends Element {
  private router: Router;

  constructor() {
    super({ tag: 'main' });
    this.router = new Router(this.createRoutes());
  }

  public setContent(content: Element): void {
    this.removeChildren();
    this.append(content);
  }

  private dispatchContentChange(): void {
    this.dispatch(EVENT_APP_CONTENT_CHANGE);
  }

  private createRoutes(): RouteData[] {
    return [
      {
        pathname: Endpoint.DecisionPicker,
        callback: (): void => {
          if (!isOptionsDataValid()) {
            this.router.navigate(Endpoint.OptionList);
            return;
          }
          this.dispatchContentChange();
          this.setContent(new DecisionPickerSection(this.router));
        },
      },
      {
        pathname: Endpoint.OptionList,
        callback: (): void => {
          this.dispatchContentChange();
          this.setContent(new OptionListSection(this.router));
        },
      },
      {
        pathname: Endpoint.Index,
        callback: (): void => {
          this.dispatchContentChange();
          this.setContent(new OptionListSection(this.router));
        },
      },
      {
        pathname: Router.NOT_FOUND_PAGE,
        callback: (): void => {
          this.setContent(new NotFoundSection(this.router));
        },
      },
    ];
  }
}

document.body.append(new HeaderSection().node, new MainSection().node);
