import { Lightning, Utils } from '@lightningjs/sdk'
import Button from './GlowButton'
import { formatTime } from '@/lib/helpers.js'

export default class VideoUi extends Lightning.Component {
  static _template() {
    return {
      h: 186,
      w: 1500,
      rect: true,
      color: 0xff0a0d26,
      rtt: true,
      shader: { type: Lightning.shaders.RoundedRectangle, radius: 6 },
      alpha: 0.98,
      Buttons: {
        flex: {},
        y: 80,
        mountX: 0.5,
        x: 750,
      },
      RightButtons: {
        flex: {},
        y: 80,
        mountX: 1,
        x: 1482,
      },
      Timer: {
        rect: true,
        colorTop: 0xff111542,
        colorBottom: 0x00111542,
        w: w => w,
        h: 48,
        CurrentTime: {
          mountY: 0.5,
          y: 26,
          x: 18,
          text: { text: '00:00', fontFace: 'Regular', fontSize: 21 },
        },
        TotalTime: {
          mountY: 0.5,
          y: 26,
          mountX: 1,
          x: 1482,
          text: { text: '00:00', fontFace: 'Regular', fontSize: 21 },
        },
      },
      ProgressBar: {
        y: 48,
        h: 4,
        w: w => w,
        rect: true,
        color: 0xffffffff,
        InnerProgress: {
          rect: true,
          color: 0xfff45df4,
          w: 0,
          h: 4,
          Border: {
            y: 3,
            h: 1,
            w: w => w,
            rect: true,
            color: 0xfff51474,
          },
          GlowTop: {
            h: 15,
            w: w => w,
            mountY: 1,
            color: 0x50f51474,
            src: Utils.asset('images/glow.png'),
          },
          GlowBottom: {
            h: 15,
            w: w => w,
            y: 4,
            scaleY: -1,
            color: 0x50f51474,
            src: Utils.asset('images/glow.png'),
          },
          Indicator: {
            mountX: 1,
            x: w => w + 1,
            mountY: 0.5,
            y: 2,
            texture: Lightning.Tools.getRoundRect(6, 14, 2, 0, 0x00ffffff, true, 0xffffffff),
          },
        },
      },
    }
  }

  set duration(v) {
    this._duration = v
    this.tag('TotalTime').text = formatTime(v || 0)
  }

  get duration() {
    return this._duration
  }

  set currentTime(v) {
    const ratio = Math.round((v / this.duration) * 1000) / 1000
    this.tag('InnerProgress').setSmooth('w', (this.tag('ProgressBar').renderWidth - 16) * ratio)
    this.tag('CurrentTime').text = formatTime(v || 0)
  }

  set playing(v) {
    if (this.tag('PlayPause')) {
      this.tag('PlayPause').icon = v === true ? 'pause' : 'play'
    }
  }

  set muted(v) {
    if (this.tag('Mute')) {
      this.tag('Mute').icon = v === true ? 'muted' : 'unmuted'
    }
  }

  set size(v) {
    if (this.tag('Resize')) {
      this.tag('Resize').icon = v === 'small' ? 'unshrink' : 'shrink'
    }
  }

  set loop(v) {
    if (this.tag('Loop')) {
      this.tag('Loop').icon = v === true ? 'loop' : 'unloop'
    }
  }

  set visible(v) {
    if (this.tag('Visible')) {
      this.tag('Visible').icon = v === true ? 'hidden' : 'visible'
    }
  }

  set buttons(v) {
    this._buttons = v
  }

  get buttons() {
    return this._buttons || []
  }

  set previousDisabled(v) {
    this.tag('Previous').disabled = v
  }

  set nextDisabled(v) {
    this.tag('Next').disabled = v
  }

  _firstActive() {
    this._index = 0
    this.tag('Buttons').children = this.buttons.map((button, index) => {
      if (button.ref === 'PlayPause') this._index = index
      return this.stage.c({
        type: Button,
        icon: button.icon,
        action: button.action,
        disabled: button.disabled || false,
        ref: button.ref || 'Button' + index,
      })
    })
    if (this.rightButtons) {
      this.tag('RightButtons').children = this.rightButtons.map((button, index) =>
        this.stage.c({
          type: Button,
          icon: button.icon,
          action: button.action,
          ref: button.ref || 'Button' + index,
        })
      )
    }

    this._setState('Buttons')
  }

  static _states() {
    return [
      class Buttons extends this {
        _getFocused() {
          return this.tag('Buttons').children[this._index]
        }
        _handleLeft() {
          if (this._index > 0) {
            this._index--
          }
        }
        _handleRight() {
          if (this._index < this.tag('Buttons').children.length - 1) {
            this._index++
          } else {
            this._setState('Resize')
          }
        }
      },
      class Resize extends this {
        _getFocused() {
          return this.tag('Resize')
        }
        _handleLeft() {
          this._setState('Buttons')
        }
      },
    ]
  }
}
