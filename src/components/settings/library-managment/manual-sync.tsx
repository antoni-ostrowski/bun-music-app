import { trpc } from '@/app/router'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'
import { useState } from 'react'

export default function ManualTracksSync() {
  const { mutateAsync: manualSync } = useMutation(
    trpc.track.syncTracks.mutationOptions()
  )
  const [isSyncing, setIsSyncing] = useState(false)
  async function handleSyncTrigger() {
    setIsSyncing(true)
    await manualSync()
    setIsSyncing(false)
    return
  }
  return (
    <>
      <Button
        variant={'outline'}
        onClick={async () => await handleSyncTrigger()}
        disabled={isSyncing}
        size="lg"
        className="flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
        {isSyncing ? 'Syncing Tracks...' : 'Sync Tracks Manually'}
      </Button>
      <p className="text-muted-foreground mt-2 text-sm">
        This will scan all your music sources and update the database with any
        new or changed tracks.
      </p>
    </>
  )
}
