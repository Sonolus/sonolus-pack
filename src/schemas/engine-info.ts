import { z } from 'zod'
import { localizationTextSchema } from './localization-text'
import { getParser } from './parser'

const partialEngineInfoSchema = z.object({
    version: z.literal(6),
    title: localizationTextSchema,
    subtitle: localizationTextSchema,
    author: localizationTextSchema,
    description: localizationTextSchema,
    skin: z.string(),
    background: z.string(),
    effect: z.string(),
    particle: z.string(),
    meta: z.unknown(),
})

export const partialEngineInfoParser = getParser(partialEngineInfoSchema)
