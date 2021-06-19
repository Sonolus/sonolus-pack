import { JTDParser } from 'ajv/dist/jtd'
import { createHash } from 'crypto'
import {
    existsSync,
    outputFileSync,
    readdirSync,
    readFileSync,
    readJsonSync,
} from 'fs-extra'
import { gzipSync } from 'zlib'
import { WithName } from './jtd/db'
import { getSRLParser, ResourceType, SRL } from './jtd/srl'

type Resource = {
    name: string
    type: ResourceType
    filename?: string
    ext: string
    jsonProcessor?: (json: unknown, path: string) => unknown
}

export function processInfos<T>(
    pathInput: string,
    pathOutput: string,
    dirname: string,
    infos: WithName<T>[],
    infoParser: JTDParser<T>,
    resources: Resource[]
): void {
    const pathDir = `${pathInput}/${dirname}`

    if (existsSync(pathDir)) {
        readdirSync(pathDir, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .forEach(({ name }) => {
                const path = `${pathDir}/${name}`
                console.log('[INFO]', 'Packing:', path)

                if (!existsSync(`${path}/info.json`)) {
                    throw `${path}/info.json: does not exist`
                }

                const info = infoParser(
                    readFileSync(`${path}/info.json`, 'utf-8')
                )
                if (!info) {
                    throw `${path}/info.json(${infoParser.position}): ${infoParser.message}`
                }

                resources.forEach((resource) =>
                    processResource(pathOutput, path, info, resource)
                )

                infos.push({ name, ...info })
            })
    }
}

export function processResource(
    pathOutput: string,
    path: string,
    info: unknown,
    { name, type, filename, ext, jsonProcessor }: Resource
): void {
    filename = filename || name
    jsonProcessor = jsonProcessor || ((json) => json)

    let output: { buffer: Buffer } | { srl: SRL<typeof type> }

    if (existsSync(`${path}/${filename}.srl`)) {
        const srlParser = getSRLParser(type)
        const srl = srlParser(readFileSync(`${path}/${filename}.srl`, 'utf-8'))
        if (!srl) {
            throw `${path}/${filename}.srl(${srlParser.position}): ${srlParser.message}`
        }
        output = { srl }
    } else if (existsSync(`${path}/${filename}`)) {
        output = { buffer: readFileSync(`${path}/${filename}`) }
    } else if (existsSync(`${path}/${filename}.${ext}`)) {
        if (ext === 'json') {
            const json = readJsonSync(`${path}/${filename}.json`)
            output = {
                buffer: gzipSync(JSON.stringify(jsonProcessor(json, path)), {
                    level: 9,
                }),
            }
        } else {
            output = { buffer: readFileSync(`${path}/${filename}.${ext}`) }
        }
    } else {
        console.log(
            '[WARNING]',
            `${path}/${filename}[.${ext}/.srl]: does not exist`
        )
        output = {
            srl: {
                type,
                hash: '',
                url: '',
            },
        }
    }

    if ('buffer' in output) {
        const hash = createHash('sha1').update(output.buffer).digest('hex')
        outputFileSync(
            `${pathOutput}/repository/${type}/${hash}`,
            output.buffer
        )
        output = {
            srl: {
                type,
                hash,
                url: `/repository/${type}/${hash}`,
            },
        }
    }

    Object.assign(info, { [name]: output.srl })
}
