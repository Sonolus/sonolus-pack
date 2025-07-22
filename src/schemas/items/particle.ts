import { Type } from '@sinclair/typebox'
import { DatabaseParticleItem } from '@sonolus/core'
import { Expect } from '../../utils/test.js'
import { localizationTextSchema } from '../localizationText.js'
import { databaseTagSchema } from '../tag.js'
import { PartialDatabaseItemSchemaToMatch } from './test.js'

export const partialDatabaseParticleItemSchema = Type.Object({
    version: Type.Literal(3),
    title: localizationTextSchema,
    subtitle: localizationTextSchema,
    author: localizationTextSchema,
    tags: Type.Array(databaseTagSchema),
    description: Type.Optional(localizationTextSchema),
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
