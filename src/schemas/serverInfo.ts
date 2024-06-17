import { Type } from '@sinclair/typebox'
import { DatabaseServerInfo } from '@sonolus/core'
import { Expect } from '../utils/test'
import { localizationTextSchema } from './localizationText'
import { PartialDatabaseSchemaToMatch } from './test'

export const partialDatabaseServerInfoSchema = Type.Object({
    title: localizationTextSchema,
    description: Type.Optional(localizationTextSchema),
})

type _Tests = Expect<
    [PartialDatabaseSchemaToMatch<typeof partialDatabaseServerInfoSchema, DatabaseServerInfo>]
>
