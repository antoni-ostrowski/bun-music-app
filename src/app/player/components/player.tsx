import { Card } from '@/components/ui/card'
import type { Track } from '@/db/schema'
import { makeArtworkUrl, makeMusicUrl } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { playerStore } from '../store'

export default function Player() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<Track | undefined>(undefined)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const unsub = playerStore.subscribe(({ currentVal: { currentTrack } }) => {
      if (audioRef.current?.src) console.log('alrd contains some track')
      setCurrentTrack(currentTrack)
      console.log('new path - ', currentTrack?.path)
    })
    return () => unsub()
  }, [audioRef.current])

  useEffect(() => {
    const audio = audioRef.current

    if (audio) {
      // Define your event handlers
      const handleEnded = () => {
        console.log('Audio ended. Time to play the next song!')
        // Here you would call a function to get and set the next track from your queue.
        // For example: playerStore.actions.playNext();
      }

      const handlePlay = () => {
        console.log('Audio playback started.')
        setIsPlaying(true)
      }

      const handlePause = () => {
        console.log('Audio playback paused.')
        setIsPlaying(false)
      }

      // Attach the event listeners
      audio.addEventListener('ended', handleEnded)
      audio.addEventListener('play', handlePlay)
      audio.addEventListener('pause', handlePause)

      // Cleanup function to remove event listeners
      return () => {
        audio.removeEventListener('ended', handleEnded)
        audio.removeEventListener('play', handlePlay)
        audio.removeEventListener('pause', handlePause)
      }
    }
  }, [audioRef]) // Dependency array: Re-run if the audio element reference changes

  return (
    <Card>
      {currentTrack && (
        <>
          <img className="w-40" src={makeArtworkUrl(currentTrack.path)} />
          <h1>{currentTrack.title}</h1>
          <audio
            ref={audioRef}
            src={makeMusicUrl(currentTrack.path)}
            controls
            autoPlay
          ></audio>
        </>
      )}
    </Card>
  )
}
