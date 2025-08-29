import { Card } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { playerStore } from '../store'

export default function Player() {
  const [filePath, setFilePath] = useState<string | undefined>(undefined)

  useEffect(() => {
    const unsub = playerStore.subscribe(
      ({ currentVal: { filePath: newPath } }) => {
        setFilePath(newPath)
        console.log('new path - ', newPath)
      }
    )
    return () => unsub()
  }, [])

  return (
    <Card>
      player path - {filePath}
      <audio src={filePath} controls autoPlay></audio>
    </Card>
  )
}
