import { trpc } from '@/app/router'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { PlaylistType } from '@/db/schema'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { Edit } from 'lucide-react'
import { useState } from 'react'

export function EditPlaylist({
  currentPlaylistState,
}: {
  currentPlaylistState: PlaylistType
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: updatePlaylist, isPending } = useMutation({
    ...trpc.playlist.editPlaylist.mutationOptions(),
    onSuccess: () => {
      setIsOpen(false)
    },
  })
  const form = useForm({
    defaultValues: {
      name: currentPlaylistState.name,
      cover_path: currentPlaylistState.cover_path ?? '',
    },
    onSubmit: ({ value }) => {
      // console.log('form values - ', value)
      updatePlaylist({ newState: value, playlistId: currentPlaylistState.id })
    },
  })
  return (
    <>
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogTrigger asChild>
          <Button variant={'outline'}>
            <Edit /> Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="flex flex-col gap-4">
            <DialogTitle>Edit Playlist</DialogTitle>
            <div className="flex flex-col gap-4">
              <form.Field
                name="name"
                children={(field) => (
                  <div className="flex flex-col gap-4">
                    <Label htmlFor="playlist_name">Playlist name</Label>
                    <Input
                      id="playlist_name"
                      placeholder="Playlist name"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                )}
              />
              <form.Field
                name="cover_path"
                children={(field) => (
                  <div className="flex flex-col gap-4">
                    <Label htmlFor="cover_path">Playlist cover file path</Label>
                    <Input
                      id="cover_path"
                      placeholder="Playlist cover file path"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                )}
              />
            </div>
          </DialogHeader>
          <Button variant={'outline'} onClick={() => form.handleSubmit()}>
            {isPending ? 'Editing...' : 'Edit Playlist'}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
