import TrackTable from '@/components/track-table/track-table'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useTRPC } from '../trpc/context'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const trpc = useTRPC()
  const { data } = useQuery({
    ...trpc.track.listAllTracks.queryOptions(),
    placeholderData: keepPreviousData,
  })
  return <div>{data ? <TrackTable tracks={data} /> : <div>Loaidng</div>}</div>
}
