import { z } from 'zod'
import { localizationTextSchema } from './localization-text'
import { getParser } from './parser'

const partialDatabaseServerInfoSchema = z.object({
    title: localizationTextSchema,
    description: localizationTextSchema.optional(),
})

export const partialDatabaseServerInfoParser = getParser(partialDatabaseServerInfoSchema)
