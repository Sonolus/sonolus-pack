import { z } from 'zod'
import { localizationTextSchema } from './localization-text'
import { getParser } from './parser'

const partialEffectInfoSchema = z.object({
    version: z.literal(3),
    title: localizationTextSchema,
    subtitle: localizationTextSchema,
    author: localizationTextSchema,
    description: localizationTextSchema,
    meta: z.unknown(),
})

export const partialEffectInfoParser = getParser(partialEffectInfoSchema)
