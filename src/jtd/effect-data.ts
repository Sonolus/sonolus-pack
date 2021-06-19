import Ajv, { JTDSchemaType } from 'ajv/dist/jtd'

export interface EffectData {
    clips: {
        name: string
    }[]
}

export const effectDataSchema: JTDSchemaType<EffectData> = {
    properties: {
        clips: {
            elements: {
                properties: {
                    name: { type: 'string' },
                },
                additionalProperties: true,
            },
        },
    },
    additionalProperties: true,
}

export const effectDataValidator = new Ajv().compile(effectDataSchema)
