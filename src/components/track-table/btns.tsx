import { playerStore } from '@/app/player/store'
import type { TrackType } from '@/db/schema'
import { useStore } from '@tanstack/react-store'
import { ListEnd, ListStart, Play } from 'lucide-react'
import { Button } from '../ui/button'

export function Btns({ track }: { track: TrackType }) {
  const { isPlaying, currentTrack } = useStore(playerStore)
  return (
    <div className="flex flex-row gap-2">
      {currentTrack?.id === track.id && <>{isPlaying ? 'Playing' : 'Paused'}</>}
      <Button
        variant={'outline'}
        onClick={() => {
          playerStore.setState({
            ...playerStore.state,
            currentTrack: createQueueTrack(track),
          })
        }}
      >
        <Play />
      </Button>
      <Button
        variant={'outline'}
        onClick={() => {
          playerStore.setState({
            ...playerStore.state,
            queue: [...playerStore.state.queue, createQueueTrack(track)],
          })
        }}
      >
        <ListEnd />
      </Button>
      <Button
        variant={'outline'}
        onClick={() => {
          playerStore.setState({
            ...playerStore.state,
            queue: [createQueueTrack(track), ...playerStore.state.queue],
          })
        }}
      >
        <ListStart />
      </Button>
      {/*<Button variant={'outline'}>
        <Star />
      </Button>*/}
    </div>
  )
}
function createQueueTrack(track: TrackType) {
  return {
    ...track,
    queue_id: crypto.randomUUID(),
  }
}
