import { Lightning } from '@lightningjs/sdk'
import Button from './Button'
import { formatTime, buttons } from '../helpers.js'

export default class VideoUi extends Lightning.Component {
  static _template() {
    return {
      w: w => w - 160 * 2,
      rect: true,
      Buttons: {},
      ProgressBar: {
        y: 70,
        h: 50,
        w: w => w - 220,
        rect: true,
        color: 0x80cccccc,
        InnerProgress: {
          rect: true,
          color: 0xbb0078ac,
          x: 8,
          w: 0,
          y: h => (h - 16) / 2,
          h: 16,
        },
      },
      Timer: {
        color: 0x80cccccc,
        x: w => w - 220 + 20,
        y: 70,
        w: 180,
        rect: true,
        h: 50,
        Text: {
          x: 15,
          y: 8,
          text: {
            textColor: 0xff000000,
            fontSize: 26,
          },
        },
      },
    }
  }

  set duration(v) {
    this._duration = v
  }

  get duration() {
    return this._duration || 0.0001
  }

  set currentTime(v) {
    const ratio = Math.round((v / this.duration) * 1000) / 1000
    this.tag('InnerProgress').setSmooth('w', (this.tag('ProgressBar').renderWidth - 16) * ratio)
    this.tag('Timer.Text').text = [formatTime(v || 0), formatTime(this.duration || 0)].join(' / ')
  }

  set playing(v) {
    this.tag('PlayPause').icon = v === true ? 'pause' : 'play'
  }

  set muted(v) {
    this.tag('Mute').icon = v === true ? 'muted' : 'unmuted'
  }

  set size(v) {
    this.tag('Resize').icon = v === 'small' ? 'unshrink' : 'shrink'
  }

  set loop(v) {
    this.tag('Loop').icon = v === true ? 'loop' : 'unloop'
  }

  set visible(v) {
    this.tag('Visible').icon = v === true ? 'hidden' : 'visible'
  }

  _init() {
    this._index = 0
    this.tag('Buttons').children = buttons.map((button, index) => {
      return this.stage.c({
        type: Button,
        icon: button.icon,
        action: button.action,
        ref: button.ref || 'Button' + index,
        index,
      })
    })
  }

  _handleLeft() {
    this._index = Math.max(0, this._index - 1)
  }

  _handleRight() {
    this._index = Math.min(this.tag('Buttons').children.length - 1, this._index + 1)
  }

  _getFocused() {
    return this.tag('Buttons').children[this._index]
  }
}
