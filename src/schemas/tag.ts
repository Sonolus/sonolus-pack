import { Type } from '@sinclair/typebox'
import { DatabaseTag, Icon } from '@sonolus/core'
import { Expect } from '../utils/test'
import { localizationTextSchema } from './localizationText'
import { SchemaToMatch } from './test'

export const databaseTagSchema = Type.Object({
    title: localizationTextSchema,
    icon: Type.Optional(Type.Union(Object.values(Icon).map((icon) => Type.Literal(icon)))),
})

type _Tests = Expect<[SchemaToMatch<typeof databaseTagSchema, DatabaseTag>]>
