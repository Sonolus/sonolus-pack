import { z } from 'zod'
import { localizationTextSchema } from './localization-text'
import { getParser } from './parser'

const partialReplayInfoSchema = z.object({
    version: z.literal(1),
    title: localizationTextSchema,
    subtitle: localizationTextSchema,
    author: localizationTextSchema,
    description: localizationTextSchema,
    level: z.string(),
    meta: z.unknown(),
})

export const partialReplayInfoParser = getParser(partialReplayInfoSchema)
