import { Lightning, Router } from '@lightningjs/sdk'
import MenuItem from '@/components/MenuItem'

const menuItems = [
  { label: 'Simple', route: 'simple' },
  { label: 'Advanced', route: 'advanced' },
  { label: 'Complete', route: 'complete' },
]

export default class Menu extends Lightning.Component {
  static _template() {
    return {
      x: -210,
      w: 280,
      h: 1080,
      rect: true,
      color: 0x44000000,
      Focus: {
        y: 80,
        h: 60,
        mountY: 0.5,
        w: w => w,
        rect: true,
        color: 0x00ffffff,
      },
      Items: {
        x: 30,
        y: 80,
        flex: {
          direction: 'column',
        },
      },
      MenuIcon: {
        y: 10,
        x: w => w - 10,
        mountX: 1,
        w: 50,
        h: 50,
        rect: true,
        color: 0x44ffffff,
        shader: {
          type: Lightning.shaders.RoundedRectangle,
          radius: 5,
        },
        Line1: {
          w: w => w - 15,
          x: 7.5,
          y: 12,
          h: 2,
          mountY: 0.5,
          rect: true,
          color: 0xffffffff,
        },
        Line2: {
          w: w => w - 15,
          x: 7.5,
          y: h => h / 2,
          mountY: 0.5,
          h: 2,
          rect: true,
          color: 0xffffffff,
        },
        Line3: {
          w: w => w - 15,
          x: 7.5,
          y: h => h - 12,
          h: 2,
          mountY: 0.5,
          rect: true,
          color: 0xffffffff,
        },
      },
    }
  }

  get activeItem() {
    return this.tag('Items').children[this._index]
  }

  _init() {
    this._index = 0
    this._activeIndex = 0
    this.tag('Items').children = menuItems.map(item => {
      return { type: MenuItem, item }
    })
  }

  _firstActive() {
    const route = Router.getActiveRoute() || menuItems[0].route
    const routeIndex = menuItems.findIndex(menuItem => menuItem.route === route)
    this.tag('Items').children[this._index].on('txLoaded', () => {
      this._activeIndex = routeIndex
      this._setActiveItem(routeIndex, true)
    })
  }

  _handleUp() {
    if (this._index > 0) {
      this._setActiveItem(this._index - 1)
    }
  }

  _handleDown() {
    if (this._index < this.tag('Items').children.length - 1) {
      this._setActiveItem(this._index + 1)
    }
  }

  _handleRight() {
    Router.restoreFocus()
  }

  _handleEnter() {
    this._activeIndex = this._index
    Router.navigate(this.activeItem.route)
    Router.restoreFocus()
  }

  _setActiveItem(index, immediate) {
    this.activeItem.setFocus(false, immediate)
    this._index = index
    this.activeItem.setFocus(true, immediate)
    this.tag('Focus').patch({
      smooth: {
        y: 100 + this.activeItem.finalY,
      },
    })
  }

  _focus() {
    this.setSmooth('x', 0)
    this.tag('Focus').setSmooth('color', 0x33ffffff)
    this.tag('Focus').patch({
      y: 100 + this.activeItem.finalY,
    })
  }

  _unfocus() {
    this.setSmooth('x', -210)
    this.tag('Focus').color = 0x00ffffff
    this._setActiveItem(this._activeIndex)
  }

  _getFocused() {
    return this.activeItem
  }
}
