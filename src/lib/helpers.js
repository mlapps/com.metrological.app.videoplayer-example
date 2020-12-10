export const formatTime = seconds => {
  if (seconds === Infinity) return '--'
  return (
    ('0' + Math.floor(seconds / 60)).slice(-2) + ':' + ('0' + Math.floor(seconds % 60)).slice(-2)
  )
}

export const videos = [
  'http://video.metrological.com/surfing.mp4',
  'http://video.metrological.com/hot_town.mp4',
  'http://video.metrological.com/fireworks_paris.mp4',
  'http://video.metrological.com/drop.mp4',
  'http://video.metrological.com/iceland.mp4',
  'http://video.metrological.com/stockholm.mp4',
  'http://video.metrological.com/throw-error.mp4',
]
