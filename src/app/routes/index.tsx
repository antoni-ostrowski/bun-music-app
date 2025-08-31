import TrackTable from '@/components/track-table/track-table'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useTRPC } from '../trpc/context'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery({
    ...trpc.track.listAllTracks.queryOptions(),
    placeholderData: keepPreviousData,
  })
  if (isLoading) {
    return <div> LOADING</div>
  }
  return (
    <div>
      <h1>Hello page</h1>
      {data && <TrackTable tracks={data} />}
    </div>
  )
}
