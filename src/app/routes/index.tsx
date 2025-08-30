import TrackTable from '@/components/track-table/track-table'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useTRPC } from '../trpc/context'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const trpc = useTRPC()
  const { data } = useQuery(trpc.track.listAllTracks.queryOptions())
  return (
    <div>
      {/*{data?.map((track) => {
        return <Track key={track.id} track={track} />
      })}*/}
      {data && <TrackTable tracks={data} />}
    </div>
  )
}
