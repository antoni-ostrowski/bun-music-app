import { router } from './router'
import { playlistRouter } from './routers/playlistRouter'
import { trackRouter } from './routers/trackRouter'
import { userRouter } from './routers/userRouter'

export const appRouter = router({
  track: trackRouter,
  user: userRouter,
  playlist: playlistRouter,
})
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter
