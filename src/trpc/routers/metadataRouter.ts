import { db } from '@/db'
import { favouriteArtists, tracks } from '@/db/schema'
import { getCurrentUnixTimestamp } from '@/lib/utils'
import { eq } from 'drizzle-orm'
import z from 'zod'
import { t } from '../router'
import { getTracksFromArtist } from './trackRouter'

export const metadataRouter = t.router({
  listArtists: t.procedure.query(async () => {
    const dbArtists = await db
      .selectDistinct({ artist: tracks.artist })
      .from(tracks)
      .orderBy(tracks.id, tracks.artist)

    const artistsString = dbArtists
      .map((item) => item.artist.split(', '))
      .flatMap((artistArr) => artistArr)

    const uniqueArtists = extractUniqueStrings(artistsString)
    console.log('Unique artist - ', uniqueArtists)
    const promises = uniqueArtists.map(async (artist) => {
      const tracksFromArtist = await getTracksFromArtist(artist)
      const isFavourite = await db.query.favouriteArtists.findFirst({
        where: (favouriteArtists, { eq }) =>
          eq(favouriteArtists.artist, artist),
      })

      return {
        artist,
        tracksFromArtist,
        isFavourite,
      }
    })
    const results = await Promise.all(promises)

    return results
  }),
  starArtist: t.procedure
    .input(z.object({ artist: z.string() }))
    .mutation(async ({ input: { artist } }) => {
      const current = await db.query.favouriteArtists.findFirst({
        where: (favouriteArtists, { eq }) =>
          eq(favouriteArtists.artist, artist),
      })
      if (current) {
        await db
          .delete(favouriteArtists)
          .where(eq(favouriteArtists.id, current.id))
        return
      } else {
        await db
          .insert(favouriteArtists)
          .values({
            artist,
            starred: getCurrentUnixTimestamp(),
          })
          .onConflictDoUpdate({
            target: favouriteArtists.artist,
            set: {
              starred: getCurrentUnixTimestamp(),
            },
          })
      }
    }),
})

function extractUniqueStrings(strings: string[]) {
  // remove duplicates and handle casing
  const endArtists = new Map<string, string>()

  for (const artist of strings) {
    const lowerCaseArtist = artist.toLowerCase()
    if (!endArtists.has(lowerCaseArtist)) {
      endArtists.set(lowerCaseArtist, artist)
    }
  }

  const result: string[] = Array.from(endArtists.values())
  return result
}
