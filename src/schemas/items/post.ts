import { Type } from '@sinclair/typebox'
import { DatabasePostItem } from '@sonolus/core'
import { Expect } from '../../utils/test'
import { localizationTextSchema } from '../localizationText'
import { databaseTagSchema } from '../tag'
import { PartialDatabaseItemSchemaToMatch } from './test'

export const partialDatabasePostItemSchema = Type.Object({
    version: Type.Literal(1),
    title: localizationTextSchema,
    time: Type.Number(),
    author: localizationTextSchema,
    tags: Type.Array(databaseTagSchema),
    description: localizationTextSchema,
    meta: Type.Optional(Type.Unknown()),
})

type _Tests = Expect<
    [PartialDatabaseItemSchemaToMatch<typeof partialDatabasePostItemSchema, DatabasePostItem>]
>
