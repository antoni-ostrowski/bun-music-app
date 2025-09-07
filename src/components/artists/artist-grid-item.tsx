import type { AppRouter } from '@/trpc'
import { Link } from '@tanstack/react-router'
import type { inferRouterOutputs } from '@trpc/server'
import { AudioLines } from 'lucide-react'
import { Card } from '../ui/card'
import FavArtist from './fav-artist'
export type ArtistGridItemType =
  inferRouterOutputs<AppRouter>['metadata']['listArtists'][number]
export default function ArtistGridItem({ item }: { item: ArtistGridItemType }) {
  return (
    <Link to={'/artist/$artist'} params={{ artist: item.artist }}>
      <Card className="flex w-60 flex-col items-center justify-center gap-2 p-4">
        <div className={'flex w-full flex-row items-center justify-between'}>
          <div className="flex flex-row items-center justify-center gap-1">
            <FavArtist item={item} />
            <h1 className="font-bold">{item.artist}</h1>
          </div>
          <div className="flex items-center justify-center gap-2">
            <p>{item.tracksFromArtist.length}</p>
            <AudioLines />
          </div>
        </div>
      </Card>
    </Link>
  )
}
