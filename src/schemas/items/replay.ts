import { Type } from '@sinclair/typebox'
import { DatabaseReplayItem } from '@sonolus/core'
import { Expect } from '../../utils/test'
import { localizationTextSchema } from '../localizationText'
import { databaseTagSchema } from '../tag'
import { PartialDatabaseItemSchemaToMatch } from './test'

export const partialDatabaseReplayItemSchema = Type.Object({
    version: Type.Literal(1),
    title: localizationTextSchema,
    subtitle: localizationTextSchema,
    author: localizationTextSchema,
    tags: Type.Array(databaseTagSchema),
    description: Type.Optional(localizationTextSchema),
    level: Type.String(),
    meta: Type.Optional(Type.Unknown()),
})

type _Tests = Expect<
    [PartialDatabaseItemSchemaToMatch<typeof partialDatabaseReplayItemSchema, DatabaseReplayItem>]
>
