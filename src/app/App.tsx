import { useQuery } from '@tanstack/react-query'
import { Button } from '../components/ui/button'
import { useTRPC } from './trpc/context'

export function App() {
  const trpc = useTRPC()
  const userQuery = useQuery(trpc.track.hello.queryOptions())
  console.log(userQuery.data)

  return (
    <div className="flex flex-col gap-2">
      <h1>Testing</h1>
      <Button variant={'outline'}>click me</Button>
    </div>
  )
}
