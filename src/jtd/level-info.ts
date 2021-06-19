import Ajv, { JTDSchemaType } from 'ajv/dist/jtd'
import { LocalizationText, localizationTextSchema } from './localization-text'

type Use = {
    useDefault: boolean
    item?: string
}

const useSchema: JTDSchemaType<Use> = {
    properties: {
        useDefault: { type: 'boolean' },
    },
    optionalProperties: {
        item: { type: 'string' },
    },
}

export type LevelInfo = {
    version: number
    rating: number
    engine: string
    useSkin: Use
    useBackground: Use
    useEffect: Use
    useParticle: Use
    title: LocalizationText
    artists: LocalizationText
    author: LocalizationText
    description: LocalizationText
    meta?: unknown
}

export const levelInfoSchema: JTDSchemaType<LevelInfo> = {
    properties: {
        version: { type: 'uint32' },
        rating: { type: 'float32' },
        engine: { type: 'string' },
        useSkin: useSchema,
        useBackground: useSchema,
        useEffect: useSchema,
        useParticle: useSchema,
        title: localizationTextSchema,
        artists: localizationTextSchema,
        author: localizationTextSchema,
        description: localizationTextSchema,
    },
    optionalProperties: {
        meta: {},
    },
}

export const levelInfoParser = new Ajv().compileParser(levelInfoSchema)
