import { trpc } from '@/app/router'
import { useMutation } from '@tanstack/react-query'
import { Star } from 'lucide-react'
import { useState } from 'react'
import SpinnerLoading from '../spinner-loading'
import { Button } from '../ui/button'
import type { ArtistGridItemType } from './artist-grid-item'

export default function FavArtist({ item }: { item: ArtistGridItemType }) {
  const { mutateAsync } = useMutation(
    trpc.metadata.starArtist.mutationOptions()
  )
  const [isMutating, setIsMutating] = useState(false)
  return (
    <Button
      variant={'ghost'}
      onClick={async (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsMutating(true)
        await mutateAsync({ artist: item.artist })
        setIsMutating(false)
      }}
    >
      {isMutating ? (
        <SpinnerLoading />
      ) : (
        <>
          {item.isFavourite ? <Star fill="yellow" color="yellow" /> : <Star />}
        </>
      )}
    </Button>
  )
}
