import { Lightning, VideoPlayer } from '@lightningjs/sdk'
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
