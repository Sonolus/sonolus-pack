import { Type } from '@sinclair/typebox'
import { DatabaseEngineItem } from '@sonolus/core'
import { Expect } from '../../utils/test'
import { localizationTextSchema } from '../localizationText'
import { databaseTagSchema } from '../tag'
import { PartialDatabaseItemSchemaToMatch } from './test'

export const partialDatabaseEngineItemSchema = Type.Object({
    version: Type.Literal(12),
    title: localizationTextSchema,
    subtitle: localizationTextSchema,
    author: localizationTextSchema,
    tags: Type.Array(databaseTagSchema),
    description: Type.Optional(localizationTextSchema),
    skin: Type.String(),
    background: Type.String(),
    effect: Type.String(),
    particle: Type.String(),
    meta: Type.Optional(Type.Unknown()),
})

type _Tests = Expect<
    [PartialDatabaseItemSchemaToMatch<typeof partialDatabaseEngineItemSchema, DatabaseEngineItem>]
>
