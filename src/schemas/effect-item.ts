import { z } from 'zod'
import { localizationTextSchema } from './localization-text'
import { getParser } from './parser'
import { databaseTagSchema } from './tag'

const partialDatabaseEffectItemSchema = z.object({
    version: z.literal(5),
    title: localizationTextSchema,
    subtitle: localizationTextSchema,
    author: localizationTextSchema,
    tags: z.array(databaseTagSchema),
    description: localizationTextSchema,
    meta: z.unknown(),
})

export const partialDatabaseEffectItemParser = getParser(partialDatabaseEffectItemSchema)