import { z } from 'zod'
import { getParser } from './parser'

const partialEffectDataSchema = z.object({
    clips: z.array(
        z.object({
            id: z.number(),
            clip: z.string(),
        })
    ),
})

export const partialEffectDataParser = getParser(partialEffectDataSchema)
