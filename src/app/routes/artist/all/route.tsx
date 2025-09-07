import { trpc } from '@/app/router'
import ArtistGridItem from '@/components/artists/artist-grid-item'
import FullScreenError from '@/components/full-screen-error'
import FullScreenLoading from '@/components/full-screen-loading'
import GridWrapper from '@/components/grid-wrapper'
import PageTitleWrapper from '@/components/page-title-wrapper'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/artist/all')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading, isError, error } = useQuery(
    trpc.metadata.listArtists.queryOptions()
  )

  if (isError) {
    console.log('[---ERROR---] Failed to get artists - ', error)
    return (
      <FullScreenError
        errorMessage="Failed to get artists"
        errorDetail={error.message}
      />
    )
  }

  if (isLoading) return <FullScreenLoading loadingMessage="Loading artists" />
  if (!data) return <FullScreenError errorMessage="Failed to get artists" />

  return (
    <PageTitleWrapper title="Artists">
      <GridWrapper>
        <>
          {data.map((item) => (
            <ArtistGridItem key={crypto.randomUUID()} item={item} />
          ))}
        </>
      </GridWrapper>
    </PageTitleWrapper>
  )
}
