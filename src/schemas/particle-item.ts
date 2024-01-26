import { z } from 'zod'
import { localizationTextSchema } from './localization-text'
import { getParser } from './parser'
import { databaseTagSchema } from './tag'

const partialDatabaseParticleItemSchema = z.object({
    version: z.literal(2),
    title: localizationTextSchema,
    subtitle: localizationTextSchema,
    author: localizationTextSchema,
    tags: z.array(databaseTagSchema),
    description: localizationTextSchema,
    meta: z.unknown(),
})

export const partialDatabaseParticleItemParser = getParser(partialDatabaseParticleItemSchema)
