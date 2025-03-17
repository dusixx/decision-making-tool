export enum Endpoint {
  OptionList = '/',
  DecisionPicker = '/decision-picker',
}

export type RouteData = {
  pathname: string;
  callback: () => void;
};

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
  public static NOT_FOUND_PAGE = '/{404}';
  private _onLocationChange: OnLocationChangeHandler = null;

  constructor(private routes: RouteData[]) {
    observeLocationPathnameChange(this._onLocationChange);

    document.addEventListener('DOMContentLoaded', () => {
      this.matchRoute(location.pathname);
    });
    this.handlePopstate();
  }

  public set onLocationChange(handler: OnLocationChangeHandler | null) {
    this._onLocationChange = handler;
  }

  public navigate(pathname: string, replace: boolean = false): void {
    this.matchRoute(pathname, replace);
  }

  private handlePopstate(): void {
    window.addEventListener('popstate', () => {
      console.log('popstate');
      this.navigate(location.pathname);
    });
  }

  private matchRoute(pathname: string, replace: boolean = false): void {
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
      return route.pathname.toLowerCase() === Router.NOT_FOUND_PAGE;
    });
    page404?.callback();
  }
}
