import { getCurrentUnixTimestamp } from '@/lib/utils'
import { relations } from 'drizzle-orm'
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
  created_at: integer('created_at')
    .notNull()
    .$defaultFn(() => getCurrentUnixTimestamp()),
  path: text('path').notNull().unique(),
  source_url: text('source_url').notNull(),
  title: text('title').notNull(),
  artist: text('artist').notNull(),
  album: text('album'),
  genre: text('genre'),
  year: integer('year'),
  duration_in_ms: integer('duration_in_ms'),
  starred: integer('starred'),
  queue_id: text('queue_id'),
})
export type TrackType = typeof tracks.$inferSelect

export const groupsRelations = relations(tracks, ({ many }) => ({
  tracksToPlaylists: many(tracksToPlaylists),
}))
export const playlists = sqliteTable('playlists', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$default(() => crypto.randomUUID()),
  created_at: integer('created_at')
    .notNull()
    .$defaultFn(() => getCurrentUnixTimestamp()),
  name: text('name').notNull(),
  cover_path: text('cover_path'),
})
export type PlaylistType = typeof playlists.$inferSelect

export const playlistsRelations = relations(playlists, ({ many }) => ({
  tracksToPlaylists: many(tracksToPlaylists),
}))
export const tracksToPlaylists = sqliteTable('tracks_to_playlists', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$default(() => crypto.randomUUID()),
  created_at: integer('created_at')
    .notNull()
    .$defaultFn(() => getCurrentUnixTimestamp()),
  track_id: text('track_id')
    .notNull()
    .references(() => tracks.id),
  playlist_id: text('playlist_id')
    .notNull()
    .references(() => playlists.id),
})
export const tracksToPlaylistsRelation = relations(
  tracksToPlaylists,
  ({ one }) => ({
    track: one(tracks, {
      fields: [tracksToPlaylists.track_id],
      references: [tracks.id],
    }),
    playlist: one(playlists, {
      fields: [tracksToPlaylists.playlist_id],
      references: [playlists.id],
    }),
  })
)
export const favouriteArtists = sqliteTable('favouriteArtists', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$default(() => crypto.randomUUID()),
  created_at: integer('created_at')
    .notNull()
    .$defaultFn(() => getCurrentUnixTimestamp()),
  starred: integer('starred'),
  artist: text('artist').notNull().unique(),
})
