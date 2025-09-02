import { trpc } from '@/app/router'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { PlaylistType } from '@/db/schema'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Trash } from 'lucide-react'
import { useState } from 'react'
import SpinnerLoading from '../spinner-loading'

export function DeletePlaylist({
  currentPlaylistState,
}: {
  currentPlaylistState: PlaylistType
}) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: updatePlaylist, isPending } = useMutation({
    ...trpc.playlist.deletePlaylist.mutationOptions(),
    onSuccess: () => {
      setIsOpen(false)
    },
  })

  return (
    <>
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogTrigger asChild>
          <Button variant={'destructive'}>
            <Trash /> Delete
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="flex flex-col justify-start gap-4">
            <DialogTitle>
              Delete Playlist - {currentPlaylistState.name}
            </DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <Button
            variant={'destructive'}
            onClick={async () => {
              updatePlaylist({ playlistId: currentPlaylistState.id })
              setIsOpen(false)
              await navigate({ to: '/' })
            }}
          >
            {isPending ? (
              <SpinnerLoading />
            ) : (
              <>
                <Trash />
                Delete
              </>
            )}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
