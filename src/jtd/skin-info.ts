import Ajv, { JTDSchemaType } from 'ajv/dist/jtd'
import { LocalizationText, localizationTextSchema } from './localization-text'

export type SkinInfo = {
    version: number
    title: LocalizationText
    subtitle: LocalizationText
    author: LocalizationText
    description: LocalizationText
    meta?: unknown
}

export const skinInfoSchema: JTDSchemaType<SkinInfo> = {
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

export const skinInfoParser = new Ajv().compileParser(skinInfoSchema)
