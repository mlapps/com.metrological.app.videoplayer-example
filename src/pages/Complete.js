import { Lightning, VideoPlayer, Utils, Registry } from '@lightningjs/sdk'
import VideoUi from '@/components/VideoUi'
import Playlist from '@/components/Playlist'
import ErrorScreen from '@/components/ErrorScreen'
import { videos } from '@/lib/helpers'

const bgColor = 0xff111111
const interfaceTimeout = 5000

export default class Advanced extends Lightning.Component {
  static getFonts() {
    return [
      { family: 'Light', url: Utils.asset('fonts/Roboto-Light.ttf') },
      { family: 'Regular', url: Utils.asset('fonts/Roboto-Regular.ttf') },
    ]
  }

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
          text: 'Complete example',
          textColor: 0xffffffff,
        },
      },
      ErrorScreen: {
        type: ErrorScreen,
        alpha: 0,
      },
      Playlist: {
        type: Playlist,
        x: 60,
        y: 680,
        signals: {
          itemSelected: true,
        },
      },
      Ui: {
        mountX: 0.5,
        x: w => w / 2,
        y: 830,
        type: VideoUi,
        buttons: [
          {
            ref: 'Previous',
            icon: 'previous',
            action: '$previous',
            disabled: true,
          },
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
            ref: 'Next',
            icon: 'next',
            action: '$next',
          },
          {
            ref: 'Mute',
            icon: 'unmuted',
            action: '$toggleMute',
          },
          {
            ref: 'Loop',
            icon: 'unloop',
            action: '$toggleLoop',
          },
          {
            icon: 'reload',
            action: '$reload',
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

  _toggleInterface(visible) {
    this.patch({
      Ui: {
        smooth: {
          y: [visible ? 790 : 840],
          alpha: [visible ? 1 : 0],
        },
      },
      Playlist: {
        smooth: {
          y: [visible ? 680 : 730],
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
      Registry.clearTimeout(this._timeout)
    }
    this._timeout = Registry.setTimeout(() => {
      this._toggleInterface(false)
    }, interfaceTimeout)
  }

  _init() {
    this._index = 0
    this._videoIndex = 0
    this.videos = [...videos]
    this.tag('Playlist').videos = this.videos
    // Initially video control interface is visible
    this._interfaceVisible = true
    // This variable will store timeout id for the interface hide functionality
    this._timeout = null
    this._setInterfaceTimeout()
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
    this.tag('Ui.ProgressBar').duration = 0
    this.tag('Ui.ProgressBar').currentTime = 0
    this.tag('Playlist').selected = null
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
    return this._index === 0 ? this.tag('Playlist') : this.tag('Ui')
  }

  _handleUp() {
    if (this._index > 0) {
      this._index--
    } else {
      return false
    }
  }

  _handleDown() {
    if (this._index < 2) {
      this._index++
    }
  }

  itemSelected(index) {
    this._videoIndex = index
    this.$playPause(true)
  }

  // Actions
  $playPause(next = false) {
    next === true && VideoPlayer.clear()
    if (!VideoPlayer.src) {
      if (this.videos[this._videoIndex]) {
        this.tag('Playlist').selected = this._videoIndex
        VideoPlayer.open(this.videos[this._videoIndex])
      }
    } else {
      VideoPlayer.playPause()
    }
  }

  $stop() {
    VideoPlayer.clear()
    this.tag('Playlist').selected = null
    this.color = bgColor
  }

  $previous() {
    if (this._videoIndex > 0) {
      this._videoIndex--
      this.$playPause(true)
    }
  }

  $next() {
    if (this._videoIndex < videos.length - 1) {
      this._videoIndex++
      this.$playPause(true)
    }
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
    this.setSmooth('color', bgColor)
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
    this._videoIndex++
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
