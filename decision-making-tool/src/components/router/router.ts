export enum Endpoint {
  OptionList = '/',
  DecisionPicker = '/decision-picker',
  Index = '/index',
  NotFound = '/{404}',
}

export type RouteData = {
  pathname: string;
  callback: () => void;
};

export const EVENT_MATCH_ROUTE = 'matchroute';

type OnLocationChangeHandler = ((v: Location) => void) | null;

const observeLocationPathnameChange = (handler: OnLocationChangeHandler): void => {
  let previousPathname = '';

  const observer = new MutationObserver(() => {
    if (location.pathname !== previousPathname) {
      previousPathname = location.pathname;
      handler?.(location);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
};

//
//-----------------------------
// Router
//-----------------------------
//

export class Router {
  public static NOT_FOUND_PAGE = Endpoint.NotFound;
  private _onLocationChange: OnLocationChangeHandler = null;

  constructor(private routes: RouteData[]) {
    observeLocationPathnameChange(this._onLocationChange);

    this.handlePopstate();

    document.addEventListener('DOMContentLoaded', () => {
      this.navigate(location.pathname);
    });
  }

  public set onLocationChange(handler: OnLocationChangeHandler | null) {
    this._onLocationChange = handler;
  }

  public navigate(pathname: string, replace: boolean = false): void {
    this.matchRoute(pathname, replace);
  }

  private handlePopstate(): void {
    window.addEventListener('popstate', () => {
      this.navigate(location.pathname);
    });
  }

  private matchRoute(pathname: string, replace: boolean = false): void {
    pathname = pathname.match(/\/[^/]*$/)?.[0] ?? '/';

    document.dispatchEvent(
      new CustomEvent(EVENT_MATCH_ROUTE, {
        detail: pathname,
      })
    );
    const found = this.routes.find((route) => {
      return route.pathname.toLowerCase() === pathname.toLowerCase();
    });
    if (found) {
      const action = replace ? 'replaceState' : 'pushState';

      history[action](null, '', pathname);
      found.callback();

      return;
    }
    const page404 = this.routes.find((route) => {
      return route.pathname.toLowerCase() === Router.NOT_FOUND_PAGE.toLowerCase();
    });
    page404?.callback();
  }
}
