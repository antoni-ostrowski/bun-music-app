import { useTRPC } from '@/app/trpc/context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  const [input, setInput] = useState('')
  const trpc = useTRPC()
  const { mutate } = useMutation(trpc.track.syncTracks.mutationOptions())
  const { mutate: addSourceFunc } = useMutation(
    trpc.user.addSource.mutationOptions()
  )
  const { data } = useQuery(trpc.user.getPreferences.queryOptions())
  return (
    <div>
      Hello "/settings"!
      <div>
        <h3>Select a Directory</h3>
        {data?.preferences?.source_urls.map((source) => {
          return <div key={source}>ADDDED SOURCE - {source}</div>
        })}

        {input}
        <p>enter full path to directory with your music</p>
        <Input onChange={(e) => setInput(e.target.value)} />
        <Button onClick={() => addSourceFunc({ source: input })}>
          add source
        </Button>
      </div>
      <Button onClick={() => mutate()}>sycn track with db</Button>
    </div>
  )
}
