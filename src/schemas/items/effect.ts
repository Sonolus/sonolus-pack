import { Type } from '@sinclair/typebox'
import { DatabaseEffectItem } from '@sonolus/core'
import { Expect } from '../../utils/test'
import { localizationTextSchema } from '../localizationText'
import { databaseTagSchema } from '../tag'
import { PartialDatabaseItemSchemaToMatch } from './test'

export const partialDatabaseEffectItemSchema = Type.Object({
    version: Type.Literal(5),
    title: localizationTextSchema,
    subtitle: localizationTextSchema,
    author: localizationTextSchema,
    tags: Type.Array(databaseTagSchema),
    description: Type.Optional(localizationTextSchema),
    meta: Type.Optional(Type.Unknown()),
})

type _Tests = Expect<
    [PartialDatabaseItemSchemaToMatch<typeof partialDatabaseEffectItemSchema, DatabaseEffectItem>]
>
