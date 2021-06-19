import Ajv, { JTDSchemaType } from 'ajv/dist/jtd'
import { LocalizationText, localizationTextSchema } from './localization-text'

export type BackgroundInfo = {
    version: number
    title: LocalizationText
    subtitle: LocalizationText
    author: LocalizationText
    description: LocalizationText
    meta?: unknown
}

export const backgroundInfoSchema: JTDSchemaType<BackgroundInfo> = {
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

export const backgroundInfoParser = new Ajv().compileParser(
    backgroundInfoSchema
)
