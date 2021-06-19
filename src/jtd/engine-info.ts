import Ajv, { JTDSchemaType } from 'ajv/dist/jtd'
import { LocalizationText, localizationTextSchema } from './localization-text'

export type EngineInfo = {
    version: number
    title: LocalizationText
    subtitle: LocalizationText
    author: LocalizationText
    description: LocalizationText
    skin: string
    background: string
    effect: string
    particle: string
    meta?: unknown
}

export const engineInfoSchema: JTDSchemaType<EngineInfo> = {
    properties: {
        version: { type: 'uint32' },
        title: localizationTextSchema,
        subtitle: localizationTextSchema,
        author: localizationTextSchema,
        description: localizationTextSchema,
        skin: { type: 'string' },
        background: { type: 'string' },
        effect: { type: 'string' },
        particle: { type: 'string' },
    },
    optionalProperties: {
        meta: {},
    },
}

export const engineInfoParser = new Ajv().compileParser(engineInfoSchema)
