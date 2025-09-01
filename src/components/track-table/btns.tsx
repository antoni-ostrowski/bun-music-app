import { playerStore, updatePlayerStore } from '@/app/player/store'
import { trpc } from '@/app/router'
import type { TrackType } from '@/db/schema'
import { useMutation } from '@tanstack/react-query'
import { useStore } from '@tanstack/react-store'
import { ListEnd, ListStart, Play, Star } from 'lucide-react'
import { Button } from '../ui/button'

export function Btns({ track }: { track: TrackType }) {
  const { isPlaying, currentTrack } = useStore(playerStore)
  const { mutate } = useMutation({
    ...trpc.track.starTrack.mutationOptions(),
  })
  return (
    <div className="flex flex-row gap-2">
      {currentTrack?.id === track.id && <>{isPlaying ? 'Playing' : 'Paused'}</>}
      <Button
        variant={'outline'}
        onClick={() => {
          updatePlayerStore('currentTrack', createQueueTrack(track))
          updatePlayerStore('isPlaying', true)
        }}
      >
        <Play />
      </Button>
      <Button
        variant={'outline'}
        onClick={() => {
          updatePlayerStore('queue', [
            ...playerStore.state.queue,
            createQueueTrack(track),
          ])
        }}
      >
        <ListEnd />
      </Button>
      <Button
        variant={'outline'}
        onClick={() => {
          updatePlayerStore('queue', [
            createQueueTrack(track),
            ...playerStore.state.queue,
          ])
        }}
      >
        <ListStart />
      </Button>
      <Star
        className="cursor-pointer"
        onClick={() => mutate({ trackId: track.id })}
        fill={track.starred ? 'yellow' : ''}
        color={track.starred ? 'yellow' : 'white'}
      />
    </div>
  )
}
function createQueueTrack(track: TrackType) {
  return {
    ...track,
    queue_id: crypto.randomUUID(),
  }
}
