import { trpc } from '@/app/router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FolderOpen, Music, Plus, Trash } from 'lucide-react'
import { useState } from 'react'

export default function MusicSources() {
  const qc = useQueryClient()
  const { mutate: addSourceFunc } = useMutation({
    ...trpc.user.addSource.mutationOptions(),
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: trpc.user.getPreferences.queryKey(),
      })
    },
  })
  const { data } = useQuery(trpc.user.getPreferences.queryOptions())
  const [input, setInput] = useState('')
  const [isAddingSource, setIsAddingSource] = useState(false)

  const handleAddSource = () => {
    if (input.trim()) {
      setIsAddingSource(true)
      addSourceFunc({ source: input })
      setIsAddingSource(false)
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Music Sources
        </CardTitle>
        <CardDescription>
          Add directories containing your music files. These will be scanned for
          tracks.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Sources */}
        {data?.preferences?.source_urls &&
          data.preferences.source_urls.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-muted-foreground text-sm font-medium">
                Active Sources
              </h4>
              <div className="space-y-2">
                {data?.preferences?.source_urls.map((source) => (
                  <Source
                    source={source}
                    key={`source-${crypto.randomUUID()}`}
                  />
                ))}
              </div>
            </div>
          )}

        {/* Add New Source */}
        <div className="space-y-3">
          <Separator />
          <h4 className="text-muted-foreground text-sm font-medium">
            Add New Source
          </h4>
          <div className="flex gap-2">
            <Input
              placeholder="Enter full path to directory with your music (e.g., /Users/username/Music)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSource()}
              className="flex-1"
            />
            <Button
              onClick={handleAddSource}
              disabled={!input.trim() || isAddingSource}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {isAddingSource ? 'Adding...' : 'Add Source'}
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">
            Make sure the directory path is accessible and contains music files.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
function Source({ source }: { source: string }) {
  const { mutateAsync } = useMutation({
    ...trpc.user.deleteSource.mutationOptions(),
    onSuccess: async () => {
      console.log('succes')
      await queryClient.invalidateQueries({
        queryKey: trpc.user.getPreferences.queryKey(),
      })
    },
  })
  const queryClient = useQueryClient()
  return (
    <>
      <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
        <Music className="text-muted-foreground h-4 w-4 flex-shrink-0" />
        <span className="flex-1 truncate font-mono text-sm">{source}</span>
        <Badge>Active</Badge>
        <Button
          variant={'destructive'}
          onClick={async () => {
            await mutateAsync({ source })
          }}
        >
          <Trash />
        </Button>
      </div>
    </>
  )
}
