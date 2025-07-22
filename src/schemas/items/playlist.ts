import { Type } from '@sinclair/typebox'
import { DatabasePlaylistItem } from '@sonolus/core'
import { Expect } from '../../utils/test.js'
import { localizationTextSchema } from '../localizationText.js'
import { databaseTagSchema } from '../tag.js'
import { PartialDatabaseItemSchemaToMatch } from './test.js'

export const partialDatabasePlaylistItemSchema = Type.Object({
    version: Type.Literal(1),
    title: localizationTextSchema,
    subtitle: localizationTextSchema,
    author: localizationTextSchema,
    tags: Type.Array(databaseTagSchema),
    description: Type.Optional(localizationTextSchema),
    levels: Type.Array(Type.String()),
    meta: Type.Optional(Type.Unknown()),
})

type _Tests = Expect<
    [
        PartialDatabaseItemSchemaToMatch<
            typeof partialDatabasePlaylistItemSchema,
            DatabasePlaylistItem
        >,
    ]
>
