import { useTRPC } from '@/app/trpc/context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  const [input, setInput] = useState('')
  const trpc = useTRPC()
  const { mutate } = useMutation(trpc.track.syncTracks.mutationOptions())
  return (
    <div>
      Hello "/settings"!
      <div>
        <h3>Select a Directory</h3>

        {input}
        <p>enter full path to directory with your music</p>
        <Input onChange={(e) => setInput(e.target.value)} />
      </div>
      <Button onClick={() => mutate()}>sycn track with db</Button>
    </div>
  )
}
