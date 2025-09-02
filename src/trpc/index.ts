import { playlistRouter } from './playlistRouter'
import { router } from './router'
import { trackRouter } from './trackRouter'
import { userRouter } from './userRouter'

export const appRouter = router({
  track: trackRouter,
  user: userRouter,
  playlist: playlistRouter,
})
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter
