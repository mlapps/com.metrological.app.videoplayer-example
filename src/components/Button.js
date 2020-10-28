import { Lightning, Utils } from '@lightningjs/sdk'

export default class Button extends Lightning.Component {
  static _template() {
    return {
      h: 50,
      w: 50,
      color: 0x80cccccc,
      rect: true,
      Icon: {
        w: 40,
        h: 40,
        x: 5,
        y: 5,
      },
    }
  }

  set index(v) {
    this.x = v * 70
  }

  set icon(v) {
    this.tag('Icon').src = Utils.asset('images/' + v + '.png')
  }

  _handleEnter() {
    this.action && this.fireAncestors(this.action)
  }

  _focus() {
    this.setSmooth('color', 0xbb0078ac)
  }

  _unfocus() {
    this.setSmooth('color', 0x80cccccc)
  }
}
