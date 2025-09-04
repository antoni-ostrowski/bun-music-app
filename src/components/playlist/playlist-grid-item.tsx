import type { PlaylistType } from '@/db/schema'
import { makeImageUrl } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'

export default function PlaylistGridItem({
  playlist,
}: {
  playlist: PlaylistType
}) {
  return (
    <Link to={'/playlist/$playlistId'} params={{ playlistId: playlist.id }}>
      <Card className="flex w-60 flex-col items-center justify-center gap-2 p-4">
        <img
          src={makeImageUrl(playlist.cover_path ?? '/f/f/f')}
          className="aspect-square w-full"
        />
        <div className={'flex w-full flex-row items-center justify-between'}>
          <h1 className="font-bold">{playlist.name}</h1>
          <Button
            variant={'ghost'}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('click')
            }}
          >
            <MoreHorizontal />
          </Button>
        </div>
      </Card>
    </Link>
  )
}
