import { z } from 'zod'
import { localizationTextSchema } from './localization-text'
import { getParser } from './parser'

const partialServerInfoSchema = z.object({
    title: localizationTextSchema,
})

export const partialServerInfoParser = getParser(partialServerInfoSchema)
