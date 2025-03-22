import type { Route } from '../../components/app/routes.ts';
import { Endpoint, routes } from '../../components/app/routes.ts';
import { Element } from '../../components/base/element.ts';
import { EventType } from '../../constants/index.ts';
import { Router } from '../../router/router.ts';
import { isOptionsDataValid } from '../option-list/utils/misc.ts';

export class MainSection extends Element {
  private router: Router;

  constructor() {
    super({ tag: 'main' });

    this.router = new Router(routes);

    this.router.subscribe('routechange', this.handleRouteChange);
  }

  public setContent(content: Element): void {
    this.removeChildren();
    this.append(content);
  }

  private handleRouteChange = ({ pathname, component }: Route): void => {
    this.dispatch(EventType.BeforeContentChange);

    if (Router.isPathnamesEqual(pathname, Endpoint.DecisionPicker) && !isOptionsDataValid()) {
      this.router.navigate(Endpoint.OptionList);
      return;
    }
    this.setContent(component(this.router));
  };
}
