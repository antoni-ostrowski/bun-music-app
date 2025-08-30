import { playerStore } from '@/app/player/store'
import type { Track } from '@/db/schema'
import { ListEnd, ListStart, Play } from 'lucide-react'
import { Button } from '../ui/button'

export function Btns({ track }: { track: Track }) {
  return (
    <div className="flex flex-row gap-2">
      <Button
        variant={'outline'}
        onClick={() => {
          playerStore.setState({
            ...playerStore.state,
            currentTrack: track,
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
            queue: [...playerStore.state.queue, track],
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
            queue: [track, ...playerStore.state.queue],
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
