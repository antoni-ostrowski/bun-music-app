import PageTitleWrapper from '@/components/page-title-wrapper'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  // const { data, isLoading } = useQuery({
  //   ...trpc.track.listAllTracks.queryOptions(),
  //   placeholderData: keepPreviousData,
  // })
  // if (isLoading) {
  //   return <div> LOADING</div>
  // }
  return (
    <PageTitleWrapper>
      <div className="flex-1">
        <h1 className="text-4xl">Hello</h1>
      </div>
    </PageTitleWrapper>
    // <div className="flex-1">
    //   <h1>Hello page</h1>

    //   {/*{data && <TrackTable tracks={data} />}*/}
    // </div>
  )
}
