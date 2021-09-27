import { ResourceType } from 'sonolus-core'
import { z } from 'zod'
import { getParser } from './parser'

export function getSRLParser<T extends ResourceType>(type: T) {
    return getParser(
        z.object({
            type: z.literal(type),
            hash: z.string(),
            url: z.string(),
        })
    )
}
