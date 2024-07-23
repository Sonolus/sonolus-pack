import { TSchema, TUnsafe } from '@sinclair/typebox'
import { Srl, compressSync, hash } from '@sonolus/core'
import { existsSync, outputFileSync, readFileSync, readJsonSync, readdirSync } from 'fs-extra'
import { gzipSync } from 'zlib'
import { srlSchema } from './schemas/srl'
import { Remove, SrlKey } from './utils/item'
import { parse } from './utils/json'

type SchemaOf<T> = TUnsafe<Remove<T, 'name' | SrlKey<T>>>

type ResourcesOf<T> = {
    [K in SrlKey<T>]: T[K] extends Srl ? { ext: string } : { ext: string; optional: true }
}

export const createProcessItems =
    (pathInput: string, pathOutput: string) =>
    <T>(dirname: string, schema: SchemaOf<T>, resources: ResourcesOf<T>): T[] => {
        const pathDir = `${pathInput}/${dirname}`

        if (!existsSync(pathDir)) return []

        return readdirSync(pathDir, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map(({ name }) => ({
                name,
                ...processItem(`${pathDir}/${name}`, pathOutput, 'item', schema, resources),
            })) as never
    }

export const processItem = <TItem, TPartialItemSchema extends TSchema>(
    pathInput: string,
    pathOutput: string,
    filename: string,
    schema: TPartialItemSchema,
    resources: ResourcesOf<TItem>,
): TItem => {
    console.log('[INFO]', 'Packing:', pathInput)

    if (!existsSync(`${pathInput}/${filename}.json`))
        throw new Error(`${pathInput}/${filename}.json: Does not exist`)

    const item = parse(`${pathInput}/${filename}.json`, schema)

    const output = Object.fromEntries(
        Object.entries(resources as Record<string, { ext: string; optional: boolean }>).map(
            ([name, { ext, optional }]) => [
                name,
                processResource(`${pathInput}/${name}`, pathOutput, ext, optional),
            ],
        ),
    )

    return { ...(item as object), ...output } as never
}

const processResource = (pathFile: string, pathOutput: string, ext: string, optional: boolean) => {
    let output: Buffer | Srl

    const pathFileSRL = `${pathFile}.srl`
    const pathFileExt = `${pathFile}.${ext}`

    if (existsSync(pathFileSRL)) {
        output = parse(pathFileSRL, srlSchema)
    } else if (existsSync(pathFile)) {
        output = readFileSync(pathFile)
    } else if (existsSync(pathFileExt)) {
        if (ext === 'json') {
            const json: unknown = readJsonSync(pathFileExt)
            output = compressSync(json)
        } else if (ext === 'bin') {
            output = gzipSync(readFileSync(pathFileExt), { level: 9 })
        } else {
            output = readFileSync(pathFileExt)
        }
    } else if (optional) {
        console.log('[INFO]', `${pathFile}[.${ext}/.srl]: Does not exist, skipped`)
        return
    } else {
        console.log('[WARNING]', `${pathFile}[.${ext}/.srl]: Does not exist`)
        output = {}
    }

    if (output instanceof Buffer) {
        const outputHash = hash(output)
        outputFileSync(`${pathOutput}/repository/${outputHash}`, output)
        output = { hash: outputHash, url: `/sonolus/repository/${outputHash}` }
    }

    return output
}
