import { Card } from '@/components/ui/card'
import { makeMusicUrl } from '@/lib/utils'
import { useStore } from '@tanstack/react-store'
import { useRef, useState, type RefObject } from 'react'
import { playerStore, updatePlayerStore } from '../store'
import PlaybackControls from './playback-controls'
import ProgressBar from './progress-bar'
import TrackMetadata from './track-metadata'
import VolumeControls from './volume-controls'

export type AudioRefType = RefObject<HTMLAudioElement | null>
export type ProgressBarRefType = RefObject<HTMLInputElement | null>

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressBarRef = useRef<HTMLInputElement>(null)
  const [currentTime, setCurrentTime] = useState(0)

  const { queue, currentTrack, isPlaying } = useStore(playerStore)

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
    updatePlayerStore('isPlaying', true)
  }
  function handlePause() {
    console.log('Audio playback paused.')
    audioRef.current?.pause()
    updatePlayerStore('isPlaying', false)
  }
  function handleEnded() {
    console.log('Audio ended. Time to play the next song!')
    handleSkipForward()
  }
  function handleSkipForward() {
    console.log('Skipping forward')
    const nextTrackFromQueue = queue[0]
    if (audioRef.current && nextTrackFromQueue?.path) {
      updatePlayerStore('currentTrack', nextTrackFromQueue)
      updatePlayerStore('queue', queue.slice(1, queue.length))
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
            // onPlay={handlePlay}
            // onPause={handlePause}
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
              return (
                <div key={`queue-track-${queueTrack.queue_id}`}>
                  <p>{queueTrack.title}</p>
                  <p>{queueTrack.queue_id}</p>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </>
  )
}
