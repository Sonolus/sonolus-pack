import {
    existsSync,
    outputFileSync,
    readdirSync,
    readFileSync,
    readJsonSync,
} from 'fs-extra'
import { compressSync, hash, ResourceType, SRL } from 'sonolus-core'
import { gzipSync } from 'zlib'
import { Parser } from './schemas/parser'
import { getSRLParser } from './schemas/srl'

type ParserFromInfo<T> = Parser<{
    [key in keyof T as T[key] extends SRL<ResourceType> ? never : key]: T[key]
}>
type ResourcesFromInfo<T> = {
    [key in keyof T as T[key] extends SRL<ResourceType> | undefined
        ? key
        : never]-?: T[key] extends SRL<infer U> | undefined
        ? T[key] extends SRL<ResourceType>
            ? { type: U; ext: string }
            : { type: U; ext: string; optional: true }
        : never
}

export function processInfos<T>(
    pathInput: string,
    pathOutput: string,
    dirname: string,
    infos: T[],
    infoParser: ParserFromInfo<Omit<T, 'name'>>,
    resources: ResourcesFromInfo<Omit<T, 'name'>>
) {
    const pathDir = `${pathInput}/${dirname}`

    if (!existsSync(pathDir)) return

    readdirSync(pathDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .forEach(({ name }) =>
            infos.push({
                name,
                ...processInfo(
                    `${pathDir}/${name}`,
                    pathOutput,
                    infoParser,
                    resources
                ),
            } as unknown as T)
        )
}

export function processInfo<T>(
    path: string,
    pathOutput: string,
    infoParser: ParserFromInfo<T>,
    resources: ResourcesFromInfo<T>
) {
    console.log('[INFO]', 'Packing:', path)

    if (!existsSync(`${path}/info.json`))
        throw `${path}/info.json: does not exist`

    const info = infoParser(
        readJsonSync(`${path}/info.json`),
        `${path}/info.json`
    )

    const output = {}
    Object.entries(
        resources as Record<
            string,
            { type: ResourceType; ext: string; optional: boolean }
        >
    ).forEach(([name, { type, ext, optional }]) =>
        Object.assign(output, {
            [name]: processResource(
                `${path}/${name}`,
                pathOutput,
                type,
                ext,
                optional
            ),
        })
    )

    return { ...info, ...output } as T
}

function processResource(
    pathFile: string,
    pathOutput: string,
    type: ResourceType,
    ext: string,
    optional: boolean
) {
    let output: { buffer: Buffer } | { srl: SRL<ResourceType> }

    const pathFileSRL = `${pathFile}.srl`
    const pathFileExt = `${pathFile}.${ext}`

    if (existsSync(pathFileSRL)) {
        const srlParser = getSRLParser(type)
        output = { srl: srlParser(readJsonSync(pathFileSRL), pathFileSRL) }
    } else if (existsSync(`${pathFile}`)) {
        output = { buffer: readFileSync(`${pathFile}`) }
    } else if (existsSync(pathFileExt)) {
        if (ext === 'json') {
            const json = readJsonSync(pathFileExt)
            output = { buffer: compressSync(json) }
        } else if (ext === 'bin') {
            output = {
                buffer: gzipSync(readFileSync(pathFileExt), { level: 9 }),
            }
        } else {
            output = { buffer: readFileSync(pathFileExt) }
        }
    } else if (optional) {
        console.log(
            '[INFO]',
            `${pathFile}[.${ext}/.srl]: does not exist, skipped`
        )
        return
    } else {
        console.log('[WARNING]', `${pathFile}[.${ext}/.srl]: does not exist`)
        output = { srl: { type, hash: '', url: '' } }
    }

    if ('buffer' in output) {
        const outputHash = hash(output.buffer)
        outputFileSync(
            `${pathOutput}/repository/${type}/${outputHash}`,
            output.buffer
        )
        output = {
            srl: {
                type,
                hash: outputHash,
                url: `/sonolus/repository/${type}/${outputHash}`,
            },
        }
    }

    return output.srl
}
