import { Utils, Router } from '@lightningjs/sdk'
import Menu from './widgets/Menu'
import routes from './routes'

export default class App extends Router.App {
  static getFonts() {
    return [{ family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') }]
  }

  static _template() {
    return {
      ...super._template(),
      Widgets: {
        Menu: {
          type: Menu,
          zIndex: 99,
        },
      },
    }
  }

  // when App instance is initialized we call the routes
  // this will setup all pages and attach them to there route
  _setup() {
    Router.startRouter(routes)
  }

  _init() {
    console.log(Router.getActivePage())
    console.log(Router.getActiveWidget())
    console.log(Router.getActiveRoute())
    console.log(Router.getActiveHash())
  }

  _handleLeft() {
    Router.focusWidget('menu')
  }
}
