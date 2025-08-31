import Track from '@/components/track/track'
import { Card } from '@/components/ui/card'
import type { TrackType } from '@/db/schema'
import { makeMusicUrl } from '@/lib/utils'
import { useRef, useState, type RefObject } from 'react'
import usePlayerStore from '../usePlayerStore'
import PlaybackControls from './playback-controls'
import ProgressBar from './progress-bar'
import TrackMetadata from './track-metadata'
import VolumeControls from './volume-controls'

export type AudioRefType = RefObject<HTMLAudioElement | null>
export type ProgressBarRefType = RefObject<HTMLInputElement | null>

export default function Player() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<TrackType | undefined>(
    undefined
  )
  const [queue, setQueue] = useState<TrackType[]>([])
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressBarRef = useRef<HTMLInputElement>(null)
  const [currentTime, setCurrentTime] = useState(0)

  usePlayerStore({
    audioRef,
    setCurrentTrack: (track: TrackType) => {
      setCurrentTrack(track)
    },
    setQueue: (queue: TrackType[]) => {
      setQueue(queue)
    },
  })

  function onLoadedMetadata() {
    const seconds = audioRef.current?.duration
    if (seconds !== undefined) {
      if (progressBarRef.current) {
        progressBarRef.current.max = seconds.toString()
      }
    }
  }

  function handleTimeUpdate() {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  function handlePlay() {
    console.log('Audio playback started.')
    void audioRef.current?.play()
    setIsPlaying(true)
  }
  function handlePause() {
    console.log('Audio playback paused.')
    audioRef.current?.pause()
    setIsPlaying(false)
  }
  function handleEnded() {
    console.log('Audio ended. Time to play the next song!')
    handleSkipForward()
  }
  function handleSkipForward() {
    console.log('Skipping forward')
    if (audioRef.current && queue[0]?.path) {
      const nextTrackFromQueue = queue[0]
      setCurrentTrack(nextTrackFromQueue)
      setQueue((prevQueue) => {
        const nextQueue = prevQueue.shift()
        return nextQueue ? [nextQueue, ...prevQueue] : []
      })
    }
  }

  return (
    <>
      {currentTrack && (
        <Card className="p-5">
          <audio
            ref={audioRef}
            src={makeMusicUrl(currentTrack.path)}
            autoPlay
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
            onLoadedMetadata={onLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
          />
          <TrackMetadata {...{ currentTrack }} />
          <div className="flex w-full flex-col items-center justify-center gap-5">
            <ProgressBar
              {...{
                currentTrack,
                audioRef,
                handlePause,
                handlePlay,
                progressBarRef,
                currentTime,
                setCurrentTime,
              }}
            />

            <VolumeControls audioRef={audioRef} />

            <PlaybackControls
              {...{ isPlaying, handlePause, handlePlay, handleSkipForward }}
            />
          </div>

          {/*here make a MINI table for track in queue, because drag and drop will be nice here too*/}
          <div>
            {queue.map((queueTrack) => {
              return <Track track={queueTrack} key={crypto.randomUUID()} />
            })}
          </div>
        </Card>
      )}
    </>
  )
}
