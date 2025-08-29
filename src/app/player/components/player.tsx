import Track from '@/components/track/track'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Track as TrackType } from '@/db/schema'
import { makeArtworkUrl, makeMusicUrl } from '@/lib/utils'
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { playerStore } from '../store'

export default function Player() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<TrackType | undefined>(
    undefined
  )
  const [queue, setQueue] = useState<TrackType[]>([])
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressBarRef = useRef<HTMLInputElement>(null)
  const [currentTime, setCurrentTime] = useState(0) // New state for current time

  useEffect(() => {
    const unsub = playerStore.subscribe(
      ({ currentVal: { currentTrack, queue } }) => {
        if (audioRef.current?.src) console.log('alrd contains some track')
        setCurrentTrack(currentTrack)
        setQueue(queue)
        console.log('new path - ', currentTrack?.path)
      }
    )
    return () => unsub()
  }, [audioRef.current])

  function onLoadedMetadata() {
    const seconds = audioRef.current?.duration
    if (seconds !== undefined) {
      if (progressBarRef.current) {
        progressBarRef.current.max = seconds.toString()
      }
    }
  }
  function handleSliderChange() {
    // console.log(progressBarRef.current?.value)
    if (audioRef.current && progressBarRef.current) {
      const newTime = Number(progressBarRef.current.value)
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  // New function to update the slider's value as the audio plays
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
  }
  function handleSkipForward() {
    console.log('Skipping forward')
    if (audioRef.current && queue[0]?.path) {
      const nextTrackFromQueue = queue[0]
      setCurrentTrack(nextTrackFromQueue)
      setQueue((prevQueue) => prevQueue.splice(0, 1))
    }
  }

  return (
    <Card>
      {currentTrack && (
        <>
          <img className="w-40" src={makeArtworkUrl(currentTrack.path)} />
          <div>
            <h1 className="text-center">{currentTrack.title}</h1>
            <h2 className="text-center">{currentTrack.artist}</h2>
          </div>
          <audio
            ref={audioRef}
            src={makeMusicUrl(currentTrack.path)}
            autoPlay
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
            onLoadedMetadata={onLoadedMetadata}
            onTimeUpdate={handleTimeUpdate} // Added this event handler
          ></audio>
          <div className="flex w-full flex-col items-center justify-center gap-5">
            <input
              className="w-[80%] bg-gray-300"
              ref={progressBarRef}
              type="range"
              max={currentTrack.durationInMs! / 1000}
              defaultValue="0"
              value={currentTime} // Changed from defaultValue to value
              onChange={handleSliderChange}
            />
            <div className="flex flex-row gap-4">
              <Button variant={'outline'} className="w-min cursor-pointer">
                <SkipBack />
              </Button>
              <Button
                variant={'outline'}
                className="w-min cursor-pointer"
                onClick={() => {
                  if (isPlaying) handlePause()
                  else handlePlay()
                }}
              >
                {isPlaying ? <Pause /> : <Play />}
              </Button>
              <Button
                variant={'outline'}
                className="w-min cursor-pointer"
                onClick={handleSkipForward}
              >
                <SkipForward />
              </Button>
            </div>
          </div>
          <div>
            {queue.map((queueTrack) => {
              return <Track track={queueTrack} key={`queue-${queueTrack.id}`} />
            })}
          </div>
        </>
      )}
    </Card>
  )
}
