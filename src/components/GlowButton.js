import { Lightning, Utils } from '@lightningjs/sdk'

export default class GlowButton extends Lightning.Component {
  static _template() {
    const timingFunction = 'cubic-bezier(.62,.18,.79,1.86)'

    return {
      w: 70,
      h: 70,
      Glow: {
        alpha: 0,
        scale: 0.9,
        w: 140,
        h: 140,
        mount: 0.5,
        x: 35,
        y: 35,
        color: 0xfff51474,
        src: Utils.asset('images/button-glow.png'),
        transitions: {
          scale: { duration: 0.2, timingFunction },
        },
      },
      Background: {
        alpha: 0,
        scale: 0.9,
        colorTop: 0xfff45df4,
        colorBottom: 0xfff51474,
        texture: Lightning.Tools.getRoundRect(70, 70, 35, 0, 0x00ffffff, true, 0xffffffff),
        transitions: {
          scale: { duration: 0.2, timingFunction },
        },
      },
      Icon: {
        mount: 0.5,
        x: 35,
        y: 36,
      },
    }
  }

  set icon(v) {
    this.tag('Icon').src = Utils.asset('images/' + v + '.png')
  }

  set disabled(v) {
    this._disabled = v
    this.patch({
      smooth: {
        alpha: [v ? 0.3 : 1],
      },
    })
  }

  _handleEnter() {
    !this._disabled && this.action && this.fireAncestors(this.action)
  }

  _focus() {
    this.patch({
      Glow: {
        alpha: 1,
        smooth: { scale: 1 },
      },
      Background: {
        alpha: 1,
        smooth: { scale: 1 },
      },
    })
  }

  _unfocus() {
    this.patch({
      Glow: {
        alpha: 0,
        smooth: { scale: 0.9 },
      },
      Background: {
        alpha: 0,
        smooth: { scale: 0.9 },
      },
    })
  }
}
