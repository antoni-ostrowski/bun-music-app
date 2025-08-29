import { playerStore } from '@/app/player/store'
import type { tracks } from '@/db/schema'
import { makeArtworkUrl, makeMusicUrl } from '@/lib/utils'
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
            trackUrl: makeMusicUrl(track.path),
            currentTrack: track,
          })
        }}
      >
        set to store
      </Button>
    </div>
  )
}
