import { Type } from '@sinclair/typebox'
import { DatabasePostItem } from '@sonolus/core'
import { Expect } from '../../utils/test.js'
import { localizationTextSchema } from '../localizationText.js'
import { databaseTagSchema } from '../tag.js'
import { PartialDatabaseItemSchemaToMatch } from './test.js'

export const partialDatabasePostItemSchema = Type.Object({
    version: Type.Literal(1),
    title: localizationTextSchema,
    time: Type.Number(),
    author: localizationTextSchema,
    tags: Type.Array(databaseTagSchema),
    description: Type.Optional(localizationTextSchema),
    meta: Type.Optional(Type.Unknown()),
})

type _Tests = Expect<
    [PartialDatabaseItemSchemaToMatch<typeof partialDatabasePostItemSchema, DatabasePostItem>]
>
