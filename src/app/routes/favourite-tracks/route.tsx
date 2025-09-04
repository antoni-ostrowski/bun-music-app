import { trpc } from '@/app/router'
import FullScreenError from '@/components/full-screen-error'
import FullScreenLoading from '@/components/full-screen-loading'
import PageTitleWrapper, {
  pageTitleIconSize,
} from '@/components/page-title-wrapper'
import TrackTable from '@/components/track-table/track-table'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Star } from 'lucide-react'

export const Route = createFileRoute('/favourite-tracks')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading, isError, error } = useQuery(
    trpc.track.getFavTracks.queryOptions()
  )
  if (isError)
    return (
      <FullScreenError
        errorMessage="Failed to load favourite tracks"
        errorDetail={error.message}
      />
    )
  if (isLoading)
    return <FullScreenLoading loadingMessage="Loading favourite tracks" />

  if (!data) return <FullScreenError errorMessage="No favourite tracks found" />

  return (
    <PageTitleWrapper
      title="Favourite Tracks"
      icon={<Star className={pageTitleIconSize} color="yellow" fill="yellow" />}
    >
      <div>
        <TrackTable tracks={data} />
      </div>
    </PageTitleWrapper>
  )
}
