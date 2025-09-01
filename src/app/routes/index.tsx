import PageTitleWrapper from '@/components/page-title-wrapper'
import TrackTable from '@/components/track-table/track-table'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { trpc } from '../router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading } = useQuery({
    ...trpc.track.listAllTracks.queryOptions(),
  })
  if (isLoading) {
    return <div> LOADING</div>
  }
  return (
    <PageTitleWrapper>
      <div className="flex-1">
        <h1 className="text-4xl">Hello</h1>
        <div className="flex-1">
          <h1>Hello page</h1>

          {data && <TrackTable tracks={data} />}
        </div>
      </div>
    </PageTitleWrapper>
  )
}
