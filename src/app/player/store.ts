import type { Track } from '@/db/schema'
import { Store } from '@tanstack/react-store'

type PlayerStore = {
  queue: string[]
  currentTrack: Track | undefined
}

export const playerStore = new Store<PlayerStore>({
  queue: [],
  currentTrack: undefined,
})
