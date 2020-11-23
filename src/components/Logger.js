import { Lightning } from '@lightningjs/sdk'
import { formatTime } from '@/lib/helpers'

export default class Logger extends Lightning.Component {
  static _template() {
    return {
      colorTop: 0xcc000000,
      colorBottom: 0x33000000,
      w: 1920,
      h: 460,
      mountY: 1,
      y: 1080,
      rect: true,
      BorderTop: {
        color: 0x88ffffff,
        rect: true,
        w: w => w,
        h: 1,
      },
      Logs: {
        x: 20,
        y: 10,
        flex: { direction: 'column' },
      },
    }
  }
  _init() {
    this.logs = []

    document
      .getElementsByTagName('video')[0]
      .addEventListener('abort', this.playerUpdated.bind(this))
    document
      .getElementsByTagName('video')[0]
      .addEventListener('canplay', this.playerUpdated.bind(this))
    document
      .getElementsByTagName('video')[0]
      .addEventListener('canplaythrough', this.playerUpdated.bind(this))
    document
      .getElementsByTagName('video')[0]
      .addEventListener('durationchange', this.playerUpdated.bind(this))
    document
      .getElementsByTagName('video')[0]
      .addEventListener('emptied', this.playerUpdated.bind(this))
    document
      .getElementsByTagName('video')[0]
      .addEventListener('ended', this.playerUpdated.bind(this))
    document
      .getElementsByTagName('video')[0]
      .addEventListener('error', this.playerUpdated.bind(this))
    document
      .getElementsByTagName('video')[0]
      .addEventListener('loadeddata', this.playerUpdated.bind(this))
    document
      .getElementsByTagName('video')[0]
      .addEventListener('loadedmetadata', this.playerUpdated.bind(this))
    document
      .getElementsByTagName('video')[0]
      .addEventListener('loadstart', this.playerUpdated.bind(this))
    document
      .getElementsByTagName('video')[0]
      .addEventListener('pause', this.playerUpdated.bind(this))
    document
      .getElementsByTagName('video')[0]
      .addEventListener('play', this.playerUpdated.bind(this))
    document
      .getElementsByTagName('video')[0]
      .addEventListener('playing', this.playerUpdated.bind(this))
    document
      .getElementsByTagName('video')[0]
      .addEventListener('progress', this.playerUpdated.bind(this))
    document
      .getElementsByTagName('video')[0]
      .addEventListener('ratechange', this.playerUpdated.bind(this))
    document
      .getElementsByTagName('video')[0]
      .addEventListener('seeked', this.playerUpdated.bind(this))
    document
      .getElementsByTagName('video')[0]
      .addEventListener('seeking', this.playerUpdated.bind(this))
    document
      .getElementsByTagName('video')[0]
      .addEventListener('stalled', this.playerUpdated.bind(this))
    document
      .getElementsByTagName('video')[0]
      .addEventListener('suspend', this.playerUpdated.bind(this))
    document
      .getElementsByTagName('video')[0]
      .addEventListener('timeupdate', this.playerUpdated.bind(this))
    document
      .getElementsByTagName('video')[0]
      .addEventListener('volumechange', this.playerUpdated.bind(this))
    document
      .getElementsByTagName('video')[0]
      .addEventListener('waiting', this.playerUpdated.bind(this))
  }
  playerUpdated(log) {
    if (this.logs.length >= 15) {
      this.logs.pop()
    }
    this.logs.unshift({
      flex: {
        direction: 'row',
      },
      Timestamp: {
        text: {
          text: `[ ${formatTime(parseInt(log.timeStamp / 1000) % (60 * 60))}:${(
            parseInt(log.timeStamp % 1000) + '000'
          ).slice(0, 4)} ]`,
          fontSize: 20,
        },
        color: 0xff66dd66,
      },
      Message: {
        text: {
          text: ` ${log.type}`,
          fontSize: 20,
        },
        color: 0xffffffff,
      },
    })
    this.logs.length > 12 && (this.logs[12].alpha = 0.6)
    this.logs.length > 13 && (this.logs[13].alpha = 0.3)
    this.logs.length > 14 && (this.logs[14].alpha = 0.1)
    this.tag('Logs').children = this.logs
  }
  clear() {
    this.logs = []
    this.tag('Logs').children = this.logs
  }
  log(msg) {
    this.playerUpdated({
      timeStamp: Date.now(),
      type: msg,
    })
  }
}
