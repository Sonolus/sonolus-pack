import { ResourceType } from 'sonolus-core'
import { z } from 'zod'
import { getParser } from './parser'

export const getSRLParser = <T extends ResourceType>(type: T) =>
    getParser(
        z.object({
            type: z.literal(type),
            hash: z.string(),
            url: z.string(),
        }),
    )
