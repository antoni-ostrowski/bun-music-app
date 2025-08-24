import { db } from '@/db'
import { preferences, type Preferences } from '@/db/schema'
import { tryCatch } from '@/lib/utils'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { t } from './router'
export const userRouter = t.router({
  getPreferences: t.procedure.query(async () => {
    const preferences = await db.query.preferences.findFirst()
    return preferences
  }),
  addSource: t.procedure
    .input(z.object({ source: z.string() }))
    .mutation(async ({ input }) => {
      console.log('add source - ', input.source)
      const currentPreferences = await db.query.preferences.findFirst()
      if (!currentPreferences) throw new Error('No preferences found')
      // if (!currentPreferences.preferences)
      //   throw new Error('No preferences found')

      const newPreferences: Preferences = {
        theme: currentPreferences?.preferences?.theme ?? 'light',
        source_urls: [
          ...(currentPreferences.preferences?.source_urls ?? []),
          input.source,
        ],
      }
      const [res, err] = await tryCatch(
        (async () => {
          await db
            .update(preferences)
            .set({ preferences: newPreferences })
            .where(eq(preferences.id, currentPreferences.id))
        })()
      )
      if (err) {
        console.log('Error while adding source')
        console.log(err)
        throw err
      }
      return 'hello'
    }),
})
