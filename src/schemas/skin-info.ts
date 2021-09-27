import { z } from 'zod'
import { localizationTextSchema } from './localization-text'
import { getParser } from './parser'

const partialSkinInfoSchema = z.object({
    version: z.literal(2),
    title: localizationTextSchema,
    subtitle: localizationTextSchema,
    author: localizationTextSchema,
    description: localizationTextSchema,
    meta: z.unknown(),
})

export const partialSkinInfoParser = getParser(partialSkinInfoSchema)
