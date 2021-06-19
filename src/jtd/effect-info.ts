import Ajv, { JTDSchemaType } from 'ajv/dist/jtd'
import { LocalizationText, localizationTextSchema } from './localization-text'

export type EffectInfo = {
    version: number
    title: LocalizationText
    subtitle: LocalizationText
    author: LocalizationText
    description: LocalizationText
    meta?: unknown
}

export const effectInfoSchema: JTDSchemaType<EffectInfo> = {
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

export const effectInfoParser = new Ajv().compileParser(effectInfoSchema)
