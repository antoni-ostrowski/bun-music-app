import { trpc } from '@/app/router'
import FullScreenError from '@/components/full-screen-error'
import FullScreenLoading from '@/components/full-screen-loading'
import PageTitleWrapper from '@/components/page-title-wrapper'
import PlaylistGridItem from '@/components/playlist/playlist-grid-item'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/playlist/all')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading, isError, error } = useQuery(
    trpc.playlist.listPlaylists.queryOptions()
  )
  if (isError)
    return (
      <FullScreenError
        errorMessage={'Failed to load playlists'}
        errorDetail={error.message}
      />
    )
  if (isLoading) return <FullScreenLoading loadingMessage="Loading playlists" />
  if (!data) return <FullScreenError errorMessage="No playlists found" />
  return (
    <PageTitleWrapper title="Your Playlists">
      <div className="flex flex-row flex-wrap items-start justify-center gap-4">
        {data.map((playlist) => (
          <PlaylistGridItem
            key={`playlist-grid-item-${playlist.id}`}
            {...{ playlist }}
          />
        ))}
      </div>
    </PageTitleWrapper>
  )
}
