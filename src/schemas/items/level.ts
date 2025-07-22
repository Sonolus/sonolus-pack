import { Type } from '@sinclair/typebox'
import { DatabaseLevelItem, DatabaseUseItem } from '@sonolus/core'
import { Expect } from '../../utils/test.js'
import { localizationTextSchema } from '../localizationText.js'
import { databaseTagSchema } from '../tag.js'
import { SchemaToMatch } from '../test.js'
import { PartialDatabaseItemSchemaToMatch } from './test.js'

const databaseUseItemSchema = Type.Union([
    Type.Object({ useDefault: Type.Literal(true) }),
    Type.Object({ useDefault: Type.Literal(false), item: Type.String() }),
])

export const partialDatabaseLevelItemSchema = Type.Object({
    version: Type.Literal(1),
    rating: Type.Number(),
    title: localizationTextSchema,
    artists: localizationTextSchema,
    author: localizationTextSchema,
    tags: Type.Array(databaseTagSchema),
    description: Type.Optional(localizationTextSchema),
    engine: Type.String(),
    useSkin: databaseUseItemSchema,
    useBackground: databaseUseItemSchema,
    useEffect: databaseUseItemSchema,
    useParticle: databaseUseItemSchema,
    meta: Type.Optional(Type.Unknown()),
})

type _Tests = Expect<
    [
        SchemaToMatch<typeof databaseUseItemSchema, DatabaseUseItem>,
        PartialDatabaseItemSchemaToMatch<typeof partialDatabaseLevelItemSchema, DatabaseLevelItem>,
    ]
>
