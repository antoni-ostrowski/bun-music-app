import { playerStore } from '@/app/player/store'
import type { tracks } from '@/db/schema'
import { Button } from '../ui/button'

export default function Track({
  track,
}: {
  track: typeof tracks.$inferSelect
}) {
  return (
    <div className="flex flex-row gap-5">
      <img
        className="w-12"
        src={`http://localhost:3000/artwork/${encodeURIComponent(track.path)}`}
      />
      track - {track.title} from
      <Button
        onClick={() => {
          playerStore.setState({
            filePath: `http://localhost:3000/music/${encodeURIComponent(track.path)}`,
          })
        }}
      >
        set to store
      </Button>
    </div>
  )
}
