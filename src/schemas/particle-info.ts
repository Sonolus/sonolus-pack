import { z } from 'zod'
import { localizationTextSchema } from './localization-text'
import { getParser } from './parser'

const partialParticleInfoSchema = z.object({
    version: z.literal(2),
    title: localizationTextSchema,
    subtitle: localizationTextSchema,
    author: localizationTextSchema,
    description: localizationTextSchema,
    meta: z.unknown(),
})

export const partialParticleInfoParser = getParser(partialParticleInfoSchema)
