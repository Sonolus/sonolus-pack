import { z } from 'zod'
import { getParser } from './parser'

const srlSchema = z.object({
    hash: z.string(),
    url: z.string(),
})

export const srlParser = getParser(srlSchema)
