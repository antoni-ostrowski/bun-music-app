import { playerStore } from '@/app/player/store'
import type { tracks } from '@/db/schema'
import { makeArtworkUrl } from '@/lib/utils'
import { Play } from 'lucide-react'
import { Button } from '../ui/button'

export default function Track({
  track,
}: {
  track: typeof tracks.$inferSelect
}) {
  return (
    <div className="flex flex-row gap-5">
      <img className="w-12" src={makeArtworkUrl(track.path)} />
      track - {track.title} from
      <Button
        onClick={() => {
          playerStore.setState({
            ...playerStore.state,
            currentTrack: track,
          })
        }}
      >
        <Play />
      </Button>
      {/*<Button
        onClick={() => {
          playerStore.setState({
            ...playerStore.state,
            queue: [...playerStore.state.queue, track],
          })
        }}
      >
        <ListEnd />
      </Button>*/}
    </div>
  )
}
