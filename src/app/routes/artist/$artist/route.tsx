import { trpc } from '@/app/router'
import FullScreenError from '@/components/full-screen-error'
import FullScreenLoading from '@/components/full-screen-loading'
import PageTitleWrapper from '@/components/page-title-wrapper'
import TrackTable from '@/components/track-table/track-table'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/artist/$artist')({
  component: RouteComponent,
})

function RouteComponent() {
  const { artist } = useParams({ from: '/artist/$artist' })
  const { data, isError, isLoading, error } = useQuery(
    trpc.track.getTracksFromArtist.queryOptions({ artist })
  )
  console.log('data - ', data)

  if (isError)
    return (
      <FullScreenError
        errorDetail={error.message}
        errorMessage="Failed to get tracks"
      />
    )
  if (isLoading) return <FullScreenLoading loadingMessage="Loading tracks" />
  if (!data) return <FullScreenError errorMessage="No tracks found" />

  return (
    <PageTitleWrapper title={`${artist} - Tracks`}>
      <>
        <TrackTable tracks={data} />
      </>
    </PageTitleWrapper>
  )
}
