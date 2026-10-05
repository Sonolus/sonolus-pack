import { gzipSync } from 'node:zlib'

import { Srl, compressSync, hash } from '@sonolus/core'
import fs from 'fs-extra'
import { TSchema } from 'typebox'

import { srlSchema } from './schemas/srl.js'
import { parse } from './utils/json.js'

type Resource = {
    ext: string
    optional?: true
}

export const createProcessItems =
    (pathInput: string, pathOutput: string) =>
    <T extends TSchema, R extends Record<string, Resource>>(
        dirname: string,
        schema: T,
        resources: R,
    ) => {
        const pathDir = `${pathInput}/${dirname}`

        if (!fs.existsSync(pathDir)) return []

        return fs
            .readdirSync(pathDir, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map(({ name }) => ({
                name,
                ...processItem(`${pathDir}/${name}`, pathOutput, 'item', schema, resources),
            }))
    }

export const processItem = <T extends TSchema, R extends Record<string, Resource>>(
    pathInput: string,
    pathOutput: string,
    filename: string,
    schema: T,
    resources: R,
) => {
    console.log('[INFO]', 'Packing:', pathInput)

    if (!fs.existsSync(`${pathInput}/${filename}.json`))
        throw new Error(`${pathInput}/${filename}.json: Does not exist`)

    const item = parse(`${pathInput}/${filename}.json`, schema)

    const output = Object.fromEntries(
        Object.entries(resources as Record<string, { ext: string; optional: boolean }>).map(
            ([name, { ext, optional }]) => [
                name,
                processResource(`${pathInput}/${name}`, pathOutput, ext, optional),
            ],
        ),
    ) as {
        [K in keyof R]: R[K] extends { optional: true } ? Srl | undefined : Srl
    }

    return { ...item, ...output }
}

const processResource = (pathFile: string, pathOutput: string, ext: string, optional: boolean) => {
    let buffer: Buffer

    const pathFileSRL = `${pathFile}.srl`
    const pathFileExt = `${pathFile}.${ext}`

    if (fs.existsSync(pathFileSRL)) {
        return parse(pathFileSRL, srlSchema)
    } else if (fs.existsSync(pathFile)) {
        buffer = fs.readFileSync(pathFile)
    } else if (fs.existsSync(pathFileExt)) {
        if (ext === 'json') {
            const json: unknown = fs.readJsonSync(pathFileExt)
            buffer = compressSync(json)
        } else if (ext === 'bin') {
            buffer = gzipSync(fs.readFileSync(pathFileExt), { level: 9 })
        } else {
            buffer = fs.readFileSync(pathFileExt)
        }
    } else if (optional) {
        console.log('[INFO]', `${pathFile}[.${ext}/.srl]: Does not exist, skipped`)
        return
    } else {
        console.log('[WARNING]', `${pathFile}[.${ext}/.srl]: Does not exist`)
        return {}
    }

    const outputHash = hash(buffer)
    fs.outputFileSync(`${pathOutput}/repository/${outputHash}`, buffer)
    return { hash: outputHash, url: `/sonolus/repository/${outputHash}` }
}
