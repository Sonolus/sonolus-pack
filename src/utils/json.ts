import fs from 'fs-extra'
import { TSchema } from 'typebox'
import Value from 'typebox/value'

export const parse = <T extends TSchema>(path: string, schema: T) => {
    const data: unknown = fs.readJsonSync(path)

    if (!Value.Check(schema, data)) {
        for (const error of Value.Errors(schema, data)) {
            console.error('[ERROR]', `${path}: ${error.instancePath} ${error.message}`)
        }
        throw new Error(`Invalid data: ${path}`)
    }

    Value.Clean(schema, data)
    return data
}
