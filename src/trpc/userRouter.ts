import { z } from 'zod'
import { t } from './router'
export const userRouter = t.router({
  addSource: t.procedure
    .input(z.object({ sources: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      return 'hello'
    }),
})
