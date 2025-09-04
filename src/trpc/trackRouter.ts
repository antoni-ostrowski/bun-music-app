import { db } from '@/db'
import { preferences, tracks } from '@/db/schema'
import { getCurrentUnixTimestamp, tryCatch } from '@/lib/utils'
import { eq } from 'drizzle-orm'
import { promises as fs } from 'fs'
import { parseFile, type IAudioMetadata } from 'music-metadata'
import { extname, join } from 'path'
import z from 'zod'
import { t } from './router'
export const trackRouter = t.router({
  starTrack: t.procedure
    .input(z.object({ trackId: z.string() }))
    .mutation(async ({ input: { trackId } }) => {
      const current = await db.query.tracks.findFirst({
        where: (tracks, { eq }) => eq(tracks.id, trackId),
      })
      console.log('starttr')
      if (!current) throw new Error('Track not found')
      await db
        .update(tracks)
        .set({ starred: current.starred ? null : getCurrentUnixTimestamp() })
        .where(eq(tracks.id, trackId))
    }),
  getFavTracks: t.procedure.query(async () => {
    return await db.query.tracks.findMany({
      where: (tracks, { isNotNull }) => isNotNull(tracks.starred),
    })
  }),
  listAllTracks: t.procedure.query(async () => {
    return db.query.tracks.findMany()
  }),
  syncTracks: t.procedure.mutation(async () => {
    return await syncTracks()
  }),
})
export async function syncTracks() {
  console.log('[SYNC] Started syncing...')
  const [userPreferences, userPreferencesError] = await tryCatch(
    getUsersPreferences()
  )
  if (userPreferencesError) {
    console.log(userPreferencesError)
    throw new Error(userPreferencesError.message, {
      cause: userPreferencesError,
    })
  }
  console.log('[SYNC] Fetched preferences')
  const sourceUrls = userPreferences[0]?.preferences?.source_urls ?? []

  console.log('[SYNC] Source urls found')
  console.dir(sourceUrls, { depth: null })

  console.log('[SYNC] Starting iteration on source urls')
  for (const sourceUrl of sourceUrls) {
    const audioFiles = await getTracksFromSourceUrl(sourceUrl)
    console.log('[SYNC] Tracks found in the ', sourceUrl)
    audioFiles.forEach((item) => {
      console.log('[SYNC] Track found - ', item.entryName)
    })
    console.log('[SYNC] Inserting found tracks into db')
    await processTrackInsertion(audioFiles)
  }
  console.log('[SYNC] Starting scanning for deleted files')
  await scanDbForDeletedTracks(sourceUrls)
  return { ok: true }
}
async function getUsersPreferences() {
  const res = await db.select().from(preferences)
  if (!res) {
    throw new Error('No user preferences found')
  }
  return res
}
type AudioFile = {
  entryName: string
  path: string
  sourceUrl: string
  metadata: IAudioMetadata
}
async function getTracksFromSourceUrl(sourceUrl: string) {
  const AUDIO_EXTENSIONS = new Set([
    '.mp3',
    '.wav',
    '.flac',
    '.aac',
    '.ogg',
    '.oga',
    '.m4a',
    '.opus',
    '.wma',
  ])
  let audioFiles: AudioFile[] = []

  try {
    const entries = await fs.readdir(sourceUrl, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(sourceUrl, entry.name)
      console.log('[SYNC] Found file - ', entry.name)

      if (entry.isDirectory()) {
        console.log('[SYNC] Its a dir, recurse into it')
        // If it's a directory, recurse into it
        const nestedAudioFiles = await getTracksFromSourceUrl(fullPath)
        audioFiles = audioFiles.concat(nestedAudioFiles)
      } else if (entry.isFile()) {
        // If it's a file, check its extension
        console.log('[SYNC] Its a file, processing it')
        const fileExtension = extname(entry.name).toLowerCase()
        if (AUDIO_EXTENSIONS.has(fileExtension)) {
          const [fileMetadata, fileMetadataError] = await tryCatch(
            getFileMetadata(fullPath)
          )
          if (fileMetadataError || !fileMetadata) {
            console.error(
              `Error getting metadata for file ${fullPath}:`,
              fileMetadataError
            )
            continue
          }
          console.log('[SYNC] Found file metadata')
          const res = await db
            .select()
            .from(tracks)
            .where(eq(tracks.path, fullPath))

          if (res.length === 0) {
            console.log('[SYNC] File is a new track not existing in db')
            audioFiles.push({
              entryName: entry.name,
              path: fullPath,
              sourceUrl: sourceUrl,
              metadata: fileMetadata,
            })
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${sourceUrl}:`, error)
  }

  return audioFiles
}
async function insertTrackInDb(track: AudioFile) {
  const {
    common: { artist, title, album, genre, year },
    format: { duration: durationInMs },
  } = track.metadata
  const [dbResult, dbError] = await tryCatch(
    db
      .insert(tracks)
      .values({
        path: track.path,
        source_url: track.sourceUrl,
        artist: artist ?? 'no artist',
        title: title ?? track.entryName,
        album: album,
        durationInMs,
        genre: genre?.toString(),
        year,
      })
      .onConflictDoNothing()
  )
  if (dbError) {
    console.log('[SYNC] failed to insert to db', track)
    console.dir(dbError)
    throw new Error('failed to insert to db', dbError)
  }
  return { ok: true }
}
async function processTrackInsertion(audioFiles: AudioFile[]) {
  console.log('[SYNC] Strating tracks insertion')
  for (const audioFile of audioFiles) {
    console.log('[SYNC] Inserting track - ', audioFile.entryName)
    const { path, metadata, entryName } = audioFile
    const [result, error] = await tryCatch(
      insertTrackInDb({
        entryName,
        path,
        metadata,
        sourceUrl: audioFile.sourceUrl,
      })
    )
    if (error) {
      console.log('failed to insert track to db')
      throw new Error('failed to insert track to db')
    }
    console.log('[SYNC] Track inserted successfully')
  }
}
async function getFileMetadata(filePath: string) {
  const metadata = await parseFile(filePath)
  // console.log(`metadata for ${filePath}`, metadata)

  return metadata
}
async function scanDbForDeletedTracks(sourceUrls: string[]) {
  // console.log('urls in deleting func - ', sourceUrls)
  const dbTracks = await db.query.tracks.findMany()
  for (const track of dbTracks) {
    // console.log('checking with ', track.source_url)
    // console.log('checking with ', sourceUrls)

    // console.log('[SYNC] Checking track - ', track.title)
    const { path, id } = track
    // console.log('[SYNC] checking path - ', path)
    const exists = await fs.exists(path)
    // console.log(
    //   'does track exists in urls - ',
    //   sourceUrls.some((url) => track.source_url.startsWith(url))
    // )
    // console.log('[SYNC] Track exists:', exists)
    if (
      !exists ||
      !sourceUrls.some((url) => track.source_url.startsWith(url))
    ) {
      await db.delete(tracks).where(eq(tracks.id, id))
      // console.log('[SYNC] Track deleted successfully')
    }
  }
}
