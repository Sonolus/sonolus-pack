import { z } from 'zod'
import { localizationTextSchema } from './localization-text'
import { getParser } from './parser'
import { databaseTagSchema } from './tag'

const partialDatabasePostItemSchema = z.object({
    version: z.literal(1),
    title: localizationTextSchema,
    time: z.number(),
    author: localizationTextSchema,
    tags: z.array(databaseTagSchema),
    description: localizationTextSchema,
    meta: z.unknown(),
})

export const partialDatabasePostItemParser = getParser(partialDatabasePostItemSchema)
