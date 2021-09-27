import {
    existsSync,
    outputFileSync,
    readdirSync,
    readFileSync,
    readJsonSync,
} from 'fs-extra'
import { compressSync, hash, ResourceType, SRL } from 'sonolus-core'
import { Parser } from './schemas/parser'
import { getSRLParser } from './schemas/srl'

type JsonProcessor = (json: unknown, path: string) => unknown

type Resource = {
    type: ResourceType
    ext: string
    jsonProcessor?: JsonProcessor
}

export function processInfos<T>(
    pathInput: string,
    pathOutput: string,
    dirname: string,
    infos: (T & { name: string })[],
    infoParser: Parser<T>,
    resources: Record<string, Resource>
) {
    const pathDir = `${pathInput}/${dirname}`

    if (!existsSync(pathDir)) return

    readdirSync(pathDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .forEach(({ name }) => {
            const path = `${pathDir}/${name}`
            console.log('[INFO]', 'Packing:', path)

            if (!existsSync(`${path}/info.json`))
                throw `${path}/info.json: does not exist`

            const info = infoParser(
                readJsonSync(`${path}/info.json`),
                `${path}/info.json`
            )

            const output = {}
            Object.entries(resources).forEach(
                ([name, { type, ext, jsonProcessor }]) =>
                    Object.assign(output, {
                        [name]: processResource(
                            `${path}/${name}`,
                            pathOutput,
                            type,
                            ext,
                            jsonProcessor
                        ),
                    })
            )

            infos.push({ name, ...info, ...output })
        })
}

export function processResource(
    pathFile: string,
    pathOutput: string,
    type: ResourceType,
    ext: string,
    jsonProcessor: JsonProcessor = (json) => json
) {
    let output: { buffer: Buffer } | { srl: SRL<typeof type> }

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
            output = { buffer: compressSync(jsonProcessor(json, pathFile)) }
        } else {
            output = { buffer: readFileSync(pathFileExt) }
        }
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
                url: `/repository/${type}/${outputHash}`,
            },
        }
    }

    return output.srl
}
