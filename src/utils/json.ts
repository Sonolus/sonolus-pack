import { TSchema } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
import { readJsonSync } from 'fs-extra'

export const parse = <T extends TSchema>(path: string, schema: T) => {
    const data: unknown = readJsonSync(path)

    if (!Value.Check(schema, data)) {
        for (const error of Value.Errors(schema, data)) {
            console.error(
                '[ERROR]',
                `${path}: ${error.message}, got ${JSON.stringify(error.value)} (${error.path})`,
            )
        }
        throw new Error(`Invalid data: ${path}`)
    }

    Value.Clean(schema, data)
    return data
}
