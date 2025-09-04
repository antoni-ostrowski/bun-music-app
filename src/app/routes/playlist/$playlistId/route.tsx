import { trpc } from '@/app/router'
import FullScreenError from '@/components/full-screen-error'
import FullScreenLoading from '@/components/full-screen-loading'
import PageTitleWrapper from '@/components/page-title-wrapper'
import { DeletePlaylist } from '@/components/playlist/delete-playlist'
import { EditPlaylist } from '@/components/playlist/edit-playlist'
import TrackTable from '@/components/track-table/track-table'
import { makeImageUrl } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/playlist/$playlistId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { playlistId } = Route.useParams()
  const { data, isLoading, isError, error } = useQuery(
    trpc.playlist.getPlaylist.queryOptions({
      playlistId: playlistId,
    })
  )
  if (isError) {
    console.log('[PLAYLIST] Error fetching playlist', error)
    return <FullScreenError errorMessage={error.message} />
  }
  if (isLoading) return <FullScreenLoading />
  if (!data) return <div>No data...</div>
  return (
    <PageTitleWrapper>
      <div className="flex flex-col gap-10">
        <div className="flex flex-row items-center justify-start gap-8">
          {data.playlist.cover_path && (
            <img
              className="aspect-square w-50 object-fill"
              src={makeImageUrl(data.playlist.cover_path)}
            />
          )}
          <div className="flex flex-col items-start justify-start gap-2">
            <h1 className="text-3xl font-bold">{data.playlist.name}</h1>
            <div className="flex flex-row gap-2">
              <EditPlaylist currentPlaylistState={data.playlist} />
              <DeletePlaylist currentPlaylistState={data.playlist} />
            </div>
          </div>
        </div>
        {data && <TrackTable tracks={data.tracks} />}
      </div>
    </PageTitleWrapper>
  )
}
