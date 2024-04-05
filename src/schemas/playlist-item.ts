import { z } from 'zod'
import { localizationTextSchema } from './localization-text'
import { getParser } from './parser'
import { databaseTagSchema } from './tag'

const partialDatabasePlaylistItemSchema = z.object({
    version: z.literal(1),
    title: localizationTextSchema,
    subtitle: localizationTextSchema,
    author: localizationTextSchema,
    tags: z.array(databaseTagSchema),
    description: localizationTextSchema,
    levels: z.array(z.string()),
    meta: z.unknown(),
})

export const partialDatabasePlaylistItemParser = getParser(partialDatabasePlaylistItemSchema)
