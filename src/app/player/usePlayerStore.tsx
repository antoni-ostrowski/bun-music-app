import type { TrackType } from '@/db/schema'
import { useEffect } from 'react'
import type { AudioRefType } from './components/player'
import { playerStore } from './store'

export default function usePlayerStore({
  audioRef,
  setCurrentTrack,
  setQueue,
}: {
  audioRef: AudioRefType
  setCurrentTrack: (track: TrackType) => void
  setQueue: (queue: TrackType[]) => void
}) {
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
  return {}
}
