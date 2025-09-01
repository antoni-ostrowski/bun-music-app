import { getCurrentUnixTimestamp } from '@/lib/utils'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export type Preferences = {
  theme: 'light' | 'dark'
  source_urls: string[]
}
export const preferences = sqliteTable('preferences', {
  id: text('id')
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  preferences: text('preferences', { mode: 'json' }).$type<Preferences>(),
})

export const tracks = sqliteTable('tracks', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$default(() => crypto.randomUUID()),
  path: text('path').notNull().unique(),
  source_url: text('source_url').notNull(),
  title: text('title').notNull(),
  artist: text('artist').notNull(),
  album: text('album'),
  genre: text('genre'),
  year: integer('year'),
  duration_in_ms: integer('duration_in_ms'),
  created_at: integer('created_at')
    .notNull()
    .$defaultFn(() => getCurrentUnixTimestamp()),
})
export const t = tracks.$inferSelect
export type TrackType = typeof t & {
  queue_id: string | null
}
