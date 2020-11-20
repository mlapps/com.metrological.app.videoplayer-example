import { Lightning, VideoPlayer } from '@lightningjs/sdk'
import Logger from '@/components/Logger'
import VideoUi from '@/components/VideoUi'
import ErrorScreen from '@/components/ErrorScreen.js'
import { videos } from '@/lib/helpers'

const bgColor = 0xff444444

export default class Debug extends Lightning.Component {
  static _template() {
    return {
      w: 1920,
      h: 1080,
      color: bgColor,
      rect: true,
      ErrorScreen: {
        type: ErrorScreen,
        alpha: 0,
      },
      Logger: {
        type: Logger,
      },
      VideoUi: {
        mountX: 0.5,
        x: 960,
        y: 830,
        type: VideoUi,
        buttons: [
          {
            ref: 'PlayPause',
            icon: 'play',
            action: '$playPause',
          },
        ],
      },
    }
  }

  _init() {
    this._index = 0
    this._videoIndex = 0
    this.tag('Logger').log('Debug initialized')
  }

  _handleLeft() {
    if (this._index > 0) {
      this._index--
    } else {
      return false
    }
  }

  _handleRight() {
    this._index = Math.min(this.tag('Ui.Buttons').children.length - 1, this._index + 1)
  }

  _active() {
    // Set this object to receive VideoPlayer events
    VideoPlayer.consumer(this)
  }

  _inactive() {
    // Cleanup player and ui
    VideoPlayer.clear()
    this.patch({
      color: bgColor,
      ErrorScreen: {
        alpha: 0,
      },
    })
  }

  _getFocused() {
    return this.tag('VideoUi.Buttons').children[this._index]
  }

  // Button actions
  $playPause(next = false) {
    // If next is true, clear VideoPlayer (which also sets src to null)
    next === true && VideoPlayer.clear()
    if (!VideoPlayer.src || VideoPlayer.src === 'error-video-url') {
      // Player first or second video of the videos list, with a chance of 33% to show error screen
      this._videoIndex = (this._videoIndex + 1) % 2
      const nextVideo = Math.random() > 0.66 ? 'error-video-url' : videos[this._videoIndex]
      VideoPlayer.open(nextVideo)
    } else {
      VideoPlayer.playPause()
    }
  }

  // Hooks for VideoPlayer events
  $videoPlayerPlaying() {
    this.patch({
      smooth: {
        color: [0x00000000],
      },
      ErrorScreen: {
        smooth: {
          alpha: [0],
        },
      },
    })
    this.playing = true
  }

  $videoPlayerPause() {}

  $videoPlayerAbort() {
    this.patch({
      smooth: {
        color: [bgColor],
      },
    })
  }

  $videoPlayerEnded() {
    // When current video ends, open next video
    this.$playPause(true)
  }

  $videoPlayerTimeUpdate() {}

  $videoPlayerLoadedMetadata() {}

  $videoPlayerError() {
    this.patch({
      ErrorScreen: {
        smooth: {
          alpha: [1],
        },
      },
    })
  }
}
