import { z } from 'zod'
import { localizationTextSchema } from './localization-text'
import { getParser } from './parser'

const useSchema = z.discriminatedUnion('useDefault', [
    z.object({ useDefault: z.literal(true) }),
    z.object({ useDefault: z.literal(false), item: z.string() }),
])

const partialLevelInfoSchema = z.object({
    version: z.literal(1),
    rating: z.number(),
    title: localizationTextSchema,
    artists: localizationTextSchema,
    author: localizationTextSchema,
    description: localizationTextSchema,
    engine: z.string(),
    useSkin: useSchema,
    useBackground: useSchema,
    useEffect: useSchema,
    useParticle: useSchema,
    meta: z.unknown(),
})

export const partialLevelInfoParser = getParser(partialLevelInfoSchema)
