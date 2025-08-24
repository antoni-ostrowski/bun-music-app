import { router, t } from './router'
import { trackRouter } from './trackRouter'
import { userRouter } from './userRouter'

export const appRouter = router({
  track: trackRouter,
  user: userRouter,
  hello: t.procedure.query(() => {
    return { test: 'Hello, world!' }
  }),
})
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter
