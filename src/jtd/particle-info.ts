import Ajv, { JTDSchemaType } from 'ajv/dist/jtd'
import { LocalizationText, localizationTextSchema } from './localization-text'

export type ParticleInfo = {
    version: number
    title: LocalizationText
    subtitle: LocalizationText
    author: LocalizationText
    description: LocalizationText
    meta?: unknown
}

export const particleInfoSchema: JTDSchemaType<ParticleInfo> = {
    properties: {
        version: { type: 'uint32' },
        title: localizationTextSchema,
        subtitle: localizationTextSchema,
        author: localizationTextSchema,
        description: localizationTextSchema,
    },
    optionalProperties: {
        meta: {},
    },
}

export const particleInfoParser = new Ajv().compileParser(particleInfoSchema)
