import { t } from './router'

export const trackRouter = t.router({
  hello: t.procedure.query(() => {
    return { test: 'Hello, world!' }
  }),
})
