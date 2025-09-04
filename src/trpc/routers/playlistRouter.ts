import { db } from '@/db'
import { playlists } from '@/db/schema'
import { eq } from 'drizzle-orm'
import z from 'zod'
import { t } from '../router'

export const playlistRouter = t.router({
  listPlaylists: t.procedure.query(async () => {
    return await db.query.playlists.findMany()
  }),
  createPlaylist: t.procedure
    .input(z.object({ name: z.string(), cover_path: z.string() }))
    .mutation(async ({ input: { name, cover_path } }) => {
      await db.insert(playlists).values({
        name,
        cover_path: cover_path.length === 0 ? null : cover_path,
      })
    }),
  editPlaylist: t.procedure
    .input(
      z.object({
        playlistId: z.string(),
        newState: z.object({ name: z.string(), cover_path: z.string() }),
      })
    )
    .mutation(
      async ({
        input: {
          newState: { name, cover_path },
          playlistId,
        },
      }) => {
        await db
          .update(playlists)
          .set({ name, cover_path })
          .where(eq(playlists.id, playlistId))
      }
    ),
  deletePlaylist: t.procedure
    .input(
      z.object({
        playlistId: z.string(),
      })
    )
    .mutation(async ({ input: { playlistId } }) => {
      await db.delete(playlists).where(eq(playlists.id, playlistId))
    }),
  getPlaylist: t.procedure
    .input(z.object({ playlistId: z.string() }))
    .query(async ({ input: { playlistId } }) => {
      const result = await db.query.tracksToPlaylists.findMany({
        where: (tracksToPlaylists, { eq }) =>
          eq(tracksToPlaylists.playlist_id, playlistId),
        with: {
          track: true,
        },
      })
      const playlist = await db.query.playlists.findFirst({
        where: (playlists, { eq }) => eq(playlists.id, playlistId),
      })
      if (!playlist) {
        throw new Error('Playlist not found')
      }
      console.log('result = ', result)
      const tracks = result.flatMap((item) => item.track)
      return { tracks, playlist }
    }),
})
