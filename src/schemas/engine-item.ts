import { z } from 'zod'
import { localizationTextSchema } from './localization-text'
import { getParser } from './parser'
import { databaseTagSchema } from './tag'

const partialDatabaseEngineItemSchema = z.object({
    version: z.literal(12),
    title: localizationTextSchema,
    subtitle: localizationTextSchema,
    author: localizationTextSchema,
    tags: z.array(databaseTagSchema),
    description: localizationTextSchema,
    skin: z.string(),
    background: z.string(),
    effect: z.string(),
    particle: z.string(),
    meta: z.unknown(),
})

export const partialDatabaseEngineItemParser = getParser(partialDatabaseEngineItemSchema)
