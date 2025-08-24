import type { tracks } from '@/db/schema'

export default function Track({
  track,
}: {
  track: typeof tracks.$inferSelect
}) {
  return (
    <div>
      track - {track.title} from - {track.source_url}
      <img
        src={`http://localhost:3000/artwork/${encodeURIComponent(track.path)}`}
      />
    </div>
  )
}
