import { trpc } from '@/app/router'
import type { TrackType } from '@/db/schema'
import { getCurrentUnixTimestamp, makeArtworkUrl } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { Dot, MoreHorizontal, Star } from 'lucide-react'
import { updatePlayerStore } from '../store'

export default function TrackMetadata({
  currentTrack,
}: {
  currentTrack: TrackType
}) {
  const { mutate } = useMutation({
    ...trpc.track.starTrack.mutationOptions(),
    onSuccess: () => {
      updatePlayerStore('currentTrack', {
        ...currentTrack,
        starred: currentTrack.starred ? null : getCurrentUnixTimestamp(),
      })
    },
  })
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2">
        <img className="w-full" src={makeArtworkUrl(currentTrack.path)} />
        <div className="flex w-full flex-row items-center justify-between">
          <div className="flex w-full flex-col items-start justify-start">
            <h1 className="text-xl font-bold">{currentTrack.title}</h1>
            <div className="flex flex-row gap-0">
              <h2 className="text-muted-foreground">{currentTrack.artist}</h2>
              {currentTrack.album && (
                <>
                  <Dot className="text-muted-foreground" />
                  <h2 className="text-muted-foreground">
                    {currentTrack.album}
                  </h2>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-row gap-3">
            <Star
              onClick={() => mutate({ trackId: currentTrack.id })}
              size={22}
              className="cursor-pointer"
              fill={currentTrack.starred ? 'yellow' : ''}
              color={currentTrack.starred ? 'yellow' : 'white'}
            />
            <MoreHorizontal size={22} className="cursor-pointer" />
          </div>
        </div>
      </div>
    </>
  )
}
