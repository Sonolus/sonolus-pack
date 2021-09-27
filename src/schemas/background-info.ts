import { z } from 'zod'
import { localizationTextSchema } from './localization-text'
import { getParser } from './parser'

const partialBackgroundInfoSchema = z.object({
    version: z.literal(2),
    title: localizationTextSchema,
    subtitle: localizationTextSchema,
    author: localizationTextSchema,
    description: localizationTextSchema,
    meta: z.unknown(),
})

export const partialBackgroundInfoParser = getParser(
    partialBackgroundInfoSchema
)
