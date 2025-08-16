import { router, t } from './router'
import { trackRouter } from './trackRouter'

export const appRouter = router({
  track: trackRouter,
  hello: t.procedure.query(() => {
    return { test: 'Hello, world!' }
  }),
})
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter
