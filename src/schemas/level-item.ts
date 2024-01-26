import { z } from 'zod'
import { localizationTextSchema } from './localization-text'
import { getParser } from './parser'
import { databaseTagSchema } from './tag'

const databaseUseItemSchema = z.discriminatedUnion('useDefault', [
    z.object({ useDefault: z.literal(true) }),
    z.object({ useDefault: z.literal(false), item: z.string() }),
])

const partialDatabaseLevelItemSchema = z.object({
    version: z.literal(1),
    rating: z.number(),
    title: localizationTextSchema,
    artists: localizationTextSchema,
    author: localizationTextSchema,
    tags: z.array(databaseTagSchema),
    description: localizationTextSchema,
    engine: z.string(),
    useSkin: databaseUseItemSchema,
    useBackground: databaseUseItemSchema,
    useEffect: databaseUseItemSchema,
    useParticle: databaseUseItemSchema,
    meta: z.unknown(),
})

export const partialDatabaseLevelItemParser = getParser(partialDatabaseLevelItemSchema)
