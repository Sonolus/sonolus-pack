import { existsSync, outputFileSync, readdirSync, readFileSync, readJsonSync } from 'fs-extra'
import { compressSync, hash, ResourceType, SRL } from 'sonolus-core'
import { gzipSync } from 'zlib'
import { Parser } from './schemas/parser'
import { getSRLParser } from './schemas/srl'

type ParserFrom<T> = Parser<{
    [key in keyof T as T[key] extends SRL<ResourceType> ? never : key]: T[key]
}>
type ResourcesFrom<T> = {
    [key in keyof T as T[key] extends SRL<ResourceType> | undefined
        ? key
        : never]-?: T[key] extends SRL<infer U> | undefined
        ? T[key] extends SRL<ResourceType>
            ? { type: U; ext: string }
            : { type: U; ext: string; optional: true }
        : never
}

export const processItems = <T>(
    pathInput: string,
    pathOutput: string,
    dirname: string,
    items: T[],
    parser: ParserFrom<Omit<T, 'name'>>,
    resources: ResourcesFrom<Omit<T, 'name'>>,
) => {
    const pathDir = `${pathInput}/${dirname}`

    if (!existsSync(pathDir)) return

    readdirSync(pathDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .forEach(({ name }) =>
            items.push({
                name,
                ...processItem(`${pathDir}/${name}`, pathOutput, 'item', parser, resources),
            } as unknown as T),
        )
}

export const processItem = <T>(
    pathInput: string,
    pathOutput: string,
    filename: string,
    parser: ParserFrom<T>,
    resources: ResourcesFrom<T>,
) => {
    console.log('[INFO]', 'Packing:', pathInput)

    if (!existsSync(`${pathInput}/${filename}.json`))
        throw new Error(`${pathInput}/${filename}.json: does not exist`)

    const item = parser(
        readJsonSync(`${pathInput}/${filename}.json`),
        `${pathInput}/${filename}.json`,
    )

    const output = {}
    Object.entries(
        resources as Record<string, { type: ResourceType; ext: string; optional: boolean }>,
    ).forEach(([name, { type, ext, optional }]) =>
        Object.assign(output, {
            [name]: processResource(`${pathInput}/${name}`, pathOutput, type, ext, optional),
        }),
    )

    return { ...item, ...output } as T
}

const processResource = (
    pathFile: string,
    pathOutput: string,
    type: ResourceType,
    ext: string,
    optional: boolean,
) => {
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
            const json: unknown = readJsonSync(pathFileExt)
            output = { buffer: compressSync(json) }
        } else if (ext === 'bin') {
            output = {
                buffer: gzipSync(readFileSync(pathFileExt), { level: 9 }),
            }
        } else {
            output = { buffer: readFileSync(pathFileExt) }
        }
    } else if (optional) {
        console.log('[INFO]', `${pathFile}[.${ext}/.srl]: does not exist, skipped`)
        return
    } else {
        console.log('[WARNING]', `${pathFile}[.${ext}/.srl]: does not exist`)
        output = { srl: { type, hash: '', url: '' } }
    }

    if ('buffer' in output) {
        const outputHash = hash(output.buffer)
        outputFileSync(`${pathOutput}/repository/${type}/${outputHash}`, output.buffer)
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
