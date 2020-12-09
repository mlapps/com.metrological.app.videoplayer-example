import { Lightning } from 'wpe-lightning-sdk'

export default class Logger extends Lightning.Component {
  static _template() {
    return {
      color: 0xcc000000,
      w: 1920,
      h: 400,
      mountY: 1,
      y: 1080,
      rect: true,
      Logs: {
        x: 70,
        flex: { direction: 'column' },
      },
    }
  }

  _init() {
    this.logs = []

    document
      .getElementsByTagName('video')[0]
      .addEventListener('abort', this.playerUpdated.bind(this))
    // document
    //   .getElementsByTagName('video')[0]
    //   .addEventListener('canplay', this.playerUpdated.bind(this))
    // document
    //   .getElementsByTagName('video')[0]
    //   .addEventListener('canplaythrough', this.playerUpdated.bind(this))
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
    // document
    //   .getElementsByTagName('video')[0]
    //   .addEventListener('playing', this.playerUpdated.bind(this))
    //document.getElementsByTagName('video')[0].addEventListener('progress',this.playerUpdated.bind(this))
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
    //document.getElementsByTagName('video')[0].addEventListener('timeupdate',this.playerUpdated.bind(this))
    document
      .getElementsByTagName('video')[0]
      .addEventListener('volumechange', this.playerUpdated.bind(this))
    // document
    //   .getElementsByTagName('video')[0]
    //   .addEventListener('waiting', this.playerUpdated.bind(this))
  }
  playerUpdated(log) {
    if (this.logs.length < 15) {
      this.logs.unshift({
        text: { text: log.timeStamp + '-' + log.type, fontSize: 20 },
        color: 0xff00dd00,
      })
    } else {
      let poppedItem = this.logs.pop()
      poppedItem.text.text = log.timeStamp + '-' + log.type
      this.logs.unshift(poppedItem)
    }
    this.tag('Logs').children = this.logs
  }
  log(msg) {
    this.playerUpdated({ timeStamp: 'custom', type: msg })
  }
}
