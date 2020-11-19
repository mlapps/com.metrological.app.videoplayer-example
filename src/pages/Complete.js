import { Lightning, VideoPlayer, Utils } from '@lightningjs/sdk'
import VideoUi from '../components/VideoUi.js'

const bgColor = 0xff111111

const videos = [
  'http://video.metrological.com/surfing.mp4',
  'http://video.metrological.com/hot_town.mp4',
  'http://video.metrological.com/fireworks_paris.mp4',
  'http://video.metrological.com/drop.mp4',
  'http://video.metrological.com/iceland.mp4',
  'http://video.metrological.com/stockholm.mp4',
]

export default class Advanced extends Lightning.Component {
  static getFonts() {
    return [
      { family: 'Light', url: Utils.asset('fonts/Roboto-Light.ttf') },
      { family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') },
    ]
  }

  static _template() {
    return {
      w: w => w,
      h: h => h,
      rect: true,
      color: bgColor,
      Ui: {
        mountX: 0.5,
        x: 960,
        y: 830,
        type: VideoUi,
        buttons: [
          {
            icon: 'rewind',
            action: '$rewind',
          },
          {
            ref: 'PlayPause',
            icon: 'play',
            action: '$playPause',
          },
          {
            icon: 'ffwd',
            action: '$forward',
          },
        ],
      },
    }
  }

  _init() {
    VideoPlayer.consumer(this)
    this.videos = []
  }

  randomVideo() {
    if (!this.videos.length) {
      this.videos = [...videos]
    }
    return this.videos.splice(Math.round(Math.random() * (this.videos.length - 1)), 1).pop()
  }

  _getFocused() {
    return this.tag('Ui')
  }

  // Actions
  $playPause(next = false) {
    next === true && VideoPlayer.clear()
    if (!VideoPlayer.src) {
      VideoPlayer.open(this.randomVideo())
    } else {
      VideoPlayer.playPause()
    }
  }

  $stop() {
    VideoPlayer.clear()
    this.color = bgColor
  }

  $rewind() {
    VideoPlayer.skip(-10)
  }

  $forward() {
    VideoPlayer.skip(10)
  }

  $toggleMute() {
    VideoPlayer.mute(!!!VideoPlayer.muted)
  }

  $toggleResize() {
    if (VideoPlayer.top === 0) {
      VideoPlayer.position(158, 210)
      VideoPlayer.size(1500, 844)
      this.tag('Ui').size = 'small'
    } else {
      VideoPlayer.area()
      this.tag('Ui').size = 'full'
    }
  }

  $toggleLoop() {
    VideoPlayer.loop(!!!VideoPlayer.looped)
    this.tag('Ui').loop = VideoPlayer.looped
  }

  $reload() {
    VideoPlayer.reload()
  }

  $showHide() {
    const visible = VideoPlayer.visible
    if (visible === true) {
      this.setSmooth('color', bgColor)
      VideoPlayer.hide()
    } else {
      this.setSmooth('color', 0x00000000)
      VideoPlayer.show()
    }
    this.tag('Ui').visible = visible
  }

  // hooks for VideoPlayer events
  $videoPlayerPlaying() {
    this.setSmooth('color', 0x00000000)
    this.tag('Ui').playing = true
  }

  $videoPlayerPause() {
    this.tag('Ui').playing = false
  }

  $videoPlayerVolumeChange() {
    this.tag('Ui').muted = VideoPlayer.muted
  }

  $videoPlayerAbort() {
    this.setSmooth('color', bgColor)
    this.tag('Ui').playing = false
    this.tag('Ui').duration = 0
    this.tag('Ui').currentTime = 0
  }

  $videoPlayerEnded() {
    this.$playPause(true)
  }

  $videoPlayerTimeUpdate() {
    this.tag('Ui').currentTime = VideoPlayer.currentTime
  }

  $videoPlayerLoadedMetadata() {
    this.tag('Ui').duration = VideoPlayer.duration
  }
}
