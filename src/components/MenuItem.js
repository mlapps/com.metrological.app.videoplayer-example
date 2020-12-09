import { Lightning } from '@lightningjs/sdk'

export default class MenuItem extends Lightning.Component {
  static _template() {
    return {
      h: 60,
      color: 0xff666666,
      text: {
        fontSize: 30,
      },
    }
  }

  set item(v) {
    this._item = v

    this.patch({
      text: {
        text: this._item.label,
      },
    })
  }

  get item() {
    return this._item
  }

  get route() {
    return this._item.route
  }

  setFocus(state, immediate) {
    this.setSmooth('color', state ? 0xffffffff : 0xff666666, { duration: immediate ? 0 : 0.2 })
  }
}
