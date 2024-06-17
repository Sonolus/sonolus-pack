import { Type } from '@sinclair/typebox'
import { DatabaseParticleItem } from '@sonolus/core'
import { Expect } from '../../utils/test'
import { localizationTextSchema } from '../localizationText'
import { databaseTagSchema } from '../tag'
import { PartialDatabaseItemSchemaToMatch } from './test'

export const partialDatabaseParticleItemSchema = Type.Object({
    version: Type.Literal(3),
    title: localizationTextSchema,
    subtitle: localizationTextSchema,
    author: localizationTextSchema,
    tags: Type.Array(databaseTagSchema),
    description: localizationTextSchema,
    meta: Type.Optional(Type.Unknown()),
})

type _Tests = Expect<
    [
        PartialDatabaseItemSchemaToMatch<
            typeof partialDatabaseParticleItemSchema,
            DatabaseParticleItem
        >,
    ]
>
