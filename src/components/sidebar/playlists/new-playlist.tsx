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
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { sidebarIconSize } from '../sidebar-left'

export function NewPlaylist() {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: createNewPlaylist, isPending } = useMutation({
    ...trpc.playlist.createPlaylist.mutationOptions(),
    onSuccess: () => {
      setIsOpen(false)
    },
  })
  const form = useForm({
    defaultValues: {
      name: '',
      cover_path: '',
    },
    onSubmit: ({ value }) => {
      // console.log('form values - ', value)
      createNewPlaylist(value)
    },
  })
  return (
    <>
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogTrigger className="w-full" asChild>
          <Button
            className="flex w-full items-center justify-start"
            variant={'ghost'}
          >
            <Plus size={sidebarIconSize} />
            New Playlist
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="flex flex-col gap-4">
            <DialogTitle>Create new playlist</DialogTitle>
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
            {isPending ? 'Creating...' : 'Create Playlist'}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
