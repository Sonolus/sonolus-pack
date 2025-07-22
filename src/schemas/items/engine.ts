import { Type } from '@sinclair/typebox'
import { DatabaseEngineItem } from '@sonolus/core'
import { Expect } from '../../utils/test.js'
import { localizationTextSchema } from '../localizationText.js'
import { databaseTagSchema } from '../tag.js'
import { PartialDatabaseItemSchemaToMatch } from './test.js'

export const partialDatabaseEngineItemSchema = Type.Object({
    version: Type.Literal(13),
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
