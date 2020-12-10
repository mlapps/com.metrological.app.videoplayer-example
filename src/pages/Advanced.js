import { Lightning, VideoPlayer } from '@lightningjs/sdk'
import VideoUi from '@/components/VideoUi'
import ErrorScreen from '@/components/ErrorScreen'
import { videos } from '@/lib/helpers'

const bgColor = 0xff444444
const interfaceTimeout = 5000

export default class Advanced extends Lightning.Component {
  static _template() {
    return {
      w: 1920,
      h: 1080,
      rect: true,
      color: bgColor,
      Text: {
        x: w => w - 20,
        y: 20,
        mountX: 1,
        text: {
          text: 'Advanced example',
          textColor: 0xffffffff,
        },
      },
      ErrorScreen: {
        type: ErrorScreen,
        alpha: 0,
      },
      Ui: {
        mountX: 0.5,
        x: w => w / 2,
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
            icon: 'stop',
            action: '$stop',
          },
          {
            icon: 'ffwd',
            action: '$forward',
          },
          {
            ref: 'Mute',
            icon: 'unmuted',
            action: '$toggleMute',
          },
          {
            ref: 'Visible',
            icon: 'visible',
            action: '$showHide',
          },
        ],
        rightButtons: [
          {
            ref: 'Resize',
            icon: 'shrink',
            action: '$toggleResize',
          },
        ],
      },
    }
  }

  _init() {
    this._videoIndex = 0
    this.videos = []
    // Initially video control interface is visible
    this._interfaceVisible = true
    // This variable will store timeout id for the interface hide functionality
    this._timeout = null
    this._setInterfaceTimeout()
  }

  itemSelected(index) {
    this._videoIndex = index
    VideoPlayer.clear()
    this.$playPause()
  }

  _toggleInterface(visible) {
    this.patch({
      Ui: {
        smooth: {
          y: [visible ? 790 : 840],
          alpha: [visible ? 1 : 0],
        },
      },
    })
    this.tag('Ui')
      .transition('y')
      .on('finish', () => {
        this._interfaceVisible = visible
      })
    if (visible) {
      this._setInterfaceTimeout()
    }
  }

  _setInterfaceTimeout() {
    // Clear timeout if it already exists
    if (this._timeout) {
      clearTimeout(this._timeout)
    }
    this._timeout = setTimeout(() => {
      this._toggleInterface(false)
    }, interfaceTimeout)
  }

  _active() {
    // Show video interface
    this._toggleInterface(true)
    // Set this object to receive VideoPlayer events
    VideoPlayer.consumer(this)
  }

  _inactive() {
    // Cleanup player and ui
    VideoPlayer.clear()
    this.patch({
      color: bgColor,
      Text: {
        alpha: 1,
      },
      ErrorScreen: {
        alpha: 0,
      },
    })
    this.tag('Ui').playing = false
  }

  _focus() {
    // Show video interface
    this._toggleInterface(true)
  }

  // Capture every key and toggle interface. If it is visible, pass event to event handlers
  _captureKey() {
    this._toggleInterface(true)
    return !this._interfaceVisible
  }

  _getFocused() {
    return this.tag('Ui')
  }

  randomVideo() {
    if (!this.videos.length) {
      this.videos = [...videos]
    }

    return this.videos.splice(Math.round(Math.random() * (this.videos.length - 1)), 1).pop()
  }

  // Button actions
  $playPause(next = false) {
    // If next is true, clear VideoPlayer (which also sets src to null)
    next === true && VideoPlayer.clear()
    if (!VideoPlayer.src) {
      VideoPlayer.open(this.randomVideo())
    } else {
      VideoPlayer.playPause()
    }
  }

  $stop() {
    VideoPlayer.clear()
  }

  $rewind() {
    VideoPlayer.skip(-10)
  }

  $forward() {
    VideoPlayer.skip(10)
  }

  $toggleMute() {
    VideoPlayer.mute(!VideoPlayer.muted)
  }

  $toggleResize() {
    let resizeIcon = 'unshrink'
    if (VideoPlayer.top === 0) {
      VideoPlayer.area(100, 1820, 640, 860)
    } else {
      VideoPlayer.area()
      resizeIcon = 'shrink'
    }
    this.tag('Ui.Buttons.Resize').icon = resizeIcon
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

  // Hooks for VideoPlayer events
  $videoPlayerPlaying() {
    this.patch({
      smooth: {
        color: [0x00000000],
      },
      Text: {
        smooth: {
          alpha: [0],
        },
      },
      ErrorScreen: {
        smooth: {
          alpha: [0],
        },
      },
    })
    this.tag('Ui').playing = true
    this.tag('Ui').visible = !VideoPlayer.visible
  }

  $videoPlayerPause() {
    this.tag('Ui').playing = false
  }

  $videoPlayerVolumeChange() {
    this.tag('Ui').muted = VideoPlayer.muted
  }

  $videoPlayerAbort() {
    this.patch({
      smooth: {
        color: [bgColor],
      },
      Text: {
        smooth: {
          alpha: [1],
        },
      },
    })
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

  $videoPlayerError() {
    this.patch({
      ErrorScreen: {
        smooth: {
          alpha: [1],
        },
      },
      Text: {
        smooth: {
          alpha: [0],
        },
      },
    })
  }
}
