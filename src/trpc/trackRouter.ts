import { db } from '@/db'
import { preferences, tracks } from '@/db/schema'
import { tryCatch } from '@/lib/utils'
import { eq } from 'drizzle-orm'
import { promises as fs } from 'fs'
import { parseFile, type IAudioMetadata } from 'music-metadata'
import { extname, join } from 'path'
import { t } from './router'
export const trackRouter = t.router({
  hello: t.procedure.query(() => {
    return { test: 'Hello, world!' }
  }),
  listAllTracks: t.procedure.query(async () => {
    return db.query.tracks.findMany()
  }),
  syncTracks: t.procedure.mutation(async () => {
    const [userPreferences, userPreferencesError] = await tryCatch(
      getUsersPreferences()
    )
    if (userPreferencesError) {
      console.log(userPreferencesError)
      throw new Error(userPreferencesError.message, {
        cause: userPreferencesError,
      })
    }
    console.log('sync tracks')
    const sourceUrls = userPreferences[0]?.preferences?.source_urls ?? []

    console.log('source urls - ', sourceUrls)

    for (const sourceUrl of sourceUrls) {
      const audioFiles = await getTracksFromSourceUrl(sourceUrl)
      console.log('audio files - ', audioFiles)
      await processTrackInsertion(audioFiles)
    }
    await scanDbForDeletedTracks()
    return { ok: true }
  }),
})
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

      if (entry.isDirectory()) {
        // If it's a directory, recurse into it
        const nestedAudioFiles = await getTracksFromSourceUrl(fullPath)
        audioFiles = audioFiles.concat(nestedAudioFiles)
      } else if (entry.isFile()) {
        // If it's a file, check its extension
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
          const res = await db
            .select()
            .from(tracks)
            .where(eq(tracks.path, fullPath))

          if (res.length === 0) {
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
    console.log('failed to insert to db', dbError)
    throw new Error('failed to insert to db', dbError)
  }
  return { ok: true }
}
async function processTrackInsertion(audioFiles: AudioFile[]) {
  for (const audioFile of audioFiles) {
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
  }
}
async function getFileMetadata(filePath: string) {
  const metadata = await parseFile(filePath)
  // console.log(`metadata for ${filePath}`, metadata)

  return metadata
}
async function scanDbForDeletedTracks() {
  const dbTracks = await db.query.tracks.findMany()
  for (const track of dbTracks) {
    const { path, id } = track
    const exists = await fs.exists(path)
    if (!exists) {
      await db.delete(tracks).where(eq(tracks.id, id))
    }
  }
}
